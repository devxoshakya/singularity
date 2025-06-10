import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Singularity - AKTU Result Analysis Tool',
  description: 'A streamlined result extraction and analysis tool for AKTU-affiliated institutes. Automate your result processing with unparalleled speed and accuracy.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={twMerge(inter.className, 'bg-black text-white antialiased')}>{children}</body>
    </html>
  )
}
