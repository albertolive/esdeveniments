import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {(process.env.NODE_ENV === "development" ||
            process.env.VERCEL_ENV === "preview") && (
            // eslint-disable-next-line @next/next/no-sync-scripts
            <script
              data-project-id={process.env.NEXT_PUBLIC_METICULOUS_PROJECT_ID}
              data-is-production-environment="false"
              src="https://snippet.meticulous.ai/v1/meticulous.js"
            />
          )}
          <link
            rel="preload"
            href="/static/fonts/BarlowCondensed-Italic.ttf"
            as="font"
            type="font/ttf"
            crossorigin="anonymous"
          />
          <link
            rel="preload"
            href="/static/fonts/RobotoFlex-Regular.ttf"
            as="font"
            type="font/ttf"
            crossorigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
