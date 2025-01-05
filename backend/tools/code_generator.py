from base import BaseTool
from typing import Dict, List
from langchain_core.messages import AIMessage, HumanMessage

class CodeGenerator(BaseTool):
    def generate_code(self, question: str,testCases: str) -> Dict: # type: ignore
        prompt = f"""Given the coding problem below, provide only a well structured and full working code in python.
        Problem: {question}
        Test Cases: {testCases}
        
        Return only the structured and full working code as the response and nothing else no "python" keyword or any other thing:


            def function_name(): .....    pass
        

        """
        
        response = self.model.invoke([HumanMessage(content=prompt)]) # type: ignore
        return self.output_parser.invoke(response.content)
