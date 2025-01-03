import React from 'react';
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const GitHubStarButtons = () => {
  return (
    <div className="flex gap-4 justify-center mt-8 mb-4">
      <Button
        className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2"
        onClick={() => window.open('https://github.com/CopilotKit/CopilotKit', '_blank')}
      >
        <Github className="h-4 w-4" />
        Star CopilotKit
      </Button>
      <Button
        className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2"
        onClick={() => window.open('https://github.com/ARYPROGRAMMER/Learn-Coding-with-Copilotkit', '_blank')}
      >
        <Github className="h-4 w-4" />
        Star Us
      </Button>
    </div>
  );
};

export default GitHubStarButtons;