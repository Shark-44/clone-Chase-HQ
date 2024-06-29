// ObstacleCar.tsx
import React from 'react';
import carImage from '../assets/images/carobstacle.png'; // Utilisez une image différente si vous le souhaitez

export type ObstacleCar = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

interface ObstacleCarProps {
  car: ObstacleCar;
  canvasHeight: number;
}

export const ObstacleCarComponent: React.FC<ObstacleCarProps> = ({ car, canvasHeight }) => {
  const scale = 1 + (car.y / canvasHeight);
  const newWidth = car.width * scale;
  const newHeight = car.height * scale;
  const newX = car.x + (car.width - newWidth) / 2;

  return (
    <img
      src={carImage}
      style={{
        position: 'absolute',
        left: `${newX}px`,
        top: `${car.y}px`,
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      }}
    />
  );
};

export const generateObstacleCar = (width: number): ObstacleCar => ({
  id: Math.random(),
  x: Math.random() * (width - 100),
  y: -100,
  width: 100,
  height: 75,
  speed: Math.random() * 2 + 1,
});