from base import BaseTool
from typing import Dict, List
from langchain_core.messages import AIMessage, HumanMessage

class ComplexityAnalyzer(BaseTool):
    def analyze_complexity(self, code: str) -> List: # type: ignore
        prompt = f"""Analyze the following code very very carefully and determine its time and space complexity:
        {code}
        
        Provide only the values in the format:
        
        
            ["O(n)","O(1)"]
            
        0 -> TIME COMPLEXITY
        1 -> SPACE COMPLEXITY

        """
        
        response = self.model.invoke([HumanMessage(content=prompt)]) # type: ignore
        result = self.output_parser.invoke(response.content)
        return result