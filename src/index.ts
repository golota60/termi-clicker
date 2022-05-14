import process from 'process';
import readline from 'readline';
import logUpdate from 'log-update';
import { handleGracefulExit } from './helpers/input';

console.log('app ready');
let stdin = process.stdin;
readline.emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdin.resume();
// stdin.setEncoding('utf-8');

stdin.on('keypress', function (key, a) {
  const { sequence, name, ctrl, meta, shift } = a;

  const ctrlC = '\x03';
  const ctrlX = '\x18';
  const ctrlZ = '\x1A';

  if (sequence === ctrlC) {
    handleGracefulExit();
  }

  console.log(key, a);
});

const frames = ['-', '\\', '|', '/'];
let index = 0;

setInterval(() => {
  const frame = frames[(index = ++index % frames.length)];

  logUpdate(
    `
        ♥♥
   ${frame} unicorns ${frame}
        ♥♥
`
  );
}, 16);
