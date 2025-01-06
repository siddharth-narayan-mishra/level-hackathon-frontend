import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { ThemeProvider } from "./components/theme-provider";
import { Separator } from "./components/ui/separator";

const App: React.FC = () => {
  const [query, setQuery] = useState<string>(""); // User's input
  const [response, setResponse] = useState<string | null>(null); // API response
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError("Please enter a valid query.");
      return;
    }

    setError(null);
    setLoading(true);
    setResponse(null);

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
      setResponse(data.message);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">
              AI SaaS Assistant
            </h1>
            <p className="text-gray-500 text-center mt-2">
              Ask anything, and get a tailored response.
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type your query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full mt-4"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
          </CardContent>
        </Card>

        {response && (
          <Card className="w-full max-w-3xl mt-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Response</h2>
            </CardHeader>
            <Separator/>
            <CardContent>
              <div className="prose max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;