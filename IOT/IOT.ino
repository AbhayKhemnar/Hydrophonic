#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char *ssid = "MCA_DEPARTMENT";
const char *password = "987654321";

// Render backend URL
const char *apiBase = "https://hydrophonic.onrender.com/api/device-commands";

// Farmer Abhay MongoDB _id
const char *farmerId = "69f2f17c1ab7dbfd445d90f0";
const char *deviceId = "esp32-main";

// Relay GPIO pins
const int relay1Pin = 26;
const int relay2Pin = 27;

void connectWiFi() {
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
}

void applyRelayCommand(const String &device, const String &action) {
  int outputValue = action == "ON" ? HIGH : LOW;

  if (device == "relay1" || device == "pump") {
    digitalWrite(relay1Pin, outputValue);
    Serial.println("Relay 1 updated");
  } else if (device == "relay2" || device == "fogger" || device == "fan") {
    digitalWrite(relay2Pin, outputValue);
    Serial.println("Relay 2 updated");
  }
}

void markExecuted(const String &commandId) {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  String executedUrl = String(apiBase) + "/" + commandId + "/executed";

  http.begin(client, executedUrl);
  http.setTimeout(20000);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.PUT("{}");
  Serial.print("Mark executed status: ");
  Serial.println(httpCode);

  http.end();
}

void pollCommands() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  String latestUrl = String(apiBase) + "/latest/" + farmerId + "?deviceId=" + deviceId;
  http.begin(client, latestUrl);
  http.setTimeout(20000);


  int httpCode = http.GET();

  if (httpCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(2048);
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
      Serial.println("Failed to parse JSON");
      http.end();
      return;
    }

    bool hasCommand = doc["hasCommand"] | false;

    if (!hasCommand) {
      Serial.println("No pending command");
      http.end();
      return;
    }

    String commandId = doc["command"]["_id"].as<String>();
    String device = doc["command"]["device"].as<String>();
    String action = doc["command"]["action"].as<String>();

    Serial.println("Executing command");
    Serial.println(device + " -> " + action);

    applyRelayCommand(device, action);
    markExecuted(commandId);
  } else {
    Serial.print("GET command failed: ");
    Serial.println(httpCode);
  }

  http.end();
}

void setup() {
  Serial.begin(115200);

  pinMode(relay1Pin, OUTPUT);
  pinMode(relay2Pin, OUTPUT);

  digitalWrite(relay1Pin, LOW);
  digitalWrite(relay2Pin, LOW);

  connectWiFi();
}

void loop() {
  pollCommands();
  delay(3000);
}
