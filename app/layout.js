import './global.css';
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  weight: '600',
  subsets: [ 'latin' ]
})

export const metadata = {
  title: 'RocketBlock'
}
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body className={openSans.className}>{children}</body>
    </html>
  )
}
