import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata = {
  title: 'CelebrationApp – Beautiful Wedding Invitations',
  description: 'Create stunning, animated wedding invitation websites in minutes. Choose from beautiful templates, customize with your details, and share a unique link with your guests.',
  keywords: 'wedding invitation, digital invitation, wedding website, celebration, marriage invitation',
  openGraph: {
    title: 'CelebrationApp – Beautiful Wedding Invitations',
    description: 'Create stunning, animated wedding invitation websites in minutes.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
