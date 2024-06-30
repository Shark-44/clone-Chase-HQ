// ObstacleCar.tsx

export interface ObstacleCar {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export const generateObstacleCar = (_canvasWidth: number): ObstacleCar => {
  const width = 200; // largeurs des voitures obstacles
  const height = 150; // hauteurs des voitures obstacles
  const x = 200 + Math.random() * (800 - 300 - width);
  const y = 100; // Changer ici pour que les voitures commencent à y = 100
  const speed = Math.random() * 2 + 1; // Vitesse aléatoire

  return {
    x,
    y,
    width,
    height,
    speed
  };
};
