import logUpdate from 'log-update';
import { handleGracefulExit } from './helpers/input.js';
console.log('app ready');

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
}, 80);
handleGracefulExit();
