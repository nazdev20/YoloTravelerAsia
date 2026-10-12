import "./globals.css";
import "../src/index.css";
import "aos/dist/aos.css";

export const metadata = {
  title: "Yolo Traveler Asia",
  description: "Explore destinations and travel packages with Yolo Traveler Asia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
