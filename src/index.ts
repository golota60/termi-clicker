#!/usr/bin/env node

import process from 'process';
import readline from 'readline';
import logUpdate from 'log-update';
import chalk from 'chalk';
import {
  equalizeStringArray,
  getTabledInfra,
  handleGracefulExit,
  Message,
  renderMessage,
  wrapInBorder,
} from './helpers/io.js';
import { initialInfra } from './helpers/initialValues.js';
import {
  gameState,
  updateGameState,
  setupGame,
  calcMoneyPerSec,
  renderActiveState,
  bulkModeState,
  swapBulkMode,
  getNextUpgrade,
  buyUpgrade,
} from './helpers/gameplay.js';
import { createDirAndSaveGame } from './helpers/save.js';

const mainKeyName = 'space';
(async () => {
  // this has to be done before effin with stdin
  await setupGame();

  let stdin = process.stdin;
  readline.emitKeypressEvents(stdin);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf-8');

  let currKey: string;
  // let debug: Record<string, any>;

  let message: Message | undefined;
  stdin.on('keypress', function (key, a) {
    const { sequence, name } = a;
    if (name !== 't')
      updateGameState({ ...gameState, nOfActions: gameState.nOfActions + 1 });

    // after each action reset the message
    message = undefined;
    currKey = name;

    const ctrlC = '\x03';
    // const ctrlX = '\x18';
    // const ctrlZ = '\x1A';

    if (name === 'v') {
      buyUpgrade();
    }

    if (name === 't') {
      swapBulkMode();
    }
    if (name === mainKeyName) {
      updateGameState({
        ...gameState,
        money: gameState.money + 1 * gameState.clickPower,
      });
    }
    // if (name === shopButton) {
    //   updateGameState({ ...gameState, mode: 'shop' });
    // }

    // if (gameState.mode === 'shop') {
    // if (name === 'x') updateGameState({ ...gameState, mode: 'main' });

    Object.entries(gameState.infrastructure).forEach(([key, val]) => {
      if (name === String(val.buyKey)) {
        const cost = val.getCost(gameState);
        if (gameState.money < cost) {
          message = {
            type: 'danger',
            content: "You don't have enough money to buy that!",
          };
        } else {
          updateGameState({
            ...gameState,
            infrastructure: {
              ...gameState.infrastructure,
              [key]: {
                ...gameState.infrastructure[key],
                level:
                  gameState.infrastructure[key].level + 1 * gameState.bulkMode,
              },
            },
            money: gameState.money - cost,
          });
        }
      }
    });

    if (sequence === ctrlC) {
      handleGracefulExit();
    }
  });

  const frames = ['-', '\\', '|', '/'];
  let index = 0;

  //save game each 60sec
  setInterval(async () => {
    await createDirAndSaveGame();
  }, 10000);

  setInterval(() => {
    const moneyPerSec = calcMoneyPerSec();
    updateGameState({ ...gameState, money: gameState.money + moneyPerSec });
  }, 1000);

  // output loop
  setInterval(() => {
    const frame = frames[(index = ++index % frames.length)];
    index > frames.length && (index = 0); //so that index doesn't get out of hand

    const nextUpgrade = getNextUpgrade();
    const firstRow = `The game is on! Click '${mainKeyName}' to earn money
  Your infrastructure:
  ${getTabledInfra(gameState.infrastructure, [
    ['getCost', 'Price'],
    ['buyKey', 'Upgrade key'],
    ['getMoneyPerSec', '$ per sec'],
    ['getPercentage', '% of all income'],
    ['level', 'Level'],
  ])}

  Next upgrade: ${
    `${chalk.yellow(nextUpgrade.name)} - ${
      nextUpgrade.price > gameState.money
        ? chalk.red(`$${nextUpgrade.price}`)
        : chalk.green(`$${nextUpgrade.price}`)
    } - click 'v' to buy` || 'No upgrades left :('
  }
  `;

    const statusRow = `
  Money: ${gameState.money}
  Money per second: ${calcMoneyPerSec()}
  Last key: ${currKey}
  Click power: ${gameState.clickPower}
  Number of actions in this run: ${gameState.nOfActions}
  Current buying amount(click 't' to switch): ${renderActiveState(
    gameState.bulkMode,
    bulkModeState
  )}
`;

    logUpdate(
      wrapInBorder(`
  ${equalizeStringArray(firstRow, {
    endLineOffset: 1,
  }).join('\n')}
    ${equalizeStringArray(statusRow, {
      endLineOffset: 1,
    }).join('\n')}`),
      message ? renderMessage(message) : ''
    );
  }, 60);
})();
