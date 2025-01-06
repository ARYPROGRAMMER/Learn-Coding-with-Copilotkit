// "use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Role, TextMessage } from "@copilotkit/runtime-client-gql"
import { Loader2, Send } from 'lucide-react'
import { useEffect, useRef, useState } from "react"

export default function ChatInterface({
  isLoading,
  appendMessage,
  visibleMessages,

}: {
  isLoading: boolean
  appendMessage: (message: TextMessage) => void
  visibleMessages: TextMessage[]

}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [visibleMessages])

  useEffect(() => {
    // Parse messages for solution content
    const lastMessage = visibleMessages[visibleMessages.length - 1];
    if (lastMessage?.role === Role.Assistant) {
      try {
        const content = lastMessage.content;
        if (typeof content === 'string' && content.includes('```python')) {
            
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const solution = {
            code: content.match(/```python\n([\s\S]*?)```/)?.[1] || '',
            explanation: content.split('```')[0].trim(),
            timeComplexity: content.match(/Time Complexity: (O\([^)]+\))/)?.[1] || '',
            spaceComplexity: content.match(/Space Complexity: (O\([^)]+\))/)?.[1] || ''
          };
       }
      } catch (error) {
        console.error('Error parsing solution:', error);
      }
    }
  }, [visibleMessages]);

  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const message = new TextMessage({
        content: inputValue,
        role: Role.User,
        id: Date.now().toString()
      });
      appendMessage(message)
      setInputValue("")
    }
  }

  return (
    <Card className="w-full h-full bg-white dark:bg-gray-800 flex flex-col">
      <CardContent 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {visibleMessages.map((message, index) => (
          <div
            key={message.id || index}
            className={cn("flex items-start gap-2 group", {
              "justify-end": message.role === Role.User,
            })}
          >
            {message.role === Role.Assistant && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://robohash.org/coagents-rag" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn("rounded-lg px-4 py-2 max-w-[80%] text-sm whitespace-pre-wrap", {
                "bg-gray-100 dark:bg-gray-700": message.role === Role.Assistant,
                "bg-blue-500 text-white": message.role === Role.User,
              })}
            >
              {typeof message.content === 'string' ? message.content : ''}
            </div>
            {message.role === Role.User && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://avatar.iran.liara.run/public/41" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://robohash.org/coagents-rag" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-md text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}