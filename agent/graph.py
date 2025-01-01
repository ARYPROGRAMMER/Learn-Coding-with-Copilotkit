from typing import Dict, List, Annotated, TypedDict,Optional
from langgraph.graph import Graph, StateGraph
from langchain_core.messages import AIMessage, HumanMessage

from tools.code_generator import CodeGenerator
from tools.explanation_generator import ExplanationGenerator
from tools.complexity_analyser import ComplexityAnalyzer # type: ignore
from tools.visualisation_generator import VisualizationGenerator# type: ignore

class AgentState(TypedDict):
    question: str
    testCases: List[str]
    code: Optional[str] # type: ignore
    explanation: Optional[str] # type: ignore
    time_complexity: Optional[str] # type: ignore
    space_complexity: Optional[str] # type: ignore
    visualization: Optional[str] # type: ignore


def create_graph():
    # Initialize tools
    code_gen = CodeGenerator()
    explain_gen = ExplanationGenerator()
    complexity = ComplexityAnalyzer()
    viz_gen = VisualizationGenerator()
    
    # Define nodes
    def generation_of_code(state: AgentState) -> AgentState:
        result = code_gen.generate_code(state["question"],state["testCases"])
        state["code"] = result
        return state
    
    def generate_explanation(state: AgentState) -> AgentState:
        explanation = explain_gen.generate_explanation(state["question"],state["testCases"],state["code"])
        state["explanation"] = explanation
        return state
    
    def analyze_complexity(state: AgentState) -> AgentState:
        input_string = complexity.analyze_complexity(state["code"])
        complexities = []
        current_complexity = ""
        inside_complexity = False

        for char in input_string:
            if char == "O":  # Start of a complexity
                inside_complexity = True
                current_complexity += char
            elif inside_complexity:
                current_complexity += char
                if char == ")":  # End of a complexity
                    complexities.append(current_complexity)
                    current_complexity = ""
                    inside_complexity = False

        state["time_complexity"] = complexities[0]
        state["space_complexity"] = complexities[1]
        return state
    
    def generate_viz(state: AgentState) -> AgentState:
        state["visualization"] = viz_gen.generate_mermaid_visualization(state["code"])
        return state
    
    # Create graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("generate_code", generation_of_code)
    workflow.add_node("generate_explanation", generate_explanation)
    workflow.add_node("analyze_complexity", analyze_complexity)
    workflow.add_node("generate_viz", generate_viz)
    
    # Define edges
    workflow.add_edge("generate_code", "generate_explanation")
    workflow.add_edge("generate_explanation", "analyze_complexity")
    workflow.add_edge("analyze_complexity", "generate_viz")
    
    # Set entry point
    workflow.set_entry_point("generate_code")
    
    return workflow.compile()