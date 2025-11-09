import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get me a chai!",
  description: "Get me a chai!-Fund your projects with chai",
  icons: {
    icon: "/tea.gif",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col text-white bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] md:text-2xl`}
      >
        <SessionWrapper>
          

          <Navbar />
          {/* Main content grows to push footer down */}
          <main className="grow">{children}</main>
          <Footer />
          
        </SessionWrapper>
      </body>
    </html>
  );
}
