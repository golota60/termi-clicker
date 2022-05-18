import process from 'process';
import readline from 'readline';
import logUpdate from 'log-update';
import {
  equalizeStringArray,
  getTabledInfra,
  handleGracefulExit,
  joinColumns,
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
import chalk from 'chalk';

const mainKeyName = 'space';
const shopButton = 's';

//todo: load this when implementing saving
setupGame();

let stdin = process.stdin;
readline.emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf-8');

console.log(`The game is on! Click "${mainKeyName}" to start earning bobux\n`);

let currKey: string;
// let debug: Record<string, any>;

let message: Message | undefined;
stdin.on('keypress', function (key, a) {
  // after each action reset the message
  message = undefined;
  const { sequence, name } = a;
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

  Object.entries(initialInfra).forEach(([key, val]) => {
    if (name === String(val.buyKey)) {
      const cost = val.getCost();
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

// min first col width
const firstColWidth = new Array(60).fill(' ').join('');

setInterval(() => {
  const moneyPerSec = calcMoneyPerSec();
  updateGameState({ ...gameState, money: gameState.money + moneyPerSec });
}, 1000);

// output loop
setInterval(() => {
  const frame = frames[(index = ++index % frames.length)];
  index > frames.length && (index = 0); //so that index doesn't get out of hand

  const nextUpgrade = getNextUpgrade();
  const firstRow = `${firstColWidth}

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

  ${
    gameState.mode === 'main' &&
    `To open the shop, click the ${shopButton} button`
  }

  `;

  const statusRow = `
  Money: ${gameState.money}
  Money per second: ${calcMoneyPerSec()}
  Last key: ${currKey}
  Click power: ${gameState.clickPower}
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
