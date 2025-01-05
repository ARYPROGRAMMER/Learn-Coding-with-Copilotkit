from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

system = """You a 4000 rated Competitive Programmer that writes optimised and fully detailed working code in python \n 
    Given a question and the generated code for it \n
    You have to provide the appropriate mermaid code to visualise the code approach generated \n
    Make sure that your output contains only mermaid code"""

visualisation_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "code: \n\n {code} \n\n User question: {question}"),
    ]
)

visualization_generated = visualisation_prompt 