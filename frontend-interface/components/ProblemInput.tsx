import React from "react";
import { Textarea } from "@/components/ui/textarea";

const ProblemInput = ({ question, setQuestion }: { question: string, setQuestion: React.Dispatch<React.SetStateAction<string>> }) => {
  const formatQuestion = (input: string): string => {
    return input
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim()
      .replace(/\s*([.,?!])\s*/g, "$1 ")
      .replace(/\s+([.,?!])/g, "$1")
      .replace(/\s+/g, " ");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Describe Your Problem
      </h2>
      <Textarea
        className="min-h-32 p-4 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 ease-in-out"
        placeholder="Describe your DSA problem here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onBlur={(e) => {
          const formattedQuestion = formatQuestion(e.target.value);
          setQuestion(formattedQuestion);
        }}
      />
    </div>
  );
};

export default ProblemInput;

