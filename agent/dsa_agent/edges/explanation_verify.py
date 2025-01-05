from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class VerifyExplanation(BaseModel):
    """Binary output to verify the explanation of the python code provided."""

    binary_score: str = Field(
        description="Python Code provided is correctly explained for the question asked 'yes' or 'no'"
    )

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
explanation_verification = llm.with_structured_output(VerifyExplanation)

system = """You a 4000 rated Competitive Programmer that explains an optimised and fully detailed working code in python \n 
    Given a question and the generated code for it \n
    You have to provide the explanation in markdown of the code to solve the question and of the approach generated \n
    Make sure that your output contains only markdown code"""

explaination_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "Python Code Generated: \n\n {code} \n\n Initially Question Asked: {question}"),
    ]
)

explaination_verify = explaination_prompt | explanation_verification