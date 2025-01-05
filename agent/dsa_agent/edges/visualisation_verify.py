from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class VerifyVisualisation(BaseModel):
    """Binary output to verify the mermaid code generated to visualise the python code."""

    binary_score: str = Field(
        description="Python Code generated is correctly visualised by the mermaid code, 'yes' or 'no'"
    )

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
viusalisation_verification = llm.with_structured_output(VerifyVisualisation)

system = """You a 4000 rated Competitive Programmer that visualises an optimised and fully detailed working code in python \n 
    Given a question and the generated code for it \n
    You have to provide the appropriate mermaid code to visualise the code approach generated \n
    Make sure that your output contains only mermaid code"""

visualisation_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "Python Code Generated: \n\n {code} \n\n Visualised Code Generated in Mermaid: {visualization}"),
    ]
)

visualisation_verify = visualisation_prompt | viusalisation_verification