import React from 'react';

const DraggableNode = ({ type, label, description }) => {
  const onDragStart = (event) => {
    const appData = { nodeType: type };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={onDragStart}
      draggable
      style={{
        cursor: 'grab',
        minHeight: '50px', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        border: '2px solid #e5e7eb',
        marginBottom: '6px',
        padding: '10px 14px', 
        color: '#374151',
        fontWeight: '600',
        fontSize: '13px', 
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = '#667eea';
        e.target.style.backgroundColor = '#f8fafc';
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = '#e5e7eb';
        e.target.style.backgroundColor = '#ffffff';
        e.target.style.transform = 'translateY(0px)';
        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{ fontWeight: '600' }}>{label}</div>
      {description && (
        <div style={{ 
          fontSize: '11px', 
          color: '#6b7280', 
          marginTop: '2px',
          fontWeight: '400'
        }}>
          {description}
        </div>
      )}
    </div>
  );
};

export const PipelineToolbar = () => {
  return (
    <div style={{
      width: '260px',
      height: '100%',
      backgroundColor: '#f9fafb',
      padding: '16px', 
      borderRight: '1px solid #e5e7eb',
      overflowY: 'auto',
      flexShrink: 0 
    }}>
      <div style={{
        marginBottom: '20px', 
        paddingBottom: '12px', 
        borderBottom: '2px solid #e5e7eb'
      }}>
        <h2 style={{ 
          color: '#111827',
          fontSize: '18px', 
          fontWeight: '700',
          margin: '0 0 4px 0'
        }}>
          Node Library
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: '12px',
          margin: 0,
          fontWeight: '400'
        }}>
          Drag components to canvas
        </p>
      </div>
      
      {/* Basic Nodes Section */}
      <div style={{ marginBottom: '20px' }}> {/* Reduced margin */}
        <h3 style={{ 
          fontSize: '13px', 
          color: '#374151', 
          marginBottom: '10px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Essential
        </h3>
        <DraggableNode 
          type="customInput" 
          label="Input" 
          description="Data input source"
        />
        <DraggableNode 
          type="llm" 
          label="LLM" 
          description="Language model processing"
        />
        <DraggableNode 
          type="customOutput" 
          label="Output" 
          description="Data output destination"
        />
        <DraggableNode 
          type="text" 
          label="Text" 
          description="Text processing"
        />
      </div>

      {/* Advanced Nodes Section */}
      <div>
        <h3 style={{ 
          fontSize: '13px', 
          color: '#374151', 
          marginBottom: '10px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Advanced
        </h3>
        <DraggableNode 
          type="math" 
          label="Math" 
          description="Mathematical operations"
        />
        <DraggableNode 
          type="filter" 
          label="Filter" 
          description="Data filtering"
        />
        <DraggableNode 
          type="conditional" 
          label="Conditional" 
          description="Logic branching"
        />
        <DraggableNode 
          type="timer" 
          label="Timer" 
          description="Delay operations"
        />
        <DraggableNode 
          type="api" 
          label="API Call" 
          description="External requests"
        />
      </div>
    </div>
  );
};
