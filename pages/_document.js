import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const title = "请销假登记系统";
  const description = "请销假登记系统是一个由RustyPiano开发的用于登记学员请假和销假信息的应用程序。";
  return (
    <Html lang="zh-CN">
      <Head>
      <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
