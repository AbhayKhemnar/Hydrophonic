#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi
const char* ssid = "MCA_DEPARTMENT";
const char* password = "987654321";

// 🔥 CONTROL API (IMPORTANT)
const char* serverUrl = "http://192.168.43.33:5000/api/sensor/control";

// Pins
int pumpPin = 5;
int foggerPin = 18;

void setup() {
  Serial.begin(115200);

  pinMode(pumpPin, OUTPUT);
  pinMode(foggerPin, OUTPUT);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }

  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;
    http.begin(serverUrl);

    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println(payload);

      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      String pump = doc["pump"];
      String fogger = doc["fogger"];

      // Pump Control
      if (pump == "ON") {
        digitalWrite(pumpPin, HIGH);
      } else {
        digitalWrite(pumpPin, LOW);
      }

      // Fogger Control
      if (fogger == "ON") {
        digitalWrite(foggerPin, HIGH);
      } else {
        digitalWrite(foggerPin, LOW);
      }
    } else {
      Serial.print("Error Code: ");
      Serial.println(httpCode);
    }

    http.end();
  }

  delay(3000);
}