import React, { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const formatPipelineData = () => {
    // Format nodes and edges for backend
    const formattedNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data || {}
    }));

    const formattedEdges = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null
    }));

    return {
      nodes: formattedNodes,
      edges: formattedEdges
    };
  };

  const showDetailedAlert = (response) => {
    const { num_nodes, num_edges, is_dag, message, details } = response;
    
    // Create detailed alert message
    let alertMessage = ` Pipeline Analysis Results\n\n`;
    alertMessage += ` Overview:\n`;
    alertMessage += `   • Nodes: ${num_nodes}\n`;
    alertMessage += `   • Connections: ${num_edges}\n`;
    alertMessage += `   • Is DAG: ${is_dag ? ' Yes' : ' No'}\n\n`;
    
    if (message) {
      alertMessage += ` Status: ${message}\n\n`;
    }
    
    if (details) {
      if (details.node_types && Object.keys(details.node_types).length > 0) {
        alertMessage += ` Node Types:\n`;
        Object.entries(details.node_types).forEach(([type, count]) => {
          alertMessage += `   • ${type}: ${count}\n`;
        });
        alertMessage += `\n`;
      }
      
      if (details.entry_points && details.entry_points.length > 0) {
        alertMessage += ` Entry Points: ${details.entry_points.join(', ')}\n`;
      }
      
      if (details.exit_points && details.exit_points.length > 0) {
        alertMessage += ` Exit Points: ${details.exit_points.join(', ')}\n`;
      }
      
      if (details.isolated_nodes && details.isolated_nodes.length > 0) {
        alertMessage += ` Isolated Nodes: ${details.isolated_nodes.join(', ')}\n`;
      }
    }
    
    if (!is_dag) {
      alertMessage += `\n Warning: Pipeline contains cycles and is not a valid DAG!\n`;
      alertMessage += `This may cause infinite loops during execution.`;
    } else if (num_nodes === 0) {
      alertMessage += `\n Tip: Add some nodes to build your pipeline!`;
    } else {
      alertMessage += `\n Pipeline structure looks good!`;
    }
    
    alert(alertMessage);
  };

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert(' No nodes to submit!\n\nPlease add some nodes to your pipeline before submitting.');
      return;
    }

    setIsLoading(true);
    
    try {
      const pipelineData = formatPipelineData();
      
      console.log('Submitting pipeline to backend:', pipelineData);
      
      // Send POST request to FastAPI backend
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(pipelineData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Backend response:', result);
      
      setLastResponse(result);
      showDetailedAlert(result);
      
    } catch (error) {
      console.error('Submit error:', error);
      
      let errorMessage = ' Failed to submit pipeline\n\n';
      
      if (error.message.includes('fetch')) {
        errorMessage += ' Connection Error:\n';
        errorMessage += 'Cannot connect to backend server.\n\n';
        errorMessage += ' Make sure the FastAPI server is running:\n';
        errorMessage += '   1. Navigate to the backend folder\n';
        errorMessage += '   2. Run: pip install fastapi uvicorn\n';
        errorMessage += '   3. Run: uvicorn main:app --reload --host 0.0.0.0 --port 8000\n';
        errorMessage += '   4. Server should be available at http://localhost:8000';
      } else if (error.message.includes('HTTP 4')) {
        errorMessage += ' Request Error:\n';
        errorMessage += 'Invalid pipeline data sent to server.\n\n';
        errorMessage += `Details: ${error.message}`;
      } else if (error.message.includes('HTTP 5')) {
        errorMessage += ' Server Error:\n';
        errorMessage += 'Backend server encountered an error.\n\n';
        errorMessage += `Details: ${error.message}`;
      } else {
        errorMessage += `Unexpected error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonColor = () => {
    if (isLoading) return '#9ca3af';
    if (nodes.length === 0) return '#d1d5db';
    if (lastResponse && !lastResponse.is_dag) return '#ef4444';
    return '#667eea';
  };

  const getButtonText = () => {
    if (isLoading) return 'Analyzing Pipeline...';
    if (nodes.length === 0) return 'Add Nodes First';
    return 'Submit & Analyze Pipeline';
  };

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '16px'
    }}>
      {/* Pipeline Stats */}
      <div style={{
        fontSize: '13px',
        color: '#6b7280',
        fontWeight: '500',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '2px'
      }}>
        <div>{nodes.length} nodes • {edges.length} connections</div>
        {lastResponse && (
          <div style={{ 
            fontSize: '11px',
            color: lastResponse.is_dag ? '#059669' : '#dc2626',
            fontWeight: '600'
          }}>
            {lastResponse.is_dag ? ' Valid DAG' : ' Contains Cycles'}
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <button 
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          background: getButtonColor(),
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isLoading ? 'wait' : nodes.length === 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: nodes.length === 0 ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '200px',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          if (!isLoading && nodes.length > 0) {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = 'none';
        }}
      >
        {isLoading && (
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        )}
        {getButtonText()}
      </button>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};