// Text processing utilities for the Text Node

export const isValidVariableName = (name) => {
  const validVariableRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  
  const reservedKeywords = [
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
    'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally',
    'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null',
    'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof',
    'var', 'void', 'while', 'with', 'yield'
  ];
  
  return validVariableRegex.test(name) && !reservedKeywords.includes(name);
};


export const extractVariables = (text) => {
  const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const variables = [];
  let match;
  
  while ((match = variableRegex.exec(text)) !== null) {
    const variableName = match[1].trim();
    if (isValidVariableName(variableName) && !variables.includes(variableName)) {
      variables.push(variableName);
    }
  }
  
  return variables;
};


export const calculateTextDimensions = (text, variables = []) => {
  const minWidth = 220;
  const maxWidth = 500;
  const minHeight = 120;
  
  const lines = text.split('\n');
  const maxLineLength = Math.max(...lines.map(line => line.length), 20);
  const dynamicWidth = Math.max(minWidth, Math.min(maxWidth, minWidth + maxLineLength * 6));
  
  const lineCount = Math.max(lines.length, 3);
  const baseHeight = minHeight + (lineCount - 3) * 20;
  const variableSpace = variables.length * 12; 
  const previewSpace = 40; 
  
  return {
    width: Math.round(dynamicWidth),
    height: Math.round(baseHeight + variableSpace + previewSpace)
  };
};

export const replaceVariables = (text, variableValues = {}) => {
  return text.replace(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g, (match, variableName) => {
    return variableValues[variableName] || match;
  });
};


export const getVariableSuggestions = () => {
  return [
    'name', 'input', 'output', 'data', 'text', 'content', 'message',
    'user', 'id', 'value', 'result', 'response', 'query', 'prompt',
    'title', 'description', 'summary', 'url', 'path', 'filename'
  ];
};
