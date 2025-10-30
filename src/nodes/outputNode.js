import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || 'output');
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-value`
    }
  ];

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8fafc'
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      handles={handles}
      gradient="linear-gradient(45deg, #f093fb, #f5576c)"
    >
      <div>
        <input 
          type="text" 
          value={currName} 
          onChange={(e) => setCurrName(e.target.value)}
          placeholder="Output name"
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#f5576c';
            e.target.style.boxShadow = '0 0 0 3px rgba(245, 87, 108, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
        <select 
          value={outputType} 
          onChange={(e) => setOutputType(e.target.value)}
          style={{...inputStyle, marginBottom: '0'}}
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
