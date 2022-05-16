import { initialAbilities, initialInfra } from './setup.js';

//TODO: convert those to funs which load save states when that is implemented
export interface Ability {
  level: number;
  desc: string;
}
export type AbilitiesState = Record<string, Ability>;

export interface Infrastructure {
  level: number;
  desc: string;

  getCostForLevel: () => number;
  getMoneyPerSec: () => number;
  getPercentage: () => number;
  buyKey: number;

  //todo: loadcost, loadmoneypersec?
}
export type InfrastructureState = Record<string, Infrastructure>;
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

// This can't be a getter cause we need the exact reference
export let gameState: GameState;

export const updateGameState = (newGameState: GameState): GameState => {
  gameState = newGameState;
  return gameState;
};

export const setupGame = () => {
  gameState = getFreshGameState();
};

export const calcMoneyPerSec = () => {
  const moneyPerSecForEachInfra = Object.values(gameState.infrastructure).map(
    (val) => val.getMoneyPerSec()
  );
  const sum = moneyPerSecForEachInfra.reduce((acc, elem) => acc + elem, 0);
  return Math.floor(sum);
};

// export const updateGameStateField = (
//   gameState: GameState,
//   field: keyof GameState,
//   newValue: GameState[keyof GameState]
// ) => ({ ...gameState, [field]: newValue });
