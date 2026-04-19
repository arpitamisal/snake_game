# Classic Snake

A lightweight, browser-based version of the classic Snake game. Move around the grid, eat food to grow, avoid the walls, and do not run into yourself.

This project is intentionally small: it uses plain HTML, CSS, and JavaScript with no external dependencies. The core game rules live in a separate module so they can be tested independently from the UI.

<img width="1470" height="805" alt="Screenshot 2026-04-18 at 6 07 12 PM" src="https://github.com/user-attachments/assets/a9645713-2b6c-46f3-842b-0851f4c4fd77" />

## Features

- Classic grid-based Snake movement
- Food spawning that avoids the snake body
- Score and best score tracking
- Wall and self-collision game over states
- Restart and pause/resume controls
- Keyboard controls with arrow keys or WASD
- Simple on-screen controls for smaller screens
- Node built-in tests for the core game logic

## Getting Started

Make sure you have Node.js installed, then run:

```bash
npm run dev
```

Open the game in your browser:

```text
http://localhost:3000
```

## Controls

- Move up: `ArrowUp` or `W`
- Move right: `ArrowRight` or `D`
- Move down: `ArrowDown` or `S`
- Move left: `ArrowLeft` or `A`
- Pause or resume: `Space`
- Restart after game over: `Enter` or the `Restart` button

## Testing

Run the logic tests with:

```bash
npm test
```

The tests cover movement, growth, collision handling, direction rules, and food placement.

## Project Structure

```text
.
├── index.html
├── package.json
├── server.js
├── src
│   ├── main.js
│   ├── snakeLogic.js
│   └── styles.css
└── test
    └── snakeLogic.test.js
```

## Manual Verification Checklist

- The snake moves with arrow keys and WASD.
- The snake grows after eating food.
- The score increases by one for each food item eaten.
- Food never appears on top of the snake.
- Hitting a wall ends the game.
- Running into the snake body ends the game.
- Pause/resume stops and restarts movement.
- Restart resets the score and starts a new game.
- On-screen controls are usable on small screens.
