from base import BaseTool
from typing import Dict, List
from langchain_core.messages import AIMessage, HumanMessage

class CodeGenerator(BaseTool):
    def generate_code(self, question: str) -> Dict: # type: ignore
        prompt = f"""Given the coding problem below, provide a detailed solution with explanation.
        Problem: {question}
        
        Return the response in the following format:
        Solution: [detailed code implementation]
        Explanation: [step-by-step explanation of the approach]
        """
        
        response = self.model.invoke([HumanMessage(content=prompt)]) # type: ignore
        return self.output_parser.invoke(response.content)
