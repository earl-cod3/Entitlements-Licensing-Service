// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />

          {/* ✅ icons served from /public */}
          <link rel="icon" href="/assets/img/brand/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/assets/img/brand/apple-icon.png"
          />

          {/* Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <div id="page-transition" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
