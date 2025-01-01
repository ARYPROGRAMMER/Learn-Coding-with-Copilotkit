from langchain_groq import ChatGroq

def generate_visualization(problem: str, llm: ChatGroq) -> str:
    """Generates a Mermaid diagram for the problem"""
    prompt = f"""Create a Mermaid diagram to visualize the solution approach for this problem.
    Use proper Mermaid syntax and focus on the algorithm's flow.
    
    Problem:
    {problem}
    """
    
    response = llm.invoke(prompt)
    return response.content.strip()
