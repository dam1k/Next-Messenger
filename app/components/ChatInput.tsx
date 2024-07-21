'use client'

import {useState} from 'react'
import Button from './ui/Button'
import axios from 'axios'

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

const ChatInput = ({chatId, chatPartner}:ChatInputProps) => {
  const [input, setInput] = useState("");

  async function handleClick() {
    try { 
      await axios.post("/api/message/send", {
        text: input,
        chatId
      })
    } catch(err) {
      console.log(err);
    } finally {
      setInput("");
    }
  }
  
  return (
    <div className="flex gap-[10px]">
      <input onChange={(e) => setInput(e.target.value)} value={input} type="text"/>
      <Button onClick={handleClick}>Send</Button>
    </div>
  )
}

export default ChatInput