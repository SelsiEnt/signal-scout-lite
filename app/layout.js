import './globals.css'

export const metadata = {
  title: 'Signal Scout Lite',
  description: 'Find Niche Voices. Connect Where It Matters.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

