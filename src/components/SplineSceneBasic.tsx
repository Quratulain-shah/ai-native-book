import React, { useEffect, useState } from 'react';

const SplineSceneBasic = () => {
  const [SplineComponent, setSplineComponent] = useState(null);

  useEffect(() => {
    // Dynamically import Spline to avoid SSR issues
    import('@splinetool/react-spline').then((module) => {
      setSplineComponent(() => module.Spline);
    });
  }, []);

  // This is a placeholder component that loads a basic Spline scene
  // You can replace the scene URL with your actual Spline project
  return (
    <div style={{ width: '100%', height: '500px' }}>
      {SplineComponent ? (
        <SplineComponent scene="https://prod.spline.design/5WwoaVRuumvJQ5ZH/scene.splinecode" />
      ) : (
        <div>Loading 3D scene...</div>
      )}
    </div>
  );
};

export default SplineSceneBasic;