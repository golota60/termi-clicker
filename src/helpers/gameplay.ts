import chalk from 'chalk';
import { initialInfra, upgradesInOrder } from './initialValues.js';
import { createDirAndSaveGame, initGame, loadGame } from './save.js';

//TODO: convert those to funs which load save states when that is implemented
export interface Upgrade {
  level: number;
  desc: string;
}
export type UpgradesState = Record<string, Upgrade>;

export interface Infrastructure {
  level: number;
  desc: string;

  getCost: (gs: GameState) => number;
  getMoneyPerSec: (gs: GameState) => number;
  getPercentage: (
    gs: GameState,
    // This mirrors genericGetPercentage
    getPercentageFunc: (base: Infrastructure) => any
  ) => number;
  getColor: (
    gs: GameState,
    // This mirrors genericGetColor
    getGenericColor: (base: Infrastructure) => any
  ) => any;
  alias: string; // How the value should be displayed
  buyKey: number;
  multiplier: number;

  //todo: loadcost, loadmoneypersec?
}
export type InfrastructureState = Record<string, Infrastructure>;

export const bulkModeState = [1, 10, 100] as const;
export type BulkModeType = typeof bulkModeState[number];

// All the new values should be able to handle `undefined` so that they are backwards compatible
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
  prestiges: number | undefined;
  updatedVersion: string | undefined;
}

export const getFreshGameState = (name: string): GameState => ({
  name,
  version: process.env.npm_package_version,
  mode: 'main', // this is not used for now; it was meant to display different parts of ui e.g shops/help screen
  money: 0,
  infrastructure: initialInfra,
  bulkMode: 1,
  clickPower: 1,
  moneyPerSecUpgrade: 1,
  upgradesBought: [],
  nOfActions: 0,
  // later added values - keep those compatible with prev versions - otherwise notify that you're creating a breaking change
  prestiges: 0,
  updatedVersion: process.env.npm_package_version,
});

// This can't be a getter cause we need the exact reference
export let gameState: GameState;

export const updateGameState = (newGameState: GameState): GameState => {
  gameState = newGameState;
  return gameState;
};

export const setupGame = async () => {
  const gm = await initGame();
  gameState = gm.game;
  // save game right after creating it, so that if it's played for less than 10s, profile persists
  if (!gm.loaded) await createDirAndSaveGame();
  if (gm.loaded) {
    const loaded = await loadGame(gm.game.name);
    gameState = {
      ...loaded,
      // bump up updated save version and backfill potenitally undefined values, so that they are more compatible with next versions
      updatedVersion: process.env.npm_package_version,
      prestiges: loaded.prestiges || 0,
    };
  }
};

export const calcMoneyPerSec = () => {
  const moneyPerSecForEachInfra = Object.values(gameState.infrastructure).map(
    (val) => val.getMoneyPerSec(gameState)
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

export const isPrestigeAvailable = () => {
  // assumption - player should have all the upgrades to be qualified for prestige
  const next = getNextUpgrade();
  return !next;
};

// todo: give player something long lasting between prestiges
// todo: open question: should we store prestige stats? could be cool to display later
export const commitPrestige = () => {
  updateGameState({
    ...gameState,
    prestiges: gameState.prestiges! + 1, // prestige should exist at this point since we backfill prev version values on load
    clickPower: gameState.prestiges! + 2, // temporary prestige reward - todo: we don't even notify player of this which is ass - need to do that as a part of "help" feature// prestige should exist at this point since we backfill prev version values on load
    // restart errything
    infrastructure: initialInfra,
    upgradesBought: [],
    moneyPerSecUpgrade: 1,
    money: 0,
  });
};
