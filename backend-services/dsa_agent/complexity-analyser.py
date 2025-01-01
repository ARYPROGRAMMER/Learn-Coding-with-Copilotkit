from typing import Dict
from langchain_groq import ChatGroq

def analyze_complexity(code: str, llm: ChatGroq) -> Dict[str, str]:
    """Analyzes time and space complexity of given code"""
    prompt = f"""Analyze the following code and provide its time and space complexity.
    Format the response as JSON with keys 'timeComplexity' and 'spaceComplexity'.
    
    Code:
    {code}
    """
    
    response = llm.invoke(prompt)
    
    try:
        return eval(response.content)
    except:
        return {
            "timeComplexity": "Unknown",
            "spaceComplexity": "Unknown"
        }