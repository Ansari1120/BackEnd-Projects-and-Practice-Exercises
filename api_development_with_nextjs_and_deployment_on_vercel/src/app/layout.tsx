import "./globals.css";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Bg from "../../public/background.jpg";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blog App Crud Apis With Next Js",
  description: "MY Blog App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="bg-scroll bg-my_bg_image bg-cover mx-auto py-5 justify-center bg-no-repeat">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
