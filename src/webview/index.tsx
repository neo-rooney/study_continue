declare function acquireVsCodeApi(): {
  postMessage: (message: any) => void;
};

import * as React from "react";
import * as ReactDOM from "react-dom/client";

const vscode = acquireVsCodeApi();

interface ChatMessage {
  sender: "user" | "ai" | "loading";
  text: string;
}

const App = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [chatLog, setChatLog] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false); // 🔥 추가: 로딩 상태

  const handleSend = () => {
    if (inputValue.trim() !== "") {
      vscode.postMessage({
        type: "sendMessage",
        text: inputValue,
      });
      setChatLog((prev) => [
        ...prev,
        { sender: "user", text: inputValue },
        { sender: "loading", text: "AI is typing..." }, // 🔥 로딩 메시지 추가
      ]);
      setInputValue("");
      setIsLoading(true); // 🔥 로딩 시작
    }
  };

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "aiReply") {
        setChatLog((prev) => {
          // 가장 마지막 "loading" 메시지를 실제 AI 답변으로 교체
          const updated = [...prev];
          const loadingIndex = updated.findIndex(
            (msg) => msg.sender === "loading"
          );
          if (loadingIndex !== -1) {
            updated[loadingIndex] = { sender: "ai", text: message.text };
          } else {
            updated.push({ sender: "ai", text: message.text });
          }
          return updated;
        });
        setIsLoading(false); // 🔥 로딩 종료
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Study Continue</h1>
      <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: "16px" }}>
        {chatLog.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user"
                  ? "flex-start"
                  : msg.sender === "ai"
                  ? "flex-end"
                  : "center",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                maxWidth: "60%",
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor:
                  msg.sender === "user"
                    ? "#DCF8C6"
                    : msg.sender === "ai"
                    ? "#E8E8E8"
                    : "#F0F0F0",
                fontStyle: msg.sender === "loading" ? "italic" : "normal",
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
          disabled={isLoading} // 🔥 입력창 비활성화(optional)
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
