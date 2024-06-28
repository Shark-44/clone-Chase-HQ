import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, updatePosition } from '../store';
import carImage from '../assets/images/CHQ_Patrol_Car.png';
import cityImage from '../assets/images/city.png';

interface GameCanvasProps {
  width: number;
  height: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const playerX = useSelector((state: RootState) => state.playerX);
  const playerY = useSelector((state: RootState) => state.playerY);
  
  const [carWidth, setCarWidth] = useState(200);
  const [carHeight, setCarHeight] = useState(150);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Définir le fond du canvas en #4CAF50
    context.fillStyle = '#4CAF50';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const car = new Image();
    car.src = carImage;

    const cityImg = new Image();
    cityImg.src = cityImage;

    car.onload = () => {
      setCarWidth(car.width);
      setCarHeight(car.height);

      const render = () => {
        if (!canvas) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner le fond en #4CAF50
        context.fillStyle = '#4CAF50';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Dessiner la route en perspective
        drawPerspectiveRoad(context, canvas.width, canvas.height);

        // Dessiner l'horizon avec l'image de la ville
        context.drawImage(cityImg, 0, 0, canvas.width, 100);

        // Dessiner la voiture
        const carX = playerX + (carWidth / 2) - 75; // Centre de la voiture
        const carY = canvas.height - carHeight - 10; // Position verticale au-dessus de la route
        context.drawImage(car, carX, carY, carWidth, carHeight);

        requestAnimationFrame(render);
      };

      render();
    };

    return () => {
      car.onload = null;
    };
  }, [playerX, playerY, carWidth, carHeight]);

  const drawPerspectiveRoad = (ctx: CanvasRenderingContext2D, canvasWidth: number, _canvasHeight: number) => {
    // Dimensions de la route en perspective
    const topWidth = 200; // Largeur en haut du trapeze
    const bottomWidth = 800; // Largeur en bas du trapeze
    const height = 500; // Hauteur du trapeze
  
    // Coordonnées du trapeze
    const topX = (canvasWidth - topWidth) / 2;
    const topY = 100;
    const bottomX1 = (canvasWidth - bottomWidth) / 2;
    const bottomX2 = bottomX1 + bottomWidth;
    const bottomY = topY + height;

    // Dégradé de la route (gris foncé)
    const gradient = ctx.createLinearGradient(topX, topY, bottomX1, bottomY);
    gradient.addColorStop(0, '#666'); // Début du dégradé
    gradient.addColorStop(1, '#333'); // Fin du dégradé

    // Dessin du trapeze de la route
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(bottomX1, bottomY);
    ctx.lineTo(bottomX2, bottomY);
    ctx.lineTo(topX + topWidth, topY);
    ctx.closePath();
    ctx.fill();

    // Dessin des bords de la route (vert)
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(bottomX1, bottomY);
    ctx.lineTo(bottomX1, bottomY + 20); // Hauteur des bords
    ctx.lineTo(topX, topY + 20); // Hauteur des bords
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(topX + topWidth, topY);
    ctx.lineTo(bottomX2, bottomY);
    ctx.lineTo(bottomX2, bottomY + 20); // Hauteur des bords
    ctx.lineTo(topX + topWidth, topY + 20); // Hauteur des bords
    ctx.closePath();
    ctx.fill();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        dispatch(updatePosition(Math.max(playerX - 10, 0), playerY));
        break;
      case 'ArrowRight':
        dispatch(updatePosition(Math.min(playerX + 10, width - carWidth), playerY));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerX, playerY, dispatch]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default GameCanvas;
