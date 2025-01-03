import React from "react";
import { Input } from "@/components/ui/input";

const ComplexityInput = ({
  timeComplexity,
  setTimeComplexity,
  spaceComplexity,
  setSpaceComplexity,
}: {
  timeComplexity: string;
  setTimeComplexity: (value: string) => void;
  spaceComplexity: string;
  setSpaceComplexity: (value: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Expected Complexity
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Time Complexity
          </label>
          <Input
            placeholder="e.g., O(n)"
            value={timeComplexity}
            onChange={(e) => setTimeComplexity(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 ease-in-out"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Space Complexity
          </label>
          <Input
            placeholder="e.g., O(1)"
            value={spaceComplexity}
            onChange={(e) => setSpaceComplexity(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
};

export default ComplexityInput;

