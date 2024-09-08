import type { Metadata } from 'next'
import AppLayout from '../_components/AppLayout'

export const metadata: Metadata = {
  title: 'Casalago',
  description: 'Discover the finest quality wood products in Lebanon',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppLayout>{children}</AppLayout>
}
