console.log('app ready');

// let stdin = process.stdin;
// readline.emitKeypressEvents(stdin);
// stdin.setRawMode(true);
// stdin.resume();
// stdin.setEncoding('utf-8');

// stdin.on('keypress', function (key, a) {
//   const { sequence, name } = a;
//   // ctrl-c ( end of text )
//   const ctrlC = '\x03';
//   const ctrlX = '\x18';
//   const ctrlZ = '\x1A';

//   if (sequence === ctrlC) {
//     handleGracefulExit();
//   }

//   console.log(key, a);
//   if (key.ctrl) {
//     process.exit();
//   }
//   // if (key && key.ctrl && key.name == "c") process.exit();
//   // if (key === "\u0003") {
//   //   process.exit();
//   // }
//   // write the key to stdout all normal like
//   process.stdout.write(key);
// });

// // import readline from "readline";

// // const rl = readline.createInterface({
// //   input: process.stdin,
// //   output: process.stdout,
// // });

// const frames = ['-', '\\', '|', '/'];
// let index = 0;

// // setInterval(() => {
// //   const frame = frames[(index = ++index % frames.length)];

// //   logUpdate(
// //     `
// //         ♥♥
// //    ${frame} unicorns ${frame}
// //         ♥♥
// // `
// //   );
// // }, 16);

// // const xd = exec("ls", (err, stdout, stderr) => {
// //   console.log(stdout);
// //   console.error(err);
// // });

// // console.log(xd)
