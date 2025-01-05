
from langchain_core.messages import SystemMessage, HumanMessage
from dsa_agent.edges.code_verify import code_verify
from dsa_agent.edges.visualisation_verify import visualisation_verify
from dsa_agent.edges.complexity_verify import complexity_verify
from dsa_agent.edges.explanation_verify import explaination_verify

def new_question(state):
    messages = state["messages"]
    last_message = messages[-1]

    if (
        isinstance(last_message, SystemMessage)
        and "QUESTION UPDATED" in last_message.content
    ):
        return "update_question"

    return "retrieve_question"


def decide_to_generate_code(state):
    """
    Determines whether to re-generate the code or not.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binary decision for next node to call
    """

    print("---ASSESS GENERATED CODE---")
    code = state["code"]
    question = state["question"]

    print("---GRADE CODE---")
    score = code_verify.invoke({"question": question, "code": code})
    grade = score.binary_score

    if grade == "yes":
        print("---DECISION: CODE IS CORRECT---")
        return "useful"
    else:
        print("---DECISION: CODE IS INCORRECT---")
        return "code_generation_in_node"


def decide_to_generate_visualisation(state):
    """
    Determines whether to re-generate the visualization or not.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binary decision for next node to call
    """

    print("---ASSESS MERMAID VISUALISATION CODE---")
    code = state["code"]
    visualization = state["visualization"]

    print("---GRADE CODE---")
    score = visualisation_verify.invoke({"code": code,"visualization": visualization})
    grade = score.binary_score

    if grade == "yes":
        print("---DECISION: CODE IS CORRECT---")
        return "useful"
    else:
        print("---DECISION: VISUALISATION IS INCORRECT---")
        return "visualize_code"


def decide_to_generate_complexity(state):
    """
    Determines whether to re-generate the complexity.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binary decision for next node to call
    """

    
    print("---ASSESS GENERATED COMPLEXITY---")
    code = state["code"]
    time_complexity = state["time_complexity"]
    space_complexity = state["space_complexity"]

    print("---GRADE CODE---")
    score = complexity_verify.invoke({"code": code,"time_complexity": time_complexity, "space_complexity": space_complexity})
    grade = score.binary_score

    if grade == "yes":
        print("---DECISION: CODE IS CORRECT---")
        return "useful"
    else:
        print("---DECISION: COMPLEXITY IS INCORRECT---")
        return "complexity_analysis"


def decide_to_generate_explanation(state):
    """
    Determines whether to re-generate the explanation or not.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binary decision for next node to call
    """

    print("---ASSESS EXPLANATION OF CODE---")
    code = state["code"]
    question = state["question"]

    print("---GRADE EXPLANATION---")
    score = explaination_verify.invoke({"code": code, "question": question})
    grade = score.binary_score

    if grade == "yes":
        print("---DECISION: CODE IS CORRECT---")
        return "useful"
    else:
        print("---DECISION: EXPLANATION IS INCORRECT---")
        return "explaination_code"
