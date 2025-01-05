from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

system = """You a 4000 rated Competitive Programmer that writes explaination for a fully working code in python \n 
    Given a question and the generated code for it \n
    You have to provide the appropriate explanation of the code in markdown to explain the code approach generated \n
    Make sure that your output contains only markdown code"""

explain_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", " User question: {question} \n\n code generated: \n\n {code}"),
    ]
)

explanation_generated = explain_prompt 