// filterNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`
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
      title="Filter"
      handles={handles}
      style={{ width: 240, height: 110 }}
    >
      <label>
        Condition:
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
        </select>
      </label>
      <label>
        Value:
        <input 
          type="text" 
          value={filterValue} 
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Filter value"
        />
      </label>
    </BaseNode>
  );
};
