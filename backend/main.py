from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="VectorShift Pipeline API",
    description="Backend API for processing pipeline nodes and edges",
    version="1.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models for request/response
class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None # type: ignore
    targetHandle: str = None # type: ignore

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    message: str = None # type: ignore
    details: Dict[str, Any] = None # type: ignore

# DAG validation algorithm
def is_directed_acyclic_graph(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG)
    using DFS-based cycle detection with topological sorting validation.
    """
    if not nodes:
        return True
    
    # Build adjacency list
    graph = {node.id: [] for node in nodes}
    in_degree = {node.id: 0 for node in nodes}
    
    # Add edges to graph
    for edge in edges:
        if edge.source in graph and edge.target in graph:
            graph[edge.source].append(edge.target)
            in_degree[edge.target] += 1
    
    # Topological sort using Kahn's algorithm
    queue = []
    processed_count = 0
    
    # Find all nodes with no incoming edges
    for node_id, degree in in_degree.items():
        if degree == 0:
            queue.append(node_id)
    
    # Process nodes
    while queue:
        current = queue.pop(0)
        processed_count += 1
        
        # Process all neighbors
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If all nodes processed, it's a DAG
    return processed_count == len(nodes)

def analyze_pipeline(nodes: List[Node], edges: List[Edge]) -> Dict[str, Any]:
    """
    Analyze the pipeline and return detailed information
    """
    analysis = {
        "node_types": {},
        "isolated_nodes": [],
        "entry_points": [],
        "exit_points": [],
        "cycles": []
    }
    
    # Count node types
    for node in nodes:
        node_type = node.type
        analysis["node_types"][node_type] = analysis["node_types"].get(node_type, 0) + 1
    
    # Find isolated nodes, entry points, and exit points
    connected_nodes = set()
    sources = set()
    targets = set()
    
    for edge in edges:
        connected_nodes.add(edge.source)
        connected_nodes.add(edge.target)
        sources.add(edge.source)
        targets.add(edge.target)
    
    # Isolated nodes have no connections
    analysis["isolated_nodes"] = [node.id for node in nodes if node.id not in connected_nodes]
    
    # Entry points are nodes that are sources but not targets
    analysis["entry_points"] = list(sources - targets)
    
    # Exit points are nodes that are targets but not sources
    analysis["exit_points"] = list(targets - sources)
    
    return analysis

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {"message": "VectorShift Pipeline API is running", "status": "healthy"}

@app.post("/pipelines/parse", response_model=PipelineResponse)
def parse_pipeline(request: PipelineRequest):
    """
    Parse pipeline and analyze its structure
    Returns number of nodes, edges, and DAG status
    """
    try:
        logger.info(f"Received pipeline with {len(request.nodes)} nodes and {len(request.edges)} edges")
        
        # Basic validation
        if not request.nodes:
            return PipelineResponse(
                num_nodes=0,
                num_edges=len(request.edges),
                is_dag=True,  # Empty graph is technically a DAG
                message="Empty pipeline - no nodes provided",
                details={"warning": "Pipeline contains no nodes"}
            )
        
        # Validate that all edge references exist
        node_ids = {node.id for node in request.nodes}
        invalid_edges = []
        
        for edge in request.edges:
            if edge.source not in node_ids or edge.target not in node_ids:
                invalid_edges.append(edge.id)
        
        if invalid_edges:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid edges reference non-existent nodes: {invalid_edges}"
            )
        
        # Check if it's a DAG
        is_dag = is_directed_acyclic_graph(request.nodes, request.edges)
        
        # Analyze pipeline structure
        analysis = analyze_pipeline(request.nodes, request.edges)
        
        # Generate informative message
        message_parts = []
        if is_dag:
            message_parts.append(" Valid DAG structure")
        else:
            message_parts.append(" Contains cycles - not a DAG")
        
        if analysis["isolated_nodes"]:
            message_parts.append(f" {len(analysis['isolated_nodes'])} isolated nodes")
        
        message = " | ".join(message_parts) if message_parts else "Pipeline analyzed successfully"
        
        logger.info(f"Pipeline analysis: DAG={is_dag}, Analysis={analysis}")
        
        return PipelineResponse(
            num_nodes=len(request.nodes),
            num_edges=len(request.edges),
            is_dag=is_dag,
            message=message,
            details={
                "node_types": analysis["node_types"],
                "isolated_nodes": analysis["isolated_nodes"],
                "entry_points": analysis["entry_points"],
                "exit_points": analysis["exit_points"],
                "total_connections": len(request.edges)
            }
        )
        
    except Exception as e:
        logger.error(f"Error processing pipeline: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/pipelines/validate/{pipeline_id}")
def validate_pipeline(pipeline_id: str):
    """
    Placeholder endpoint for future pipeline validation by ID
    """
    return {"message": f"Validation for pipeline {pipeline_id} not implemented yet"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
