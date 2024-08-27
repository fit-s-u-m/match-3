# Match-3 Game

This is a match-3 puzzle game built with TypeScript and Pixi.js. The objective of the game is to match three or more candies of the same type in a row or column to clear them from the board and score points.

## Features

- **Interactive Grid**: Click and drag candies to swap them with adjacent ones.
- **Matching Mechanism**: Candies only swap positions if the move results in a match.
- **Score and Move**: Displayed on each side of the grid to enhance gameplay.
- **Sound Effects**: Integrated sound effects for interactions using `pixi-sound`.
- **Responsive UI**: Clean and simple user interface, with a play button to start the game.

## Technologies Used

- **TypeScript**: Provides type safety and modern JavaScript features.
- **Pixi.js**: A fast 2D rendering engine used for creating interactive graphics.
- **Bun**: A modern JavaScript runtime used for installation and dependency management.
- **pixi-sound**: A library for adding sound effects to Pixi.js applications.

## Installation

To run this project locally, you need to have [Bun](https://bun.sh/) installed. Follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Qene-Internship/match3.git
    
    cd match3
    ```

2. **Install Dependencies**:
    ```bash
    bun install
    ```

3. **Start the Development Server**:
    ```bash
    bun run dev
    ```


## Usage

- **Play Button**: The button will be visible when the game loads , Click the play button to start the game.  
- **Swapping Candies**: Click and drag a candy to swap it with an adjacent one. If the swap results in a match, the candies will swap; otherwise, they will revert to their original positions.
- **Score**: As you progress, your score will increase.
- **Sound Effects**: Enjoy sound effects triggered by interactions such as swaps and matches.

## Previews

### Title Screen


https://github.com/user-attachments/assets/a0b6c2cf-3cf1-4cd1-9a2a-b140f020e816

### Gameplay and Match Found


https://github.com/user-attachments/assets/48a69c48-f421-48cb-a5e0-b8e9b931a46a

### Gameover


https://github.com/user-attachments/assets/80b75eb9-1bf6-42f4-9377-ffc844679c56


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
