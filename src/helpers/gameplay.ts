import {
  AbilitiesState,
  InfrastructureState,
  initialAbilities,
  initialInfra,
} from './setup.js';

export interface GameState {
  version: string | undefined;
  mode: 'main' | 'shop';
  infrastructure: InfrastructureState;
  abilities: AbilitiesState;
  money: number;
}
export interface GameStateNullable {
  version?: string | undefined;
  mode?: 'main' | 'shop';
  infrastructure?: InfrastructureState;
  abilities?: AbilitiesState;
  money?: number;
}

export const getFreshGameState = (): GameState => ({
  version: process.env.npm_package_version,
  mode: 'main',
  money: 0,
  infrastructure: initialInfra,
  abilities: initialAbilities,
});

// export const getGameState = (): GameStateSingleton =>
//   GameStateSingleton.getInstance();

// export const updateGameState = (
//   newGameState: GameStateNullable
// ): GameStateSingleton => {
//   let gameState = GameStateSingleton.getInstance();
//   gameState.mutate(newGameState);
//   return gameState;
// };

// export const updateGameStateField = (
//   gameState: GameState,
//   field: keyof GameState,
//   newValue: GameState[keyof GameState]
// ) => ({ ...gameState, [field]: newValue });
