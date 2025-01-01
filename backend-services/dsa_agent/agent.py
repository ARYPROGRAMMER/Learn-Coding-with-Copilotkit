# langgraph_agent.py
from typing import Dict, List, Tuple, Any
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.prebuilt import ToolExecutor
from langgraph.graph import Graph, END
from langchain_groq import ChatGroq
from langchain_core.tools import Tool
import operator
from typing import TypedDict, Annotated, Sequence
import json

# Define types for our graph
class AgentState(TypedDict):
    messages: Annotated[Sequence[Dict], operator.add]
    next: str

# Initialize Groq LLM
llm = ChatGroq(
    api_key="your-groq-api-key",
    model_name="mixtral-8x7b-32768"
)

# Define our tools
def analyze_complexity(code: str) -> Dict[str, str]:
    """Analyzes time and space complexity of given code"""
    prompt = f"Analyze the following code and provide its time and space complexity:\n{code}"
    response = llm.invoke(prompt)
    return {
        "timeComplexity": response.content.split("Time Complexity:")[1].split("Space Complexity:")[0].strip(),
        "spaceComplexity": response.content.split("Space Complexity:")[1].strip()
    }

def generate_visualization(problem: str) -> str:
    """Generates a Mermaid diagram for the problem"""
    prompt = f"Create a Mermaid diagram to visualize the solution approach for this problem:\n{problem}"
    response = llm.invoke(prompt)
    return response.content

def generate_test_cases(problem: str) -> List[Dict[str, str]]:
    """Generates test cases for the problem"""
    prompt = f"Generate 3 diverse test cases for this problem:\n{problem}"
    response = llm.invoke(prompt)
    return json.loads(response.content)

tools = [
    Tool(
        name="complexity_analyzer",
        description="Analyzes time and space complexity of code",
        func=analyze_complexity
    ),
    Tool(
        name="visualizer",
        description="Generates Mermaid diagram for visualization",
        func=generate_visualization
    ),
    Tool(
        name="test_generator",
        description="Generates test cases",
        func=generate_test_cases
    )
]

# Create tool executor
tool_executor = ToolExecutor(tools)

# Define agent functions
def should_use_tool(state: AgentState) -> Tuple[str, str]:
    """Decide if and which tool to use"""
    messages = state["messages"]
    response = llm.invoke(
        messages + [SystemMessage(content="What tool should be used next? Reply with 'END' if no tool is needed.")]
    )
    tool_name = response.content
    return "tool" if tool_name != "END" else "end", tool_name

def call_tool(state: AgentState, tool_name: str) -> AgentState:
    """Call the specified tool"""
    messages = state["messages"]
    # Extract relevant info from messages and call tool
    result = tool_executor.execute(tool_name, messages[-1].content)
    return {
        "messages": messages + [HumanMessage(content=str(result))],
        "next": "agent"
    }

def process_response(state: AgentState) -> AgentState:
    """Process the final response"""
    messages = state["messages"]
    final_response = llm.invoke(messages + [SystemMessage(content="Provide final solution summary")])
    return {
        "messages": messages + [final_response],
        "next": "end"
    }

# Create the graph
workflow = Graph()

# Add nodes
workflow.add_node("agent", should_use_tool)
workflow.add_node("tool", call_tool)
workflow.add_node("process", process_response)

# Add edges
workflow.add_edge("agent", "tool")
workflow.add_edge("tool", "agent")
workflow.add_edge("agent", "process")
workflow.add_edge("process", END)

# Compile the graph
app = workflow.compile()

def solve_dsa_problem(problem: str, test_cases: List[Dict[str, str]] = None) -> Dict:
    """Main function to solve DSA problems"""
    initial_state = {
        "messages": [HumanMessage(content=problem)],
        "next": "agent"
    }
    result = app.invoke(initial_state)
    
    # Process result into structured format
    final_message = result["messages"][-1].content
    # Parse the response into required format
    try:
        response_dict = json.loads(final_message)
    except:
        # Fallback structure if parsing fails
        response_dict = {
            "explanation": final_message,
            "code": "",
            "timeComplexity": "",
            "spaceComplexity": "",
            "visualization": "",
            "testCases": test_cases or []
        }
    
    return response_dict