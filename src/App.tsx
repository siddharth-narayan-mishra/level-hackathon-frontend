import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  PieChart,
  User,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [qaItems, setQAItems] = useState<
    { question: string; answer: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const qaEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    qaEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [qaItems]);

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError("Please enter a valid question.");
      return;
    }

    setError(null);
    setLoading(true);
    const newQuestion = query;
    setQuery("");

    try {
      const res = await fetch("https://level-hackathon-backend.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: newQuestion }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response. Please try again.");
      }

      const data = await res.json();
      setQAItems((prev) => [
        ...prev,
        { question: newQuestion, answer: data.message },
      ]);
      setExpandedIndex(qaItems.length);
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

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <nav className="bg-card shadow-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <PieChart className="h-8 w-8 text-accent" />
                <span className="text-2xl font-bold text-primary">
                  InsightPulse
                </span>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-card rounded-xl shadow-xl p-6 mb-8 border border-border">
            <h1 className="text-3xl font-bold text-primary mb-4">
              User Engagement Insights
            </h1>
            <p className="text-muted-foreground mb-6">
              Ask questions about your user data to gain valuable insights.
            </p>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Ask a question about your user engagement..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {qaItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-lg shadow-md overflow-hidden border border-border"
                >
                  <div
                    className="p-4 cursor-pointer flex justify-between items-center hover:bg-muted/50"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-card-foreground">
                        {item.question}
                      </h3>
                    </div>
                    {expandedIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  {expandedIndex === index && (
                    <div className="p-4 bg-muted/50 border-t border-border">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-accent mt-1" />
                        <ReactMarkdown className="prose dark:prose-invert max-w-none">
                          {item.answer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div ref={qaEndRef} />
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive text-destructive-foreground"
            >
              {error}
            </motion.div>
          )}
        </main>
      </div>
  );
};

export default App;