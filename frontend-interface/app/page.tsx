"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Loader2, ExternalLink, Cpu, MessageSquare, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import ChatInterface from "@/components/ChatInterface";
import StepNavigation from "@/components/StepNavigation";
import ProblemInput from "@/components/ProblemInput";
import TestCases from "@/components/TestCases";
import ComplexityInput from "@/components/ComplexityInput";
import SolutionDisplay from "@/components/SolutionDisplay";
import { CopilotKit, useCoAgent, useCopilotChat } from "@copilotkit/react-core";
import GitHubStarButtons from "@/components/StarComponent";
import Image from "next/image";
import { CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

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
  const [showChat, setShowChat] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [activeStep, setActiveStep] = useState(0);

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
      const response = await fetch(
        "https://novel-tasia-arya007-ab53373f.koyeb.app/copilotkit",
        {
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
        }
      );

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
      console.error(error);
      try {
        const response = await fetch(
          "https://learn-coding-with-copilotkit.onrender.com/copilotkit",
          {
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
          }
        );

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
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, setState } = useCoAgent<AgentState>({
    name: "dsa_agent",
    initialState: {
      question: "",
      timeComplexity: "",
      spaceComplexity: "",
      code: "",
      explanation: "",
      visualization: "",
    },
  });

  const { isLoading, appendMessage, visibleMessages } = useCopilotChat();



  const isStateEqual = (prevState: AgentState, newState: Partial<AgentState>) => {
    return (
      prevState.question === newState.question &&
      JSON.stringify(prevState.testCases) === JSON.stringify(newState.testCases) &&
      prevState.timeComplexity === newState.timeComplexity &&
      prevState.spaceComplexity === newState.spaceComplexity
    );
  };
  
  // Modified useEffect
  useEffect(() => {
    const newState = {
      question,
      testCases,
      timeComplexity,
      spaceComplexity,
    };
  
    // Only update if the state has actually changed
    if (!isStateEqual(state, newState)) {
      setState((prevState = state) => ({
        ...prevState,
        ...newState,
        // Preserve other fields that aren't being updated
        code: prevState.code,
        explanation: prevState.explanation,
        visualization: prevState.visualization,
      }));
    }
  }, [question, testCases, timeComplexity, spaceComplexity]);









  // useEffect(() => {
  //   setState({
  //     ...state,
  //     question: question,
  //     testCases: testCases,
  //     timeComplexity: timeComplexity,
  //     spaceComplexity: spaceComplexity,
  //   });
  // }, [question, testCases, timeComplexity, spaceComplexity]);

  const handleRetry = () => {
    if (!question.trim()) {
      console.error("Question is empty");
      return;
    }

    setShowChat(true);

    // First, send the problem context
    const contextMessage = new TextMessage({
      id: "context-" + Date.now().toString(),
      role: Role.System,
      content: `
      Language: Python
      Status: New Problem

      Question:
      ${question}
      `,
    });

    // Then send the user's question
    const userMessage = new TextMessage({
      id: "user-" + Date.now().toString(),
      role: Role.User,
      content: question,
    });

    // Send messages with a slight delay
    setTimeout(() => {
      appendMessage(contextMessage);
      setTimeout(() => {
        appendMessage(userMessage);
      }, 100);
    }, 100);
  };

  // Add this function to handle solution updates from chat
  const handleSolutionUpdate = (content: string) => {
    try {
      // Extract code block
      const codeMatch = content.match(/```python\n([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1].trim() : "";

      // Extract explanation (text before code block)
      const explanation = content.split("```")[0].trim();

      // Extract complexities
      const timeMatch = content.match(/[Tt]ime [Cc]omplexity:?\s*(O\([^)]+\))/);
      const spaceMatch = content.match(
        /[Ss]pace [Cc]omplexity:?\s*(O\([^)]+\))/
      );

      // // Extract visualization if present
      // const visualMatch = content.match(/```mermaid\n([\s\S]*?)```/);

      // Update all states
      setSolution(prevSolution => ({
        code: code,
        explanation: explanation,
        visualization: prevSolution?.visualization // Preserve existing visualization
      }));

      if (timeMatch) setTimeComplexity(timeMatch[1]);
      if (spaceMatch) setSpaceComplexity(spaceMatch[1]);
      if (code) setEditorCode(code);

      setState({
        ...state,
        code: code,
        explanation: explanation,
        visualization: state.visualization, // Preserve existing visualization
        timeComplexity: timeMatch ? timeMatch[1] : state.timeComplexity,
        spaceComplexity: spaceMatch ? spaceMatch[1] : state.spaceComplexity,
      });
    } catch (error) {
      console.error("Error parsing solution:", error);
    }
  };

  useEffect(() => {
    const lastMessage = visibleMessages[visibleMessages.length - 1];
    const textMessage = lastMessage as TextMessage;
    if (
      textMessage?.role === Role.Assistant &&
      typeof textMessage.content === "string"
    ) {
      handleSolutionUpdate((lastMessage as TextMessage).content);
    }
  }, [visibleMessages]);


  const [isPlaying, setIsPlaying] = useState(false);
  const videoUrl = "https://vimeo.com/1044157863";

  // Extract Vimeo video ID from the URL and generate embeddable URL
  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  };

  const embedUrl = getVimeoEmbedUrl(videoUrl);
  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="flex min-h-screen dark:from-gray-900 dark:to-gray-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent">
    
      
      <div
        className={`flex-1 p-8 ${showEditor || showChat ? "w-1/2" : "w-full"}`}
      >
        
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
                <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-morphism rounded-2xl p-8 cyberpunk-glow"
          >
            <h1 className="text-5xl font-extrabold text-center cyberpunk-text bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
              Learn Coding with
            </h1>
            <div className="mt-4 flex justify-center">
              <Image
                className="mx-auto brightness-125"
                src="https://cdn.prod.website-files.com/6683cee6abdeb8fa5407debb/67373afa2c195c30736f39bf_Type%3DDark.svg"
                width={300}
                height={100}
                alt="CopilotKit Logo"
              />
            </div>
          </motion.div>

          <StepNavigation
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />

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
        <GitHubStarButtons />
              {/* Video Section */}
              <motion.div
              className="relative max-w-4xl  flex-col mx-auto mb-32 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden relative">
                {isPlaying ? (
                  <iframe
                    className="w-full h-full"
                    src={embedUrl}
                    title="Vimeo video player"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <Image src="/thumbnail.png" width={1800} height={1800} alt="CoAgents and Langgraph" className="object-cover h-full w-full" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors"
                            onClick={handlePlayClick}
                          >
                            <Play className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-lg text-white font-semibold">See A Full Fledged Demo</p>
                            <p className="text-purple-200">Watch the demo insight during development</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="text-black border-white/20 hover:bg-white/10 transition-colors"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
      </div>

      {!showChat && (
        <CopilotKit runtimeUrl="/api/copilotkit">
          <CopilotSidebar
            instructions="You are a 4000 rated Competitive Programmer. Provide Code snippets in python and explanations for the problems user is asking."
            labels={{
              title: "Learn Coding with CopilotKit",
              initial:
                "Welcome to Learn-Code-with-Copilotkit Quick Helper. I am here to help you with your coding problems. Please provide me with the problem statement to discuss further.",
            }}
          />
        </CopilotKit>


      )}

   

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "50%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen sticky top-0 right-0 bg-white dark:bg-gray-800 shadow-2xl"
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Chat with AI</h2>
                <Button onClick={() => setShowChat(false)} variant="ghost">
                  Close
                </Button>
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
