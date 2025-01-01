from base import BaseTool
from langchain_core.messages import AIMessage, HumanMessage

class VisualizationGenerator(BaseTool):
    def generate_mermaid_visualization(self, code: str) -> str:
        prompt = f"""For the following code, create a Mermaid diagram that visualizes the algorithm's flow:
        {code}
        
        Create a flowchart using Mermaid syntax. Focus on key steps and decision points.
        The diagram should start with 'flowchart TD' and use proper Mermaid syntax.
        Include clear labels and connections between nodes.
        """
        
        response = self.model.invoke([HumanMessage(content=prompt)]) # type: ignore
        return self.output_parser.invoke(response.content)
