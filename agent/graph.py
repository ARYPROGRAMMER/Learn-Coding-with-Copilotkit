from typing import Dict, List, Annotated, TypedDict,Optional
from langgraph.graph import Graph, StateGraph
from langchain_core.messages import AIMessage, HumanMessage

from tools.code_generator import CodeGenerator
from tools.complexity_analyser import ComplexityAnalyzer # type: ignore
from tools.test_case_generator import TestCaseGenerator
from tools.visualisation_generator import VisualizationGenerator# type: ignore

class AgentState(TypedDict):
    question: str
    test_cases: List[str]
    solution: Optional[str] # type: ignore
    explanation: Optional[str] # type: ignore
    time_complexity: Optional[str] # type: ignore
    space_complexity: Optional[str] # type: ignore
    visualization: Optional[str] # type: ignore
    test_cases_out: List[str]

def create_graph():
    # Initialize tools
    code_gen = CodeGenerator()
    complexity = ComplexityAnalyzer()
    test_gen = TestCaseGenerator()
    viz_gen = VisualizationGenerator()
    
    # Define nodes
    def generate_solution(state: AgentState) -> AgentState:
        result = code_gen.generate_code(state["question"])
        state["solution"] = result
        return state
    
    def analyze_complexity(state: AgentState) -> AgentState:
        complexities = complexity.analyze_complexity(state["solution"])
        state["time_complexity"] = complexities["time_complexity"]
        state["space_complexity"] = complexities["space_complexity"]
        return state
    
    def generate_tests(state: AgentState) -> AgentState:
        state["test_cases_out"] = test_gen.generate_test_cases(
            state["solution"],
            state["test_cases"]
        )
        return state
    
    def generate_viz(state: AgentState) -> AgentState:
        state["visualization"] = viz_gen.generate_mermaid_visualization(state["solution"])
        return state
    
    # Create graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("generate_solution", generate_solution)
    workflow.add_node("analyze_complexity", analyze_complexity)
    workflow.add_node("generate_tests", generate_tests)
    workflow.add_node("generate_viz", generate_viz)
    
    # Define edges
    workflow.add_edge("generate_solution", "analyze_complexity")
    workflow.add_edge("analyze_complexity", "generate_tests")
    workflow.add_edge("generate_tests", "generate_viz")
    
    # Set entry point
    workflow.set_entry_point("generate_solution")
    
    return workflow.compile()