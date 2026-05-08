const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent`;

const HYDROPONIC_SYSTEM_PROMPT =
  "You are an expert hydroponic farming assistant. Analyze plant health, detect possible diseases, and suggest actionable solutions in simple language for Indian farmers. Keep answers practical and short.";

const getGeminiText = (response) => {
  return (response.candidates || [])
    .flatMap((candidate) => candidate.content?.parts || [])
    .filter((part) => part.text)
    .map((part) => part.text)
    .join("\n");
};

const parseJsonResponse = (text) => {
  const cleanText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    return {
      plantCondition: "Analysis completed",
      disease: "Unable to confirm from image",
      confidence: "Low",
      suggestedSolution: cleanText || "Please upload a clearer image and try again."
    };
  }
};

const callGemini = async (payload) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_key_here") {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error?.message || "Gemini API request failed");
    error.statusCode = response.status;
    throw error;
  }

  return data;
};

const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Plant image is required"
      });
    }

    const base64Image = req.file.buffer.toString("base64");

    const aiResponse = await callGemini({
      system_instruction: {
        parts: [{ text: HYDROPONIC_SYSTEM_PROMPT }]
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Analyze this hydroponic plant image. Return only valid JSON with keys: plantCondition, disease, confidence, suggestedSolution. Keep the solution practical for an Indian farmer."
            },
            {
              inline_data: {
                mime_type: req.file.mimetype,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const text = getGeminiText(aiResponse);

    return res.json({
      success: true,
      diagnosis: parseJsonResponse(text)
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to analyze plant image",
      error: error.message
    });
  }
};

const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const aiResponse = await callGemini({
      system_instruction: {
        parts: [{ text: HYDROPONIC_SYSTEM_PROMPT }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: message.trim() }]
        }
      ]
    });

    return res.json({
      success: true,
      reply: getGeminiText(aiResponse)
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to get AI response",
      error: error.message
    });
  }
};

module.exports = {
  analyzeImage,
  chatWithAssistant
};
