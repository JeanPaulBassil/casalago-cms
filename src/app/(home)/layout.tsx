import type { Metadata } from 'next'
import AppLayout from '../_components/AppLayout';


export const metadata: Metadata = {
  title: 'Products List',
  description: 'List of products',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}
