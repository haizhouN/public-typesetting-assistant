import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "公众排版助手 - Markdown 转公众号排版工具",
  description: "一款免费的 Markdown 转公众号排版工具，支持多种文艺主题、AI 智能排版、一键复制、导出高清长图。让每一篇文章都值得被看见。",
  keywords: "公众号排版,markdown转公众号,公众号编辑器,微信排版,AI排版,Markdown编辑器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="h-full">{children}</body>
    </html>
  );
}
