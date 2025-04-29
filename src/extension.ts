import * as vscode from "vscode";
import * as dotenv from "dotenv"; // 🔥 추가
dotenv.config(); // 🔥 추가

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "study-continue" is now active!'
  );
  const disposable = vscode.commands.registerCommand(
    "study-continue.helloWorld",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "studyContinueWebview", // internal ID (아무렇게나, 고유하면 됨)
        "Study Continue", // 탭 제목
        vscode.ViewColumn.One, // 열 위치
        {
          enableScripts: true,
        } // Webview 옵션 (지금은 비어둠)
      );
      // Webview에 표시할 HTML 내용 설정
      panel.webview.html = getWebviewContent(
        panel.webview,
        context.extensionUri
      );

      // ✨ [추가해야 할 부분 시작] ✨
      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.type) {
            case "sendMessage":
              vscode.window.showInformationMessage(
                `Webview says: ${message.text}`
              );

              // 🔥 OpenAI API 호출
              try {
                const response = await fetch(
                  "https://api.together.xyz/v1/chat/completions",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
                    },
                    body: JSON.stringify({
                      model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // 추천 모델
                      messages: [{ role: "user", content: message.text }],
                    }),
                  }
                );

                const data = await response.json();
                console.log("data>>>>>", data);
                const reply =
                  data.choices?.[0]?.message?.content ?? "No response";

                // 🔥 Webview로 응답 전송
                panel.webview.postMessage({
                  type: "aiReply",
                  text: reply,
                });
              } catch (error) {
                console.error("OpenAI API 호출 실패:", error);
              }

              break;
          }
        },
        undefined,
        context.subscriptions
      );
      // ✨ [추가해야 할 부분 끝] ✨
    }
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "webview.js")
  );

  return `
	  <!DOCTYPE html>
	  <html lang="en">
	  <head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Study Continue</title>
	  </head>
	  <body>
		<div id="root"></div>
		<script src="${scriptUri}"></script>
	  </body>
	  </html>
	`;
}

export function deactivate() {}
