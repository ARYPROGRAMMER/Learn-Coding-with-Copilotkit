"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Plus,
  Trash2,
  Code2,
  Clock,
  Box,
  PlayCircle,
  Brain,
  Lightbulb,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import VisualizationTab from "@/components/MermaidRenderer";
import ReactMarkdown from "react-markdown";

const CodeEditor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

const formatQuestion = (input: string): string => {
  return input
    .replace(/\s+/g, " ")
    .replace(/\n+/g, " ")
    .trim()
    .replace(/\s*([.,?!])\s*/g, "$1 ")
    .replace(/\s+([.,?!])/g, "$1")
    .replace(/\s+/g, " ");
};

const DSASolutionInterface = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  interface Solution {
    code: string;
    explanation: string;
    visualization?: string;
  }
  const [showEditor, setShowEditor] = useState(false);
  const [editorCode, setEditorCode] = useState("");

  const handleOpenEditor = () => {
    if (solution?.code) {
      setEditorCode(solution.code);
    }
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  const [solution, setSolution] = useState<Solution | null>(null);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [insights, setInsights] = useState("");

  const steps = [
    { title: "Problem", icon: Brain },
    { title: "Test Cases", icon: PlayCircle },
    { title: "Expected Complexity", icon: Lightbulb },
  ];

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (
    index: number,
    field: "input" | "output",
    value: string
  ) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/copilotkit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question,
          testCases: testCases.map((tc) => tc.input),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const cleanCode = (data.code || "").replace(/```python\n?|\n?```/g, "");
      const cleanVisualization = (data.visualization || "").replace(
        /```mermaid\n?|\n?```/g,
        ""
      );

      setSolution({
        code: cleanCode,
        explanation: data.explanation || "",
        visualization: cleanVisualization,
      });

      setTimeComplexity(data.time_complexity || "O(1)");
      setSpaceComplexity(data.space_complexity || "O(1)");
      setEditorCode(cleanCode);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex transition-all duration-300">
      <div
        className={`transition-all duration-300 ${
          showEditor ? "w-1/2" : "w-full"
        }`}
      >
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mt-5">
                Learn Coding with Copilotkit
              </h1>

              <div className="flex gap-2">
                {steps.map((step, index) => (
                  <Button
                    key={index}
                    variant={activeStep === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveStep(index)}
                    className="flex items-center gap-2"
                  >
                    <step.icon className="h-4 w-4" />
                    {step.title}
                  </Button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mb-6"
              >
                {activeStep === 0 && (
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <Textarea
                        className="min-h-32 p-4 w-full"
                        placeholder="Describe your DSA problem here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onBlur={(e) => {
                          const formattedQuestion = formatQuestion(
                            e.target.value
                          );
                          setQuestion(formattedQuestion);
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

                {activeStep === 1 && (
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {testCases.map((testCase, index) => (
                          <div key={index} className="flex gap-4 items-start">
                            <div className="flex-1">
                              <Input
                                placeholder="Input"
                                value={testCase.input}
                                onChange={(e) =>
                                  updateTestCase(index, "input", e.target.value)
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                placeholder="Expected Output"
                                value={testCase.output}
                                onChange={(e) =>
                                  updateTestCase(
                                    index,
                                    "output",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveTestCase(index)}
                              disabled={testCases.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={handleAddTestCase}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Test Case
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeStep === 2 && (
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Time Complexity
                          </label>
                          <Input
                            placeholder="e.g., O(n)"
                            value={timeComplexity}
                            onChange={(e) => setTimeComplexity(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Space Complexity
                          </label>
                          <Input
                            placeholder="e.g., O(1)"
                            value={spaceComplexity}
                            onChange={(e) => setSpaceComplexity(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Problem...
                </>
              ) : (
                "Generate Solution"
              )}
            </Button>
          </motion.div>

          {solution && (
            <>
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={handleOpenEditor}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Editor
                </Button>
              </div>

              <Tabs defaultValue="code" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="code">
                    <Code2 className="h-4 w-4 mr-2" /> Code
                  </TabsTrigger>
                  <TabsTrigger value="explanation">
                    <Clock className="h-4 w-4 mr-2" /> Explanation
                  </TabsTrigger>
                  <TabsTrigger value="complexity">
                    <Box className="h-4 w-4 mr-2" /> Obtained Complexity
                  </TabsTrigger>
                  <TabsTrigger value="visualization">
                    <PlayCircle className="h-4 w-4 mr-2" /> Visualization
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="code">
                  <Card>
                    <CardHeader>
                      <CardTitle>Python Code </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                          <ReactMarkdown>{solution.code}</ReactMarkdown>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="complexity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Complexity Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Alert>
                          <Clock className="h-4" />
                          <AlertDescription className="h-4 mt-[5px]">
                            Time Complexity: {timeComplexity || "Not specified"}
                          </AlertDescription>
                        </Alert>
                        <Alert>
                          <Box className="h-4" />
                          <AlertDescription className="h-4 mt-[5px]">
                            Space Complexity:{" "}
                            {spaceComplexity || "Not specified"}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="visualization">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visual Representation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border p-4 rounded-lg bg-gray-50">
                        {solution.visualization && (
                          <VisualizationTab
                            visualization={solution.visualization}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="explanation">
                  <Card>
                    <CardHeader>
                      <CardTitle>Approach Explanation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg overflow-x-auto">
                          <ReactMarkdown>{solution.explanation}</ReactMarkdown>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
          <Button className="w-full bg-gradient-to-r from-purple-600 p-5 text-[17px] to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
            <Cpu className="h-5 w-5" />
            Powered by CopilotKit CoAgents and Langgraphs
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "50%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen sticky top-0 right-0"
          >
            <CodeEditor
              code={editorCode}
              onClose={handleCloseEditor}
              onChange={(value) => value !== undefined && setEditorCode(value)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DSASolutionInterface;
