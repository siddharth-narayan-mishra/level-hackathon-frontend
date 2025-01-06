import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { ThemeProvider } from "./components/theme-provider";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./components/mode-toggle";

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "ai" }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError("Please enter a valid query.");
      return;
    }

    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, { text: query, sender: "user" }]);

    try {
      const res = await fetch("https://level-hackathon-backend.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response. Please try again.");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.message, sender: "ai" }]);
      setQuery("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <div className="min-h-screen flex flex-col bg-background">
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">Social Media Performance Analysis</span>
              </div>
              <ModeToggle />
            </div>
          </div>
        </nav>

        <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <Card className="h-[calc(100vh-14rem)] mb-16 flex flex-col border bg-card overflow-scroll">
            <CardContent className="flex-1 flex flex-col p-4 sm:p-6">
              <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent pr-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Bot className="h-12 w-12 mb-4" />
                    <p className="text-lg">How can I assist you today?</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-3 transition-all",
                        msg.sender === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full",
                          msg.sender === "user" ? "bg-primary" : "bg-muted"
                        )}
                      >
                        {msg.sender === "user" ? (
                          <User className="w-5 h-5 text-primary-foreground" />
                        ) : (
                          <Bot className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div
                        className={cn(
                          " px-6 py-4 rounded-lg",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground text-right"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <ReactMarkdown className="prose dark:prose-invert max-w-none">
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {error && (
                <div className="mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                  {error}
                </div>
              )}

              <div className="mt-4 flex gap-2 absolute bottom-12 w-full bg-card md:w-3/5 left-1/2 -translate-x-1/2 items-center">
                <Textarea
                  placeholder="Type your message..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 resize-none"
                  rows={1}
                />
                <Button onClick={handleSubmit} disabled={loading}  className="h-full">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    </div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
