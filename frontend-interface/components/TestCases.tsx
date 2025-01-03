import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';

interface TestCase {
  input: string;
  output: string;
}

interface TestCasesProps {
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
}

const TestCases = ({ testCases, setTestCases }: TestCasesProps) => {
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Test Cases
      </h2>
      {testCases.map((testCase, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="flex-1">
            <Input
              placeholder="Input"
              value={testCase.input}
              onChange={(e) => updateTestCase(index, "input", e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 ease-in-out"
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Expected Output"
              value={testCase.output}
              onChange={(e) => updateTestCase(index, "output", e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 ease-in-out"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveTestCase(index)}
            disabled={testCases.length === 1}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={handleAddTestCase}
        className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Test Case
      </Button>
    </div>
  );
};

export default TestCases;

