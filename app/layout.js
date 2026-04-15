import './globals.css';

export const metadata = {
  title: 'UTM Tracker Pro',
  description: 'Professional UTM link builder & click analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
