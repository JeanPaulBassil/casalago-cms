import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextUIProvider } from '@nextui-org/system'
import ReactQueryClientProvider from '@/providers/ReactQueryProvider'
import LayoutWrapper from './_components/Notifications'
import { ToastProvider } from '@/providers/ToastProvider'
import AppLayout from './_components/AppLayout'
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
            <LayoutWrapper>
              <ToastProvider>{children}</ToastProvider>
            </LayoutWrapper>
          </NextUIProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
