import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/ai";

function AIAssistant() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [imageError, setImageError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Ask me about pH, nutrients, yellow leaves, slow growth, or hydroponic crop care."
    }
  ]);
  const [chatError, setChatError] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setDiagnosis(null);
    setImageError("");

    if (!file) {
      setSelectedImage(null);
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      setImageError("Upload a plant image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    setIsAnalyzing(true);
    setImageError("");

    try {
      const res = await axios.post(`${API_BASE}/analyze-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setDiagnosis(res.data.diagnosis);
    } catch (error) {
      console.error(error);
      setImageError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to analyze image."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    setChatError("");
    setMessage("");
    setChatMessages((items) => [...items, { role: "user", text: cleanMessage }]);
    setIsChatLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, { message: cleanMessage });
      setChatMessages((items) => [...items, { role: "assistant", text: res.data.reply }]);
    } catch (error) {
      console.error(error);
      setChatError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "AI assistant is unavailable."
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            AI Vision
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">Plant Image Analysis</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload a clear leaf or plant photo for practical diagnosis.
          </p>
        </div>

        <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          Choose plant image
        </label>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Plant preview"
            className="mt-4 h-56 w-full rounded-lg object-cover"
          />
        )}

        {imageError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {imageError}
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyzeImage}
          disabled={isAnalyzing}
          className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Image"}
        </button>

        {diagnosis && (
          <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <h3 className="font-bold text-emerald-950">AI Diagnosis</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-700">Plant condition</dt>
                <dd className="text-slate-600">{diagnosis.plantCondition}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Disease</dt>
                <dd className="text-slate-600">{diagnosis.disease}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Confidence</dt>
                <dd className="text-slate-600">{diagnosis.confidence}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Suggested solution</dt>
                <dd className="text-slate-600">{diagnosis.suggestedSolution}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            AI Chat
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">Hydroponic Assistant</h2>
        </div>

        <div className="flex h-[420px] flex-col rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {chatMessages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 ${
                    item.role === "user"
                      ? "bg-sky-700 text-white"
                      : "bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="text-sm font-medium text-slate-500">Assistant is typing...</div>
            )}
          </div>

          {chatError && (
            <div className="mx-4 mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {chatError}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-3 border-t border-slate-200 bg-white p-3">
            <input
              type="text"
              placeholder="Ask about pH, yellow leaves, nutrients..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="submit"
              disabled={isChatLoading}
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AIAssistant;
