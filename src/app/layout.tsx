import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextUIProvider } from '@nextui-org/system'
import { Toaster } from 'react-hot-toast'
import ReactQueryClientProvider from '@/providers/ReactQueryProvider'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Al-Mouhawess Woods',
  description: 'Discover the finest quality wood products in Lebanon',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryClientProvider>
          <NextUIProvider>
            <div className="h-screen w-full ">
              {children}
            </div>
            <Toaster position="top-right" />
          </NextUIProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
