import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || 'input');
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  const handles = [
    {
      type: 'source',
      position: Position.Right,
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

  const selectStyle = {
    ...inputStyle,
    marginBottom: '0'
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      handles={handles}
      gradient="linear-gradient(45deg, #667eea, #764ba2)"
    >
      <div>
        <input 
          type="text" 
          value={currName} 
          onChange={(e) => setCurrName(e.target.value)}
          placeholder="Input name"
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
        <select 
          value={inputType} 
          onChange={(e) => setInputType(e.target.value)}
          style={selectStyle}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};
