import { useState } from "react";
import backgroundImg from "./background9.png";

function App() {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const MAX_RESPONSE_LENGTH = 400; // Character limit for bot's reply

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_prompt: userMessage }),
      });

      const data = await res.json();
      let botResponse = data.response;

      // ✅ Make the response concise if it's too long
      if (botResponse.length > MAX_RESPONSE_LENGTH) {
        botResponse = botResponse.substring(0, MAX_RESPONSE_LENGTH) + "…";
      }

      setChatHistory((prev) => [...prev, { sender: "Yara", text: botResponse }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Failed to connect to server." },
      ]);
    }

    setUserMessage("");
  };

  // Speech-to-Text (Voice Input)
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        setUserMessage(event.results[0][0].transcript);
      };
      recognition.onerror = (event) => {
        alert('Speech recognition error: ' + event.error);
      };
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };

  // Copy chat to clipboard
  const copyChat = () => {
    const chatText = chatHistory.map(msg => `${msg.sender === "user" ? "You" : "Yara"}: ${msg.text}`).join("\n");
    navigator.clipboard.writeText(chatText);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1500);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: `url(${backgroundImg}), linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "540px",
        minHeight: "540px",
        background: "rgba(30, 0, 60, 0.95)",
        borderRadius: "18px",
        boxShadow: "0 0 32px 4px #a259ff, 0 2px 8px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 28px 24px 28px",
        position: "relative"
      }}>
        {/* Copy Chat Button */}
        <button
          onClick={copyChat}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "#a259ff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 10px",
            boxShadow: "0 0 8px #a259ff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            transition: "background 0.2s, box-shadow 0.2s"
          }}
          title="Copy chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h11v16z"/>
          </svg>
        </button>
        {/* Toast for copied */}
        {showCopied && (
          <div style={{
            position: "absolute",
            top: 18,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#a259ff",
            color: "#fff",
            padding: "6px 18px",
            borderRadius: "8px",
            fontWeight: 600,
            boxShadow: "0 0 8px #a259ff",
            zIndex: 10,
            fontSize: "1rem"
          }}>
            Copied!
          </div>
        )}
        <h2 style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          letterSpacing: "1px",
          fontWeight: 900,
          fontSize: "2.2rem",
          fontFamily: 'Montserrat, Arial, sans-serif',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span role="img" aria-label="brain" style={{
            filter: "drop-shadow(0 0 8px #ff4ecd) drop-shadow(0 0 16px #ff4ecd)",
            color: "#ff4ecd",
            fontSize: "2.2rem"
          }}>🧠</span>
          <span style={{
            color: "#00fff7",
            textShadow: "0 0 16px #00fff7, 0 0 32px #00fff7, 0 2px 8px #a259ff"
          }}>Yara</span>
        </h2>

        <div style={{
          flex: 1,
          border: "1.5px solid #a259ff",
          padding: "1.2rem",
          borderRadius: "12px",
          overflowY: "auto",
          marginBottom: "1.2rem",
          background: "rgba(60, 0, 100, 0.7)",
          minHeight: "220px",
          boxShadow: "0 0 12px #a259ff"
        }}>
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "0.7rem"
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: "18px",
                  background: msg.sender === "user"
                    ? "linear-gradient(90deg, #a259ff 0%, #e100ff 100%)"
                    : "rgba(255,255,255,0.12)",
                  color: msg.sender === "user" ? "#fff" : "#e0c3fc",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                  fontWeight: 500,
                  fontSize: "1.08rem",
                  boxShadow: msg.sender === "user" ? "0 0 8px #a259ff" : "none"
                }}
              >
                <strong style={{ color: msg.sender === "user" ? "#fff" : "#a259ff" }}>
                  {msg.sender === "user" ? "You" : "Yara"}:
                </strong> {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={startListening}
            style={{
              marginRight: "10px",
              border: "2px solid #a259ff",
              background: "#2d004d",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              padding: 0,
              width: "44px",
              height: "44px",
              boxShadow: "0 0 8px #a259ff",
              transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            title="Speak"
            onMouseOver={e => {
              e.currentTarget.style.borderColor = "#fff";
              e.currentTarget.style.boxShadow = "0 0 16px #e100ff";
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = "#a259ff";
              e.currentTarget.style.boxShadow = "0 0 8px #a259ff";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#a259ff"
              style={{ display: "block" }}
            >
              <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.07 2.13 5.64 5 6.32V21h2v-2.68c2.87-.68 5-3.25 5-6.32h-2z"/>
            </svg>
          </button>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.7rem 1rem",
              borderRadius: "12px",
              border: "2px solid #a259ff",
              background: "#1a0033",
              color: "#fff",
              fontSize: "1.08rem",
              boxShadow: "0 0 8px #a259ff",
              outline: "none"
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "0.7rem 1.3rem",
              marginLeft: "0.7rem",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #a259ff 0%, #e100ff 100%)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: "1.08rem",
              boxShadow: "0 0 12px #a259ff",
              cursor: "pointer",
              letterSpacing: "1px",
              transition: "background 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "linear-gradient(90deg, #e100ff 0%, #a259ff 100%)";
              e.currentTarget.style.boxShadow = "0 0 24px #e100ff";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "linear-gradient(90deg, #a259ff 0%, #e100ff 100%)";
              e.currentTarget.style.boxShadow = "0 0 12px #a259ff";
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
