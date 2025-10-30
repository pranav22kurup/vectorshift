import React from 'react';
import { PipelineUI } from './ui';
import { PipelineToolbar } from './toolbar';
import { SubmitButton } from './submit';

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f3f4f6',
      overflow: 'hidden' 
    }}>
      {/* Header */}
      <div style={{
        height: '60px', 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        flexShrink: 0 
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '22px', 
          fontWeight: '700',
          color: '#111827'
        }}>
          VectorShift Pipeline Builder
        </h1>
      </div>

      {/* Main content area */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        minHeight: 0 
      }}>
        <PipelineToolbar />
        <PipelineUI />
      </div>
      
      {/* Footer with submit button */}
      <div style={{ 
        height: '70px', 
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.1)',
        flexShrink: 0 
      }}>
        <SubmitButton />
      </div>
    </div>
  );
}

export default App;
