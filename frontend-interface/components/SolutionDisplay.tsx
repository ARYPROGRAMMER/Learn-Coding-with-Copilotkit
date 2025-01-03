import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code2, Clock, Box, PlayCircle } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import VisualizationTab from "@/components/MermaidRenderer";

interface Solution {
  code: string;
  explanation: string;
  visualization?: string;
}

interface SolutionDisplayProps {
  solution: Solution;
  timeComplexity?: string;
  spaceComplexity?: string;
}

const SolutionDisplay = ({ solution, timeComplexity, spaceComplexity }: SolutionDisplayProps) => {
  return (
    <Tabs defaultValue="code" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <TabsTrigger
          value="code"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition duration-300 ease-in-out"
        >
          <Code2 className="h-4 w-4 mr-2" /> Code
        </TabsTrigger>
        <TabsTrigger
          value="explanation"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition duration-300 ease-in-out"
        >
          <Clock className="h-4 w-4 mr-2" /> Explanation
        </TabsTrigger>
        <TabsTrigger
          value="complexity"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition duration-300 ease-in-out"
        >
          <Box className="h-4 w-4 mr-2" /> Complexity
        </TabsTrigger>
        <TabsTrigger
          value="visualization"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition duration-300 ease-in-out"
        >
          <PlayCircle className="h-4 w-4 mr-2" /> Visualization
        </TabsTrigger>
      </TabsList>

      <TabsContent value="code">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">Python Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <ReactMarkdown>{solution.code}</ReactMarkdown>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="explanation">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">Approach Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <ReactMarkdown>{solution.explanation}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="complexity">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">Complexity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Alert className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
                <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <AlertDescription className="text-blue-700 dark:text-blue-300 mt-2">
                  Time Complexity: {timeComplexity || "Not specified"}
                </AlertDescription>
              </Alert>
              <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
                <Box className="h-4 w-4 text-green-500 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300 mt-2">
                  Space Complexity: {spaceComplexity || "Not specified"}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="visualization">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">Visual Representation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              {solution.visualization && (
                <VisualizationTab visualization={solution.visualization} />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SolutionDisplay;

