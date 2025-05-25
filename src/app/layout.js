import './globals.css'; 
// import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'Quiz',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
