const path = require('path');

module.exports = {
  mode: 'development', // 개발용 (나중에 배포할 때는 production으로)
  target: 'web',       // 웹 브라우저용 번들
  entry: './src/webview/index.tsx', // 우리가 만든 React 코드 진입점
  output: {
    filename: 'webview.js',                  // 결과물 파일 이름
    path: path.resolve(__dirname, 'media'),   // 결과물 저장 폴더 (media/)
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // ts, tsx, js 파일 인식
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,             // .ts, .tsx 파일은
        use: 'ts-loader',            // ts-loader로 처리
        exclude: /node_modules/,     // node_modules 제외
      },
    ],
  },
};
