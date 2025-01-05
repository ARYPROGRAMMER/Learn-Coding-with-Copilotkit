from typing import List, Annotated, Sequence, Dict, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    """
    Represents the state of our graph.

    Attributes:
        question: str
        # testCases: List[str]
        code: Optional[str]
        explanation: Optional[str]
        time_complexity: Optional[str]
        space_complexity: Optional[str]
        visualization: Optional[str]
        # messages: list of messages
    """
     
    question: str
    # testCases: Optional[List[str]] # type: ignore
    # messages: Annotated[Sequence[BaseMessage], add_messages]
    code: Optional[str] 
    explanation: Optional[str]
    time_complexity: Optional[str] 
    space_complexity: Optional[str] 
    visualization: Optional[str] 