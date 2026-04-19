export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
};

export const OPPOSITE_DIRECTIONS = {
  up: "down",
  right: "left",
  down: "up",
  left: "right"
};

export function createInitialState(options = {}) {
  const width = options.width ?? 16;
  const height = options.height ?? 16;
  const start = options.start ?? [
    { x: 4, y: 8 },
    { x: 3, y: 8 },
    { x: 2, y: 8 }
  ];
  const direction = options.direction ?? "right";
  const score = 0;
  const food =
    options.food ?? placeFood(start, width, height, options.random ?? Math.random);

  return {
    width,
    height,
    snake: start,
    direction,
    pendingDirection: direction,
    food,
    score,
    isGameOver: false
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection]) {
    return state;
  }

  if (OPPOSITE_DIRECTIONS[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection
  };
}

export function stepGame(state, random = Math.random) {
  if (state.isGameOver) {
    return state;
  }

  const direction = state.pendingDirection;
  const head = state.snake[0];
  const delta = DIRECTIONS[direction];
  const nextHead = {
    x: head.x + delta.x,
    y: head.y + delta.y
  };
  const isEating = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const bodyToCheck = isEating ? state.snake : state.snake.slice(0, -1);
  const hitsWall =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= state.width ||
    nextHead.y >= state.height;
  const hitsSelf = bodyToCheck.some(
    (segment) => segment.x === nextHead.x && segment.y === nextHead.y
  );

  if (hitsWall || hitsSelf) {
    return {
      ...state,
      direction,
      pendingDirection: direction,
      isGameOver: true
    };
  }

  const snake = isEating
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, -1)];

  return {
    ...state,
    snake,
    direction,
    pendingDirection: direction,
    food: isEating ? placeFood(snake, state.width, state.height, random) : state.food,
    score: isEating ? state.score + 1 : state.score
  };
}

export function placeFood(snake, width, height, random = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const openCells = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.floor(random() * openCells.length);
  return openCells[index];
}
