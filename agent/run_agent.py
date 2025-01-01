# agent/api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from graph import create_graph, AgentState
import uvicorn
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class CopilotRequest(BaseModel):
    question: str
    testCases: List[str]

class CopilotResponse(BaseModel):
    solution: Optional[str]
    time_complexity_out: Optional[str]
    space_complexity_out: Optional[str]
    visualization: Optional[str]
    test_cases_out: List[str]

@app.post("/api/copilot")
async def process_request(request: CopilotRequest) -> CopilotResponse:
    logger.info(f"Received request with question: {request.question}")
    
    try:
        # Create initial state
        initial_state: AgentState = {
            "question": request.question,
            "test_cases": request.testCases,
            "solution": None,
            "explanation": None,
            "time_complexity": None,
            "space_complexity": None,
            "visualization": None,
            "test_cases_out": []
        }
        
        logger.info("Creating graph...")
        graph = create_graph()
        
        logger.info("Running graph...")
        final_state = graph.invoke(initial_state)
        
        logger.info("Processing completed successfully")
        return CopilotResponse(
            solution=final_state["solution"],
            time_complexity_out=final_state["time_complexity"],
            space_complexity_out=final_state["space_complexity"],
            visualization=final_state["visualization"],
            test_cases_out=final_state["test_cases_out"]
        )
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info("Starting Copilot API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)