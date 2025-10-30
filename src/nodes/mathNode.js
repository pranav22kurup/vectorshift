import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'add');

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-a`,
      style: { top: '30%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-b`,
      style: { top: '70%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-result`
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Math"
      handles={handles}
      icon="🔢"
      gradient="linear-gradient(45deg, #fa709a, #fee140)"
      style={{ width: 240, minHeight: 110 }}
    >
      <div>
        <select 
          value={operation} 
          onChange={(e) => setOperation(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s ease'
          }}
        >
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (-)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
        </select>
        <div style={{ 
          marginTop: '8px', 
          fontSize: '11px', 
          color: '#a0aec0', 
          textAlign: 'center' 
        }}>
          Mathematical Operations
        </div>
      </div>
    </BaseNode>
  );
};
