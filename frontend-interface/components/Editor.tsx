"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Settings, Play, Loader2 } from "lucide-react";
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  language?: string;
  theme?: string;
  onClose: () => void;
  onChange?: (value: string | undefined) => void;
}

interface ExecutionResult {
  output: string;
  error?: string;
  language: string;
  version: string;
}

const LANGUAGE_TO_PISTON = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python3",
  java: "java",
  cpp: "c++",
  csharp: "c#",
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language: initialLanguage = "javascript",
  theme: initialTheme = "vs-dark",
  onClose,
  onChange
}) => {
  const [language, setLanguage] = useState(initialLanguage);
  const [theme, setTheme] = useState(initialTheme);
  const [showSettings, setShowSettings] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("editor");

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
  ];

  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "hc-black", label: "High Contrast Dark" },
    { value: "hc-light", label: "High Contrast Light" },
  ];

  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setActiveTab("output");
    
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: LANGUAGE_TO_PISTON[language as keyof typeof LANGUAGE_TO_PISTON],
          version: '*',
          files: [
            {
              content: code
            }
          ]
        })
      });

      const data = await response.json();
      
      setExecutionResult({
        output: data.run.output || 'No output',
        error: data.run.stderr,
        language: data.language,
        version: data.version
      });
    } catch (error) {
      setExecutionResult({
        output: '',
        error: 'Execution failed: ' + (error as Error).message,
        language,
        version: 'unknown'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">Code Editor</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={executeCode}
            disabled={isExecuting}
            className="h-8"
            size="sm"
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run Code
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {showSettings && (
        <div className="px-6 pb-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <Select
                value={theme}
                onValueChange={(value) => setTheme(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((themeOption) => (
                    <SelectItem key={themeOption.value} value={themeOption.value}>
                      {themeOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <CardContent className="flex-1 p-0 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="flex-1 m-0">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme={theme}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                wrappingIndent: "indent",
                automaticLayout: true,
                lineNumbers: "on",
                glyphMargin: true,
                folding: true,
                matchBrackets: "always",
              }}
            />
          </TabsContent>
          
          <TabsContent value="output" className="m-0 p-4 bg-black text-white font-mono text-sm overflow-auto flex-1">
            {executionResult && (
              <div>
                <div className="text-gray-400 mb-2">
                  Executed using {executionResult.language} v{executionResult.version}
                </div>
                {executionResult.error ? (
                  <pre className="text-red-400 whitespace-pre-wrap">{executionResult.error}</pre>
                ) : (
                  <pre className="whitespace-pre-wrap">{executionResult.output}</pre>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;