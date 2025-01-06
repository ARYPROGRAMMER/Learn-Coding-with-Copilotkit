from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

system = """You provide visualisation of a complex problem by generating corresponding mermaid flowchart code\n 
    Given the question\n
    You have to provide the appropriate mermaid flowchart code to visualise the solution\n
    Make sure that your output contains only mermaid flowchart code in the format ```mermaid\n{code}\n```\n"""

visualisation_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "question: \n\n {question}"),
    ]
)

visualization_generated = visualisation_prompt 