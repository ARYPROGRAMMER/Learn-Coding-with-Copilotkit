from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

system = """You a 4000 rated Competitive Programmer that writes optimised and fully detailed working code in python \n 
     Given a question you are expected to write a working code in python that is generic and well optimised \n"""

re_write_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        (
            "human",
            "Here is the question: \n\n {question} \n. Formulate an optimised answer in python.",
        ),
    ]
)

code_writer = re_write_prompt | llm | StrOutputParser()