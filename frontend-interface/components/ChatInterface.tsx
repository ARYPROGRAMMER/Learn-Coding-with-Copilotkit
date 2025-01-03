"use client"

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
  visibleMessages
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

  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      appendMessage(new TextMessage({
        content: inputValue,
        role: Role.User
      }))
      setInputValue("")
    }
  }

  return (
    <Card className="w-full h-[600px] max-h-[80vh] bg-[#F7F7F8] dark:bg-[#191A19] flex flex-col">
      <CardContent 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {(visibleMessages as TextMessage[]).map((message, index) => message.content && (
          <div
            key={message.id || index}
            className={cn("flex items-start gap-2 group", {
              "justify-end": (message.role === "user"),
            })}
          >
            {(message.role === "assistant") && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://robohash.org/coagents-rag" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn("rounded-2xl px-4 py-2 max-w-[80%] text-sm", {
                "bg-secondary text-secondary-foreground": (message.role === "assistant"),
                "bg-primary text-primary-foreground": (message.role === "user"),
              })}
            >
              {message.content}
            </div>
            {(message.role === "user") && (
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
            <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-2 max-w-md text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

