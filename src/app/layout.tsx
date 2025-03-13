import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "RST Task",
  description: "RST Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer
          position="bottom-center"
          pauseOnHover={true}
          style={{ zIndex: 100 }}
        />
      </body>
    </html>
  );
}
