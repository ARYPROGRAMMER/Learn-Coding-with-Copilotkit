from typing import List, Dict
from langchain_groq import ChatGroq
import json

def generate_test_cases(problem: str, llm: ChatGroq) -> List[Dict[str, str]]:
    """Generates test cases for the problem"""
    prompt = f"""Generate 3 diverse test cases for this problem.
    Include edge cases and normal cases.
    Format as JSON array with 'input' and 'output' keys.
    
    Problem:
    {problem}
    """
    
    response = llm.invoke(prompt)
    
    try:
        return json.loads(response.content)
    except:
        return [{"input": "", "output": ""}]
