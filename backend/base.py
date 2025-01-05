from typing import Dict, List, Optional
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from langgraph.prebuilt import ToolExecutor
from langchain_core.tools import Tool
import os
from dotenv import load_dotenv
load_dotenv()

class BaseTool:
    def __init__(self):
        self.model = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model="llama-3.3-70b-versatile",
            temperature=0.5,
        )
        self.output_parser = StrOutputParser()