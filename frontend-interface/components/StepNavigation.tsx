import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, PlayCircle, Lightbulb } from 'lucide-react';

const steps = [
  { title: "Problem", icon: Brain },
  { title: "Test Cases", icon: PlayCircle },
  { title: "Expected Complexity", icon: Lightbulb },
];

interface StepNavigationProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const StepNavigation = ({ activeStep, setActiveStep }: StepNavigationProps) => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
      {steps.map((step, index) => (
        <Button
          key={index}
          variant={activeStep === index ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveStep(index)}
          className={`flex items-center gap-2 flex-1 ${
            activeStep === index
              ? "bg-blue-500 text-white"
              : "text-gray-600 dark:text-gray-300"
          } transition-all duration-300 ease-in-out transform hover:scale-105`}
        >
          <step.icon className="h-4 w-4" />
          {step.title}
        </Button>
      ))}
    </div>
  );
};

export default StepNavigation;

