// apiNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || '');

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-url`,
      style: { top: '25%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-data`,
      style: { top: '75%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`,
      style: { top: '33%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-error`,
      style: { top: '66%' }
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="API Call"
      handles={handles}
      style={{ width: 260, height: 130, backgroundColor: '#f0f8ff' }}
    >
      <label>
        Method:
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
      <label>
        URL:
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com"
          style={{ width: '100%', fontSize: '11px' }}
        />
      </label>
    </BaseNode>
  );
};
