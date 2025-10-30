// conditionalNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-true`,
      style: { top: '30%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-false`,
      style: { top: '70%' }
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Conditional"
      handles={handles}
      style={{ width: 250, height: 120 }}
    >
      <label>
        Condition:
        <input 
          type="text" 
          value={condition} 
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g., value > 10"
        />
      </label>
      <div style={{ fontSize: '12px', color: '#666' }}>
        <div>✓ True → Top output</div>
        <div>✗ False → Bottom output</div>
      </div>
    </BaseNode>
  );
};
