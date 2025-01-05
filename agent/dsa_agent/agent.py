from langgraph.graph import END, StateGraph, START
from dsa_agent.state import AgentState
from dsa_agent.nodes import (
    retrieve_question,
    update_question,
    code_generation_in_node,
    visualize_code,
    complexity_analysis,
    explaination_code,
    no_context
)
from dsa_agent.edges import (
    new_question,
    decide_to_generate_code,
    decide_to_generate_visualisation,
    decide_to_generate_complexity,
    decide_to_generate_explanation
)
from langgraph.checkpoint.memory import MemorySaver


workflow = StateGraph(AgentState)

workflow.add_node("update_question", update_question)
workflow.add_node("retrieve_question", retrieve_question)
workflow.add_node("code_generation_in_node", code_generation_in_node)
workflow.add_node("visualize_code", visualize_code)
workflow.add_node("complexity_analysis", complexity_analysis)
workflow.add_node("explaination_code", explaination_code)
workflow.add_node("no_context", no_context)

workflow.add_conditional_edges(
    START,
    new_question,
    {
        "update_question": "update_question",
        "retrieve_question": "retrieve_question",
    },
)



workflow.add_edge("retrieve_question", "code_generation_in_node")



workflow.add_conditional_edges(
    "code_generation_in_node",
    decide_to_generate_code,
    {
        "useful": "visualize_code",
        "code_generation_in_node": "code_generation_in_node",
    },
)



workflow.add_edge("visualize_code", "retrieve_question")


workflow.add_conditional_edges(
    "visualize_code",
    decide_to_generate_visualisation,
    {
        "useful": "complexity_analysis",
        "visualize_code": "visualize_code",
    },
)

workflow.add_edge("complexity_analysis", "retrieve_question")


workflow.add_conditional_edges(
    "complexity_analysis",
    decide_to_generate_complexity,
    {
        "useful": "explaination_code",
        "complexity_analysis": "complexity_analysis",
    },
)

workflow.add_edge("explaination_code", "retrieve_question")


workflow.add_conditional_edges(
    "explaination_code",
    decide_to_generate_explanation,
    {
        "useful": END,
        "explaination_code": "explaination_code",
    },
)

workflow.add_edge("update_question", END)

workflow.add_edge("no_context", END)

graph = workflow.compile(checkpointer=MemorySaver())