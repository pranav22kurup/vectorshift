import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { extractVariables, calculateTextDimensions, getVariableSuggestions } from '../utils/textUtils';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || 'Hello {{name}}! Your order {{orderId}} is ready.');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef(null);

  
  const variables = useMemo(() => extractVariables(currText), [currText]);

  
  const dimensions = useMemo(() => calculateTextDimensions(currText, variables), [currText, variables]);

  
  const handles = useMemo(() => {
    const variableHandles = variables.map((variable, index) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${variable}`,
      style: { 
        top: `${35 + (index * 25)}px`
      }
    }));

    const outputHandle = {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`
    };

    return [...variableHandles, outputHandle];
  }, [variables, id]);

  
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrText(newText);
    
    
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [currText]);

  
  const insertVariable = (variableName) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = currText.slice(0, start) + `{{${variableName}}}` + currText.slice(end);
    setCurrText(newText);
    setShowSuggestions(false);
    
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + variableName.length + 4;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  
  const getHighlightedText = () => {
    const parts = currText.split(/(\{\{[^}]+\}\})/);
    return parts.map((part, index) => {
      if (part.match(/^\{\{[^}]+\}\}$/)) {
        const variable = part.slice(2, -2).trim();
        const isValid = variables.includes(variable);
        return (
          <span
            key={index}
            style={{
              backgroundColor: isValid ? '#dcfce7' : '#fef3c7',
              color: isValid ? '#059669' : '#d97706',
              padding: '1px 3px',
              borderRadius: '3px',
              fontWeight: '600',
              fontSize: '11px'
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      handles={handles}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        transition: 'width 0.3s ease, height 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Variables Status */}
        {variables.length > 0 && (
          <div style={{
            fontSize: '11px',
            padding: '6px 8px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            color: '#065f46'
          }}>
            <strong>Variables ({variables.length}):</strong>{' '}
            {variables.map((variable, index) => (
              <span key={variable}>
                <code style={{ 
                  backgroundColor: '#dcfce7', 
                  padding: '1px 4px', 
                  borderRadius: '3px',
                  fontSize: '10px'
                }}>
                  {variable}
                </code>
                {index < variables.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}

        {/* Text Input */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            placeholder="Enter text with variables like {{name}} or {{input}}..."
            style={{
              width: '100%',
              minHeight: '60px',
              maxHeight: '200px',
              padding: '10px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: 'inherit',
              backgroundColor: '#ffffff',
              resize: 'none',
              lineHeight: '1.4',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
            }}
          />

          {/* Variable Suggestions Button */}
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            + Var
          </button>

          {/* Variable Suggestions Dropdown */}
          {showSuggestions && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              minWidth: '120px',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {getVariableSuggestions().map(suggestion => (
                <div
                  key={suggestion}
                  onClick={() => insertVariable(suggestion)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6',
                    fontFamily: 'monospace'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Text Preview */}
        <div style={{
          padding: '8px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: '1.3',
          minHeight: '30px'
        }}>
          <div style={{ color: '#6b7280', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>
            Preview:
          </div>
          <div style={{ fontFamily: 'inherit' }}>
            {getHighlightedText()}
          </div>
        </div>

        {/* Statistics Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '10px',
          color: '#9ca3af',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '6px'
        }}>
          <span>Lines: {currText.split('\n').length}</span>
          <span>Vars: {variables.length}</span>
          <span>Chars: {currText.length}</span>
        </div>
      </div>
    </BaseNode>
  );
};
