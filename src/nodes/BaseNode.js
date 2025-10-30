import React from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({ 
  id, 
  data,
  title,
  children,
  handles = [],
  style = {},
  className = ''
}) => {
  const defaultStyle = {
    width: 220,
    minHeight: 90,
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    position: 'relative',
    ...style
  };

  const headerStyle = {
    fontWeight: '700',
    fontSize: '14px',
    marginBottom: '12px',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div 
      style={defaultStyle} 
      className={className}
      onMouseEnter={(e) => {
        e.target.style.borderColor = '#667eea';
        e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = '#e5e7eb';
        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Target handles with variable labels */}
      {handles.filter(h => h.type === 'target').map((handle, index) => {
        
        const variableName = handle.id.split('-').pop();
        const isVariable = variableName && variableName !== 'value' && variableName !== 'input';
        
        return (
          <React.Fragment key={handle.id}>
            <Handle
              type="target"
              position={handle.position || Position.Left}
              id={handle.id}
              style={{
                width: '14px',
                height: '14px',
                border: '3px solid #ffffff',
                background: isVariable ? '#10b981' : '#667eea',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                ...handle.style
              }}
            />
            {/* Variable label */}
            {isVariable && (
              <div
                style={{
                  position: 'absolute',
                  left: '-8px',
                  top: `calc(${handle.style?.top || '0px'} + 18px)`,
                  transform: 'translateX(-100%)',
                  fontSize: '10px',
                  color: '#6b7280',
                  backgroundColor: '#f9fafb',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb',
                  fontFamily: 'monospace',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  zIndex: 10
                }}
              >
                {variableName}
              </div>
            )}
          </React.Fragment>
        );
      })}
      
      <div style={headerStyle}>
        {title}
      </div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      
      {/* Source handles */}
      {handles.filter(h => h.type === 'source').map((handle) => (
        <Handle
          key={handle.id}
          type="source"
          position={handle.position || Position.Right}
          id={handle.id}
          style={{
            width: '14px',
            height: '14px',
            border: '3px solid #ffffff',
            background: '#667eea',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            ...handle.style
          }}
        />
      ))}
    </div>
  );
};
