"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Loader2, ExternalLink, Cpu, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import ChatInterface from "@/components/ChatInterface";
import StepNavigation from "@/components/StepNavigation";
import ProblemInput from "@/components/ProblemInput";
import TestCases from "@/components/TestCases";
import ComplexityInput from "@/components/ComplexityInput";
import SolutionDisplay from "@/components/SolutionDisplay";
import { useCoAgent, useCopilotChat } from "@copilotkit/react-core";


interface AgentState {
  question: string;
  testCases: { input: string; output: string }[];
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  explanation: string;
  visualization?: string;
}



interface Solution {
  code: string;
  explanation: string;
  visualization?: string;
}
  const CodeEditor = dynamic(() => import("../components/Editor"), {
    ssr: false,
  });

const DSASolutionInterface = () => {

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [showChat, setShowChat] = useState(false);
  // const [messages, setMessages] = useState<TextMessage[]>([]);

  const handleOpenEditor = () => {
    if (solution?.code) {
      setEditorCode(solution.code);
    }
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {

      const response = await fetch("https://novel-tasia-arya007-ab53373f.koyeb.app/copilotkit", {
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

      try {

        const response = await fetch("https://learn-coding-with-copilotkit.onrender.com/copilotkit", {
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
      }
      catch (error) {
        console.error(error);
      }

    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setShowChat(true);
        const initialMessage = `I need an alternative solution for the following problem:

    Problem: ${question}

    Test Cases: ${testCases.map(tc => `Input: ${tc.input}, Output: ${tc.output}`).join('\n')}

    Expected Time Complexity: ${timeComplexity}
    Expected Space Complexity: ${spaceComplexity}

    Previous Solution:
    ${solution?.code}

    Please provide a different approach or optimization.`;

    run(() => new TextMessage({ role: Role.System, content: initialMessage }));
    

  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, setState, run } = useCoAgent<AgentState>({
    name: "dsa_agent",
    initialState: {
      question: "",
      testCases: [],
      timeComplexity: "",
      spaceComplexity: "",
      code: "",
      explanation: "",
      visualization: "",
    }
  })
  
  const { isLoading, appendMessage, visibleMessages } = useCopilotChat()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className={`flex-1 p-8 ${showEditor || showChat ? "w-1/2" : "w-full"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            Learn Coding with CopilotKit
          </h1>

          <StepNavigation activeStep={activeStep} setActiveStep={setActiveStep} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              {activeStep === 0 && (
                <ProblemInput question={question} setQuestion={setQuestion} />
              )}
              {activeStep === 1 && (
                <TestCases testCases={testCases} setTestCases={setTestCases} />
              )}
              {activeStep === 2 && (
                <ComplexityInput
                  timeComplexity={timeComplexity}
                  setTimeComplexity={setTimeComplexity}
                  spaceComplexity={spaceComplexity}
                  setSpaceComplexity={setSpaceComplexity}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Problem...
              </>
            ) : (
              "Generate Solution"
            )}
          </Button>

          {solution && (
            <>
              <div className="flex justify-between">
                <Button
                  onClick={handleRetry}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                  Retry with Chat
                </Button>
                <Button
                  onClick={handleOpenEditor}
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Editor
                </Button>
              </div>

              <SolutionDisplay
                solution={solution}
                timeComplexity={timeComplexity}
                spaceComplexity={spaceComplexity}
              />
            </>
          )}

          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <Cpu className="h-6 w-6 mr-2" />
            Powered by CopilotKit CoAgents and Langgraphs
          </Button>
        </motion.div>
      </div>

       <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "50%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen sticky top-0 right-0 bg-gray-100 dark:bg-gray-900 shadow-2xl"
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-semibold">Chat with AI</h2>
                <Button onClick={() => setShowChat(false)} variant="ghost">Close</Button>
              </div>
              <div className="flex-grow overflow-hidden">
                    <ChatInterface
              isLoading={isLoading}
              appendMessage={appendMessage}
              visibleMessages={visibleMessages as TextMessage[]}
            />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "50%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen sticky top-0 right-0 bg-gray-100 dark:bg-gray-900 shadow-2xl"
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

