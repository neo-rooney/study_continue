import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "study-continue" is now active!');
	const disposable = vscode.commands.registerCommand('study-continue.helloWorld', () => {
		const panel = vscode.window.createWebviewPanel(
			'studyContinueWebview',      // internal ID (아무렇게나, 고유하면 됨)
			'Study Continue',            // 탭 제목
			vscode.ViewColumn.One,       // 열 위치
			{
				enableScripts:true
			}                           // Webview 옵션 (지금은 비어둠)
		);
		// Webview에 표시할 HTML 내용 설정
		panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	const scriptUri = webview.asWebviewUri(
	  vscode.Uri.joinPath(extensionUri, 'media', 'webview.js')
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
