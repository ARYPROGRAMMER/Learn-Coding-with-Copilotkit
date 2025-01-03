# demo.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from graph import AgentState, create_graph
import logging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class CopilotRequest(BaseModel):
    question: str
    testCases: List[str]

class CopilotResponse(BaseModel):
    code: Optional[str]
    explanation: Optional[str]
    time_complexity: Optional[str]
    space_complexity: Optional[str]
    visualization: Optional[str]

@app.post("/copilotkit")
async def process_request(request: CopilotRequest) -> CopilotResponse:
    logger.info(f"Received request with question: {request.question}")
    
    try:
        # Create initial state
        initial_state: AgentState = {
            "question": request.question,
            "testCases": request.testCases,
            "code": None,
            "explanation": None,
            "time_complexity": None,
            "space_complexity": None,
            "visualization": None
        }
        
        logger.info("Creating graph...")
        graph = create_graph()
        
        logger.info("Running graph...")
        final_state = graph.invoke(initial_state)

        logger.info("Processing completed successfully")
        return CopilotResponse(
            code=final_state["code"],
            explanation=final_state["explanation"],
            time_complexity=final_state["time_complexity"],
            space_complexity=final_state["space_complexity"],
            visualization=final_state["visualization"],
        )
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info("Starting Copilot API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
