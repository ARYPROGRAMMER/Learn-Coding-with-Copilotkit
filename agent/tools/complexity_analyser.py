from base import BaseTool
from typing import Dict, List
from langchain_core.messages import AIMessage, HumanMessage

class ComplexityAnalyzer(BaseTool):
    def analyze_complexity(self, code: str) -> Dict: # type: ignore
        prompt = f"""Analyze the following code and determine its time and space complexity:
        {code}
        
        Provide a detailed explanation for both complexities.
        """
        
        response = self.model.invoke([HumanMessage(content=prompt)]) # type: ignore
        result = self.output_parser.invoke(response.content)
        
        return {
            "time_complexity": result.split("Space")[0].strip(),
            "space_complexity": "Space" + result.split("Space")[1].strip()
        }