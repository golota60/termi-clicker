import chalk, { ChalkInstance } from 'chalk';
import { initialInfra, upgradesInOrder } from './initialValues.js';
import { createDirAndSaveGame, initGame } from './save.js';

//TODO: convert those to funs which load save states when that is implemented
export interface Upgrade {
  level: number;
  desc: string;
}
export type UpgradesState = Record<string, Upgrade>;

export interface Infrastructure {
  level: number;
  desc: string;

  getCost: () => number;
  getMoneyPerSec: () => number;
  getPercentage: () => number;
  getColor: () => ChalkInstance;
  alias: string; // How the value should be displayed
  buyKey: number;
  multiplier: number;

  //todo: loadcost, loadmoneypersec?
}
export type InfrastructureState = Record<string, Infrastructure>;

export const bulkModeState = [1, 10, 100] as const;
export type BulkModeType = typeof bulkModeState[number];
export interface GameState {
  name: string;
  version: string | undefined;
  mode: 'main' | 'shop';
  infrastructure: InfrastructureState;
  money: number;
  bulkMode: BulkModeType;
  clickPower: number;
  moneyPerSecUpgrade: number;
  upgradesBought: Array<any>;
  nOfActions: number;
}

export const getFreshGameState = (name: string): GameState => ({
  name,
  version: process.env.npm_package_version,
  mode: 'main',
  money: 0,
  infrastructure: initialInfra,
  bulkMode: 1,
  clickPower: 1,
  moneyPerSecUpgrade: 1,
  upgradesBought: [],
  nOfActions: 0,
});

// This can't be a getter cause we need the exact reference
export let gameState: GameState;

export const updateGameState = (newGameState: GameState): GameState => {
  gameState = newGameState;
  return gameState;
};

export const setupGame = async () => {
  gameState = await initGame();
  await createDirAndSaveGame();
};

export const calcMoneyPerSec = () => {
  const moneyPerSecForEachInfra = Object.values(gameState.infrastructure).map(
    (val) => val.getMoneyPerSec()
  );
  const sum = moneyPerSecForEachInfra.reduce((acc, elem) => acc + elem, 0);
  return Math.floor(sum);
};

export const getNextUpgrade = () => {
  return upgradesInOrder?.[gameState.upgradesBought.length] || undefined;
};
export const buyUpgrade = () => {
  const next = getNextUpgrade();
  if (next) {
    updateGameState({
      ...gameState,
      upgradesBought: [...gameState.upgradesBought, next],
      money: gameState.money - next.price,
    });
    next.action();
  }
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
