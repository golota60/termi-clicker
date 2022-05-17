import chalk, { ChalkInstance } from 'chalk';
import { initialAbilities, initialInfra } from './initialValues.js';

//TODO: convert those to funs which load save states when that is implemented
export interface Ability {
  level: number;
  desc: string;
}
export type AbilitiesState = Record<string, Ability>;

export interface Infrastructure {
  level: number;
  desc: string;

  getCost: () => number;
  getMoneyPerSec: () => number;
  getPercentage: () => number;
  getColor: () => ChalkInstance;
  buyKey: number;

  //todo: loadcost, loadmoneypersec?
}
export type InfrastructureState = Record<string, Infrastructure>;

export const bulkModeState = [1, 10, 100] as const;
export type BulkModeType = typeof bulkModeState[number];
export interface GameState {
  version: string | undefined;
  mode: 'main' | 'shop';
  infrastructure: InfrastructureState;
  abilities: AbilitiesState;
  money: number;
  bulkMode: BulkModeType;
}

export const getFreshGameState = (): GameState => ({
  version: process.env.npm_package_version,
  mode: 'main',
  money: 0,
  infrastructure: initialInfra,
  abilities: initialAbilities,
  bulkMode: 1,
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

export const swapBulkMode = () => {
  updateGameState({
    ...gameState,
    bulkMode: getNextState<typeof gameState.bulkMode>(
      gameState.bulkMode,
      bulkModeState
    ),
  });
};

/** ---------------------------- */
/** Simple state machine */
const getNextState = <T>(
  state: T,
  possibleStates: Readonly<Array<T>> | Array<T>
) => {
  const indexOfPrev = possibleStates.indexOf(state);
  const nextItem = possibleStates[indexOfPrev + 1] || possibleStates[0];
  return nextItem;
};
export const renderActiveState = <T>(
  state: T,
  possibleStates: Readonly<Array<T>> | Array<T>,
  options = { activeRenderer: chalk.bgWhite, passiveRenderer: (e: any) => e }
) => {
  const { activeRenderer, passiveRenderer } = options;
  return possibleStates
    .map((e) => (e === state ? activeRenderer(e) : passiveRenderer(e)))
    .join(' ');
};
/** ---------------------------- */
