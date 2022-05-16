import process from 'process';
import readline from 'readline';
import logUpdate from 'log-update';
import {
  equalizeStringArray,
  getTabledObject,
  handleGracefulExit,
  joinColumns,
  Message,
  renderMessage,
  wrapInBorder,
} from './helpers/io.js';
import { initialInfra } from './helpers/setup.js';
import {
  gameState,
  updateGameState,
  setupGame,
  calcMoneyPerSec,
} from './helpers/gameplay.js';

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

  if (name === mainKeyName) {
    updateGameState({ ...gameState, money: gameState.money + 1 });
  }
  if (name === shopButton) {
    updateGameState({ ...gameState, mode: 'shop' });
  }

  if (gameState.mode === 'shop') {
    if (name === 'x') updateGameState({ ...gameState, mode: 'main' });

    Object.entries(initialInfra).forEach(([key, val]) => {
      if (name === String(val.buyKey)) {
        const cost = val.getCostForLevel();
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
                level: gameState.infrastructure[key].level + 1,
              },
            },
            money: gameState.money - cost,
          });
        }
      }
    });
  }

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

  const firstColumn = `${firstColWidth}
  ${frame}

  Your infrastructure: 
  ${getTabledObject(gameState.infrastructure, ['level'])}

  ${
    gameState.mode === 'main' &&
    `To open the shop, click the ${shopButton} button`
  }


  ${frame}
  `;

  const statusColumn = `
  Money: ${gameState.money}
  Money per second: ${calcMoneyPerSec()}
  Last key: ${currKey}
`;

  const secondColumn = `${
    gameState.mode === 'shop' &&
    `
  Here's the things you can buy:
  ${getTabledObject(gameState.infrastructure, [
    'getCostForLevel',
    'getMoneyPerSec',
    'level',
    'buyKey',
  ])}

  Press 'x' to leave the shop
  `
  }

  `;

  logUpdate(
    wrapInBorder(
      joinColumns(
        equalizeStringArray(firstColumn, {
          endLineOffset: 1,
          endSign: '#',
        }).join('\n'),
        equalizeStringArray(statusColumn, {
          endLineOffset: 1,
        }).join('\n'),
        equalizeStringArray(secondColumn, {
          endLineOffset: 1,
        }).join('\n')
      )
    ),
    message ? renderMessage(message) : ''
  );
}, 60);
