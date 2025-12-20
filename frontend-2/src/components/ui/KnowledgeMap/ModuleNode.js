import React from 'react';
import { Handle, Position } from 'reactflow';

const ModuleNode = ({ data }) => {
  return (
    <div className="module-node">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-cyan-500/70 border-2 border-cyan-400"
      />

      <div className="glassmorphism-card w-64 p-4 rounded-xl border-2 border-cyan-500/50 bg-black/30 backdrop-blur-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-cyan-400 font-orbitron text-lg font-bold mb-2 group-hover:text-cyan-300 transition-colors">
              {data.label}
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              {data.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">
            {data.connections || 0} connections
          </span>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-cyan-500/70 border-2 border-cyan-400"
      />
    </div>
  );
};

export default ModuleNode;