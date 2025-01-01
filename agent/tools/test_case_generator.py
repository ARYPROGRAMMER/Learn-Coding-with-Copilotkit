from base import BaseTool
from typing import Dict, List
from langchain_core.messages import AIMessage, HumanMessage

class TestCaseGenerator(BaseTool):
    def generate_test_cases(self, code: str, existing_tests: List[str]) -> List[str]: # type: ignore
        prompt = f"""Given the following code and existing test cases, generate additional comprehensive test cases:
        Code: {code}
        Existing Tests: {existing_tests}
        
        Generate diverse test cases including edge cases, normal cases, and corner cases.
        """
        
        response = self.model.invoke([HumanMessage(content=prompt)]) # type: ignore
        return self.output_parser.invoke(response.content).split("\n")
