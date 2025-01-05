from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

system = """You a 4000 rated Competitive Programmer that figures out Time and Space Complexity of a fully working code in python \n 
    Given a code in python language \n
    You have to provide the appropriate List of 2 elements having first as Time Complexity and Second as Space Complexity of the code provided \n
    Make sure that your output contains only a python list of 2 elements"""

complexity_find = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "code: \n\n {code}"),
    ]
)

complexity_generated = complexity_find 