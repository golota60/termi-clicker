interface GameState {
  mode: 'main' | 'shop';
}

export const initGameState: GameState = {
  mode: 'main',
};

const changeGameState = (gameState: GameState) => {};
