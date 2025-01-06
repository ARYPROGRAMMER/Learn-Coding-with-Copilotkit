from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class VerifyVisualisation(BaseModel):
    """Binary output to verify the mermaid code generated to visualise the python code."""

    binary_score: str = Field(
        description="Mermaid Code generated is correct, 'yes' or 'no'"
    )

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
viusalisation_verification = llm.with_structured_output(VerifyVisualisation)

system = """You provide visualisation of a complex problem by generating corresponding mermaid code\n 
    Given the question\n
    You have to provide the appropriate mermaid code to visualise the solution\n
    Make sure that your output contains only mermaid flowchart code in the format ```mermaid\nFLOWCHART...```\n"""

visualisation_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "question: \n\n {question}"),
    ]
)

visualisation_verify = visualisation_prompt | viusalisation_verification