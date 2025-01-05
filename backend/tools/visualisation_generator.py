from base import BaseTool
from langchain_core.messages import AIMessage, HumanMessage

class VisualizationGenerator(BaseTool):
    def generate_mermaid_visualization(self, code: str) -> str:
        prompt = f"""For the following code, create a well labelled Mermaid CODE FOR THE diagram that visualizes the algorithm's flow:
        {code}
        
        Create a flowchart using Mermaid syntax. Focus on key steps and decision points.
        The diagram should start with 'flowchart TD' and use proper Mermaid syntax.
        Include clear labels and connections between nodes. Ensure the diagram is easy to understand and follow.

        DO NOT INCLUDE ANYTHING ELSE JUST THE MERMAID CODE FOR THE FLOWCHART AND MAKE IT WELL STRUCTURED AND LABELLED AND ONLY AND ONLY RETURN THE MERMAID CODE.
        """
        
        response = self.model.invoke([HumanMessage(content=prompt)]) # type: ignore
        return self.output_parser.invoke(response.content)
