from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class VerifyCode(BaseModel):
    """Binary ouput to assess code solves the question."""

    binary_score: str = Field(
        description="Code solves the question, 'yes' or 'no'"
    )

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
code_verification = llm.with_structured_output(VerifyCode)

system = """You a 4000 rated Competitive Programmer that writes optimised and fully detailed working code in python \n 
     Given a question you are expected to write a working code in python that is generic and well optimised \n"""


code_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "User question: \n\n {question} \n\n Code Generated: \n\n {code} \n\n"),
    ]
)

code_verify = code_prompt  | code_verification