import React from 'react';
import { Handle, Position } from 'reactflow';

const LessonNode = ({ data }) => {
  return (
    <div className="lesson-node">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500/70 border-2 border-blue-400"
      />

      <div className="glassmorphism-card w-56 p-4 rounded-lg border-2 border-blue-500/50 bg-black/30 backdrop-blur-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-blue-400 font-orbitron text-base font-bold mb-2 group-hover:text-blue-300 transition-colors">
              {data.label}
            </h3>
            <p className="text-gray-300 text-xs mb-2">
              {data.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
            {data.duration}
          </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500/70 border-2 border-blue-400"
      />
    </div>
  );
};

export default LessonNode;