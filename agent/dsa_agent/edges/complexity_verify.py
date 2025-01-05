from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class VerifyComplexity(BaseModel):
    """Binary output to verify the time and space complexity generated of the python code provided."""

    binary_score: str = Field(
        description="Python Code provided has the same time and space complexity as generated, 'yes' or 'no'"
    )

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
complexity_verification = llm.with_structured_output(VerifyComplexity)

system = """You a 4000 rated Competitive Programmer that analyzes optimised and fully detailed working code in python \n 
    Given a code in python \n
    You have to provide the appropriate List of 2 string elements first being time complexity of code and second being space complexity of the code \n
    Make sure that your output contains list of 2 string only"""

complexity_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "Python Code: \n\n {code} \n\n Time Complexity of Code Generated: {time_complexity} \n Space Complexity of Code Generated: {space_complexity}"),
    ]
)

complexity_verify = complexity_prompt | complexity_verification