import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, updatePosition } from '../store';
import carImage from '../assets/images/CHQ_Patrol_Car.png';
import cityImage from '../assets/images/city.png';
import { ObstacleCar, generateObstacleCar } from '../components/ObstacleCar';
import obstacleCarImage from '../assets/images/carobstacle.png';

interface GameCanvasProps {
  width: number;
  height: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const playerX = useSelector((state: RootState) => state.playerX);
  const playerY = useSelector((state: RootState) => state.playerY);

  const carWidth = 200;
  const carHeight = 150;
  const [speed, setSpeed] = useState(0);
  const [targetSpeed, setTargetSpeed] = useState(0);
  const [offset, setOffset] = useState(0);
  const [obstacleCars, setObstacleCars] = useState<ObstacleCar[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacleCars(prevCars => [...prevCars, generateObstacleCar(width)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const car = new Image();
    car.src = carImage;

    const cityImg = new Image();
    cityImg.src = cityImage;

    const obstacleCar = new Image();
    obstacleCar.src = obstacleCarImage;

    const render = () => {
      if (!canvas) return;
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner le fond
      context.fillStyle = '#4CAF50';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Dessiner la route en perspective
      drawPerspectiveRoad(context, canvas.width, canvas.height);

      // Dessiner l'horizon avec l'image de la ville
      context.drawImage(cityImg, 0, 0, canvas.width, 100);

      // Ajuster la vitesse
      if (speed < targetSpeed) {
        setSpeed(speed + (targetSpeed / 300));
      } else if (speed > targetSpeed) {
        setSpeed(speed - (targetSpeed / 300));
      }

      // Mettre à jour le décalage
      setOffset(prevOffset => (prevOffset + speed * 0.5) % 20);

      // Mettre à jour et dessiner les voitures obstacles
      const updatedCars = obstacleCars
        .map(car => ({
          ...car,
          y: car.y + car.speed,
        }))
        .filter(car => car.y < height);

      updatedCars.forEach(car => {
        const scale = 1 + (car.y / canvas.height);
        const newWidth = car.width * scale;
        const newHeight = car.height * scale;
        const newX = car.x + (car.width - newWidth) / 2;

        context.drawImage(obstacleCar, newX, car.y, newWidth, newHeight);
      });

      setObstacleCars(updatedCars); // Update state with new positions

      // Dessiner la voiture du joueur
      const carX = playerX + (carWidth / 2) - 75;
      const carY = canvas.height - carHeight - 10;
      context.drawImage(car, carX, carY, carWidth, carHeight);

      // Vérifier les collisions
      updatedCars.forEach(obstacleCar => {
        if (checkCollision(carX, carY, carWidth, carHeight, obstacleCar.x, obstacleCar.y, obstacleCar.width, obstacleCar.height)) {
          console.log("Collision!");
          // Ajoutez ici la logique de fin de jeu ou de perte de vie
        }
      });

      requestAnimationFrame(render);
    };

    car.onload = () => render();
    obstacleCar.onload = () => render(); // Ensure obstacles are rendered when their image loads

    return () => {
      car.onload = null;
      obstacleCar.onload = null;
    };
  }, [playerX, playerY, carWidth, carHeight, speed, targetSpeed, obstacleCars]);

  const drawPerspectiveRoad = (ctx: CanvasRenderingContext2D, canvasWidth: number, _canvasHeight: number) => {
    const topWidth = 200;
    const bottomWidth = 800;
    const height = 500;

    const topX = (canvasWidth - topWidth) / 2;
    const topY = 100;
    const bottomX1 = (canvasWidth - bottomWidth) / 2;
    const bottomX2 = bottomX1 + bottomWidth;
    const bottomY = topY + height;

    const gradient = ctx.createLinearGradient(topX, topY, bottomX1, bottomY);
    gradient.addColorStop(0, '#666');
    gradient.addColorStop(1, '#333');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(bottomX1, bottomY);
    ctx.lineTo(bottomX2, bottomY);
    ctx.lineTo(topX + topWidth, topY);
    ctx.closePath();
    ctx.fill();

    const tileWidth = 20;
    const tileHeight = 10;
    for (let y = topY - offset; y < bottomY; y += tileHeight) {
      const lerp = (y - topY) / (bottomY - topY);
      const x1 = topX + lerp * (bottomX1 - topX);
      const x2 = topX + topWidth + lerp * (bottomX2 - (topX + topWidth));

      ctx.fillStyle = (Math.floor((y + offset) / tileHeight) % 2 === 0) ? 'red' : 'white';
      ctx.fillRect(x1 - tileWidth, y, tileWidth, tileHeight);
      ctx.fillRect(x2, y, tileWidth, tileHeight);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        dispatch(updatePosition(Math.max(playerX - 10, 0), playerY));
        break;
      case 'ArrowRight':
        dispatch(updatePosition(Math.min(playerX + 10, width - carWidth), playerY));
        break;
      case 'ArrowUp':
        setTargetSpeed(100);
        break;
      case 'ArrowDown':
        setTargetSpeed(0);
        break;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      setTargetSpeed(0);
    }
  };

  const checkCollision = (x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) => {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerX, playerY, speed, dispatch]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default GameCanvas;
