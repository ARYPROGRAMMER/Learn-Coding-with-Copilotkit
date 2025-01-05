from base import BaseTool
from typing import Dict, List
from langchain_core.messages import AIMessage, HumanMessage

class ExplanationGenerator(BaseTool):
    def generate_explanation(self, question: str,testCases: str, code: str) -> Dict: # type: ignore
        prompt = f"""Given the coding problem below, provide a well explanation of code and approach in python with explanation.
        Problem: {question}
        Test Cases: {testCases}
        Code: {code}
    
        Return the response in the following format:
        [detailed code explanation and approach to solve the problem]
        """
        
        response = self.model.invoke([HumanMessage(content=prompt)]) # type: ignore
        return self.output_parser.invoke(response.content)
