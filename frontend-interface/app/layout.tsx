import './globals.css'
import { Comfortaa } from 'next/font/google'
import { CopilotKit } from '@copilotkit/react-core'
import { CopilotSidebar } from '@copilotkit/react-ui'

const comfortaa = Comfortaa({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'DSA Question Solver',
  description: 'Solve Data Structures and Algorithms questions with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <CopilotKit runtimeUrl="/api/copilot"> */}
        <body className={comfortaa.className}>
          {/* <CopilotSidebar /> */}
          {children}
        </body>
      {/* </CopilotKit> */}
    </html>
  )
}

