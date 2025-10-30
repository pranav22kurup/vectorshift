import React from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-system`,
      style: { top: '30%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: '70%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      handles={handles}
      
      gradient="linear-gradient(45deg, #4facfe, #00f2fe)"
    >
      <div style={{ 
        textAlign: 'center', 
        color: '#4a5568',
        fontSize: '13px',
        fontWeight: '500',
        padding: '12px 0'
      }}>
        <div style={{ marginBottom: '4px' }}>AI Language Model</div>
        <div style={{ fontSize: '11px', color: '#a0aec0' }}>GPT-powered processing</div>
      </div>
    </BaseNode>
  );
};
