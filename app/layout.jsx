import "./globals.css";
import Providers from "./reduxProvider";
import Navbar from "@/app/components/Navbar"
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="max-w-4xl mx-auto p-10">
        <Providers>
        <Navbar/>
        {children}</Providers>
      </body>
    </html>
  );
}
