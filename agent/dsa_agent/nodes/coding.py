from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

system = """You a 4000 rated Competitive Programmer that writes optimised and fully detailed working code in python \n 
     Given a question and testCases you are expected to write a working code in python that passes all the testCases and is generic and well optimised \n"""

re_write_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        (
            "human",
            "Here is the question: \n\n {question} \n and here are the test cases : \n\n {testCases}. Formulate an optimise answer in python.",
        ),
    ]
)

code_writer = re_write_prompt | llm | StrOutputParser()