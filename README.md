# Laberinto Interactivo



## 🌐 Web Version (Recommended!)

The easiest way to play is using the web version:

1. Open `index.html` in your web browser (Chrome, Firefox, Edge, etc.)
2. Start playing immediately - no installation needed!

**Controls:**
- WASD or Arrow Keys to move
- SPACE to interact with stations
- Touch controls on mobile (directional pad + action button)
- Enter opens the response when question dialog is active
- ESC closes dialogs

**Custom board image (optional):**
- Put your board image at `assets/maze-board.png`
- Recommended size: 1000x700
- The game will use it automatically as the maze background
- If the file is missing, it falls back to the generated board style

That's it! Just double-click `index.html` to play.

---

## 🐍 Python Desktop Version

An interactive labyrinth game built with Python and Pygame where players navigate through a maze and interact with stations that present questions.

## Features

- **Player Navigation**: Move through the maze using WASD or arrow keys
- **Interactive Stations**: Two types of stations:
  - **Buttons** (Yellow/Green): Answer questions to activate them
  - **Doors** (Red/Green): Answer questions to unlock them
- **Question System**: Each station has a unique question that must be answered correctly
- **Win Condition**: Complete all stations to win the game

## Installation

1. Make sure you have Python 3.7+ installed
2. Install Pygame:
```bash
pip install pygame
```

## How to Run

```bash
cd Laberinto_Interactivo
python main.py
```

## Controls

- **WASD** or **Arrow Keys**: Move the player
- **SPACE**: Interact with a station (when near one)
- **Type answer + ENTER**: Submit your answer
- **ESC**: Cancel/close question dialog

## Game Elements

- **Blue Circle**: Player character
- **Gray Rectangles**: Walls (impassable)
- **Yellow Squares (B)**: Button stations
- **Red Squares (D)**: Door stations
- **Green**: Activated/completed stations

## Customization

You can customize the game by editing `main.py`:

- **Add more stations**: Edit the `create_stations()` method
- **Modify the maze**: Edit the `create_maze()` method
- **Change questions**: Modify the Station objects with your own questions and answers
- **Adjust difficulty**: Change player speed, maze complexity, or question difficulty

## Example Questions

The default game includes sample questions like:
- Math problems
- Geography questions
- General knowledge

Feel free to replace these with your own questions!

## Future Enhancements

- Multiple levels
- Timer/scoring system
- Sound effects
- More station types
- Save/load progress
- Maze generation algorithm

## License

Free to use and modify for educational purposes.
