import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div>
      <h1>Hello from React!</h1>
      <p>This React app is running inside a VS Code Webview!</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
