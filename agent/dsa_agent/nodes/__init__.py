from dsa_agent.nodes.visualiser import visualization_generated
from dsa_agent.nodes.complexity_finder import complexity_generated
from dsa_agent.nodes.explainer import explanation_generated
from dsa_agent.nodes.coding import code_writer
from dsa_agent.nodes.question import question_instance
from langchain_core.messages import HumanMessage

def retrieve_question(state):
    """
    Retrieve Question

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, documents, that contains retrieved documents
    """
    print("---GETTING QUESTION---")
    messages = state["messages"]
    question = messages[-1].content

    return {
        **state,
        "question": question,
    }

def update_question(state):
    print("---UPDATE QUESTION---")

    new_question = state["question"]
    print(f"---NEW QUESTION DETECTED: {new_question}---")

    question_instance.update_question(new_question)

    print("---QUESTION UPDATED---")

    return {**state, "question": new_question , "messages": []}

def code_generation_in_node(state):
    """
    Writes the code for the question

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates code key with a generated code
    """

    print("---TRANSFORM QUERY---")
    question = state["question"]
    testCases = state["testCases"]

    code_generated = code_writer.invoke({"question": question , "testCases": testCases})
    return {**state, "code": code_generated}

def visualize_code(state):
    '''
    Visualizes the code generated
    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with only filtered relevant documents
    '''

    print("---VISUALIZE CODE---")
    code = state["code"]
    question = state["question"]

    visualization = visualization_generated.invoke({"code": code, "question": question})
    return {**state, "visualization": visualization}

def complexity_analysis(state):
    '''
    Analyzes the complexity of the code generated
    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with only filtered relevant documents
    '''

    print("---ANALYZE COMPLEXITY---")
    code = state["code"]

    complexity = complexity_generated.invoke({"code": code})
    return {**state, "time_complexity": list(complexity)[0], "space_complexity": list(complexity)[1]}

def explaination_code(state):
    '''
    Explains the code generated
    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with only filtered relevant documents
    '''

    print("---EXPLAIN CODE---")
    question = state["question"]
    code = state["code"]

    explanation = explanation_generated.invoke({"code": code, "question": question})
    return {**state, "explanation": explanation}

def no_context(state):
    print("---NO CONTEXT---")

    messages = state["messages"]
    messages.append(HumanMessage("I'm sorry, I can't find any relevant information."))

    return state