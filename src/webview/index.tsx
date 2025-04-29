declare function acquireVsCodeApi(): {
  postMessage: (message: any) => void;
};

import * as React from "react";
import * as ReactDOM from "react-dom/client";

const vscode = acquireVsCodeApi();

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

const App = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [chatLog, setChatLog] = React.useState<ChatMessage[]>([]);

  const handleSend = () => {
    if (inputValue.trim() !== "") {
      vscode.postMessage({
        type: "sendMessage",
        text: inputValue,
      });
      setChatLog((prev) => [...prev, { sender: "user", text: inputValue }]);
      setInputValue("");
    }
  };

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "aiReply") {
        setChatLog((prev) => [...prev, { sender: "ai", text: message.text }]);
      }
    });
  }, []);

  return (
    <div
      style={{
        padding: "16px",
        height: "100vh",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <h1>Study Continue</h1>
      <div style={{ marginBottom: "16px" }}>
        {chatLog.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-start" : "flex-end",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                maxWidth: "60%",
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#E8E8E8",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, marginRight: "8px", padding: "8px" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
