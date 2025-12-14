export const PUZZLE_IMAGES = [
  '/puzzle-images/puzzle-default.jpeg',
];

export function getRandomPuzzleImage(): string {
  const randomIndex = Math.floor(Math.random() * PUZZLE_IMAGES.length);
  return PUZZLE_IMAGES[randomIndex];
}

export function getAllPuzzleImages(): string[] {
  return [...PUZZLE_IMAGES];
}

export function getPuzzleImageCount(): number {
  return PUZZLE_IMAGES.length;
} 