// timerNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const TimerNode = ({ id, data }) => {
  const [delay, setDelay] = useState(data?.delay || 1000);
  const [unit, setUnit] = useState(data?.unit || 'ms');

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-trigger`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Timer"
      handles={handles}
      style={{ width: 200, height: 100, backgroundColor: '#fff8dc' }}
    >
      <label>
        Delay:
        <input 
          type="number" 
          value={delay} 
          onChange={(e) => setDelay(e.target.value)}
          style={{ width: '60px' }}
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="ms">ms</option>
          <option value="s">seconds</option>
        </select>
      </label>
    </BaseNode>
  );
};
