import process from 'process';
import readline from 'readline';
import logUpdate from 'log-update';
import { getPrettyPrintableObject, handleGracefulExit } from './helpers/io.js';
import { initialInfra } from './helpers/setup.js';
import { initGameState } from './helpers/gameplay.js';

const mainKeyName = 'space';
const shopButton = 's';
//todo: load this when implementing saving
let gameState = initGameState;

let stdin = process.stdin;
readline.emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf-8');

console.log(`The game is on! Click "${mainKeyName}" to start earning bobux\n`);

let money = 0;
let currKey: string;
let debug: Record<string, any>;
stdin.on('keypress', function (key, a) {
  const { sequence, name, ctrl, meta, shift } = a;
  currKey = name;
  debug = a;

  const ctrlC = '\x03';
  const ctrlX = '\x18';
  const ctrlZ = '\x1A';
  if (name === mainKeyName) {
    money += 1;
  }
  if (name === shopButton) {
    gameState = { ...gameState, mode: 'shop' };
  }

  if (gameState.mode === 'shop') {
    if (name === 'x') gameState = { ...gameState, mode: 'main' };
  }

  if (sequence === ctrlC) {
    handleGracefulExit();
  }
});

setInterval(() => {
  logUpdate(
    `
    Your infra: ${Object.entries(initialInfra).map(
      ([key, value]) => `${key}: ${value.value}`
    )}

    You pressed ${currKey} and you've got ${money} bobux


    To open the shop, click the ${shopButton} button
    ${
      gameState.mode === 'shop' &&
      `
    Here's the things you can buy: 
    ${getPrettyPrintableObject(initialInfra, 'cost')}

    Press 'x' to leave the shop
    `
    }

    ${JSON.stringify(debug)}`
  );
}, 60);
