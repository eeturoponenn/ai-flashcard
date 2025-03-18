import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "./components/navigation"
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: "aimuistikortit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className="100vh flex flex-col">
        <Providers>
          <header className="bg-slate-900 text-white p-4 text-center">
            <Navigation />
          </header>

          <main className="flex flex-col items-center justify-center min-h-screen">
            {children}
          </main>

          <footer className="text-center text-sm text-white py-6 bg-slate-900">
            © {new Date().getFullYear()} AI Muistikortit.
          </footer>
        </Providers>
      </body>
    </html>
  );
}

