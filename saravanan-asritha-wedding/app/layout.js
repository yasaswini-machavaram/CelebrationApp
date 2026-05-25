import './globals.css';

export const metadata = {
  title: 'SaravananKumar & Asritha — Wedding Invitation',
  description:
    'You are cordially invited to celebrate the wedding of SaravananKumar and Asritha on June 18, 2026. Join us for the reception, ceremony, and feast.',
  openGraph: {
    title: 'SaravananKumar & Asritha — Wedding Invitation',
    description:
      'Join us as we celebrate the union of SaravananKumar and Asritha. Reception, Wedding Ceremony & Post Marriage Feast.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
