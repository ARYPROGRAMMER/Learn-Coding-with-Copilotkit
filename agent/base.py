from typing import Dict, List, Optional
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from langgraph.prebuilt import ToolExecutor
from langchain_core.tools import Tool

class BaseTool:
    def __init__(self):
        self.model = ChatGroq(
            api_key="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",
            model="llama-3.3-70b-versatile",
            temperature=0
        )
        self.output_parser = StrOutputParser()