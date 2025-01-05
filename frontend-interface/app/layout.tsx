import "./globals.css";
import { Comfortaa } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Learn Coding with CopilotKit",
  description:
    "Solve Data Structures and Algorithms questions with AI assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={comfortaa.className}>
        <CopilotKit runtimeUrl="/api/copilotkit" agent="dsa_agent">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
