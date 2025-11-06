import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your plant care AI assistant 🌱 How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "I'd be happy to help you with plant care advice! (AI integration will be added soon)",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">AI Plant Assistant</h1>
          </div>
          <p className="text-muted-foreground">Get expert advice on plant care and maintenance</p>
        </div>

        <Card className="p-6 shadow-card">
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 animate-fade-in ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-secondary text-foreground"
                      : "bg-gradient-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about plant care..."
              className="resize-none"
              rows={2}
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="h-auto w-12 bg-gradient-primary"
              disabled={!input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "How often should I water my plants?",
              "Best plants for low light",
              "Common plant diseases",
            ].map((suggestion, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setInput(suggestion)}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Assistant;
