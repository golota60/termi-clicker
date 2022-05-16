import chalk from 'chalk';

const defaultTerminalWidth = 50;
const defualtTerminalHeight = 24;

export const handleGracefulExit = () => {
  console.log('\nInterrupt signal detected! Closing gracefully...');
  process.exit();
};

/**
 * Add spaces and returns provided word with specified length
 * @param {string} string
 * @param {number} lengthToMatch
 *
 * @returns {string}
 */
const addSpacesToMatchLength = (
  string: string,
  lengthToMatch: number,
  endSign = ''
) => {
  if (string.length >= lengthToMatch) return string;
  const lengthDiff = lengthToMatch - string.length;
  return `${string}${new Array(lengthDiff).fill(' ').join('')}${endSign}`;
};

/**
 * Taken almost literally from:
 * https://github.com/golota60/yayfetch/blob/c64b3c83b56d94189203c148934ca23d9919da4f/src/helpers/helpers.ts#L188
 *
 * Used to equalize to the longest arg in an array by adding spaces, like this
 * @param {string[]} stringArr[] - array of strings to equalize
 * @param {number} lineOffset - the number of additional spaces at the end of strings
 *
 * @returns {string[]}
 *
 * @example
 * [                         [
 *  'Michelangelo',            'Michelangelo',
 *  'Michael',          =>    'Michael     ',
 *  'Tony'                    'Tony        ',
 * ]                         ]
 *
 */
export const equalizeStringArray = (
  stringArr: string | Array<string>,
  options: {
    startLineOffset?: number;
    endLineOffset?: number;
    endSign?: string;
  } = {
    startLineOffset: 0,
    endLineOffset: 0,
    endSign: '',
  }
) => {
  const { startLineOffset = 0, endLineOffset = 0, endSign = '' } = options;
  const isArr = Array.isArray(stringArr);
  const arg = isArr ? stringArr : stringArr.split('\n');
  const longestArgLength = arg.reduce((acc, curr) => {
    const length = curr.length;
    return length > acc ? length : acc;
  }, 0);
  return arg.map((line) => {
    if (line.length < longestArgLength + endLineOffset) {
      return addSpacesToMatchLength(
        new Array(startLineOffset).fill(' ').join('') + line,
        startLineOffset + longestArgLength + endLineOffset,
        endSign
      );
    }
    return line;
  });
};

/**
 * Get an object to pretty print an object(0/1 level deep)
 *
 * @param {object} obj - object to return ready to be pretty printed
 * @param {string} keyToLog - the key of the value to be pretty printed. If not provided will attempt to use value itself as a string.
 *
 * @returns {string}
 */
export const getTabledObject = (
  obj: Record<string, Record<string, any> | string>, // obj: {key: {keyToLog: val}}
  keysToLog?: Array<string>
) => {
  const normalizedKeys = equalizeStringArray(['key', ...Object.keys(obj)], {
    endLineOffset: 1,
  });
  const handleFunc = (elem: unknown) =>
    typeof elem === 'function' ? elem() : elem;
  const normalizedValues = keysToLog?.map((keyToLog) =>
    equalizeStringArray([
      keyToLog,
      ...(Object.values(obj).map((e) =>
        String(typeof e === 'object' ? handleFunc(e[keyToLog]) : handleFunc(e))
      ) as Array<string>),
    ])
  );

  // stitch those badboys together
  let stitched = '';
  for (let i = 0; i < normalizedKeys.length; i++) {
    stitched = `${stitched}
    ${[normalizedKeys[i]]}| ${normalizedValues?.map((e) => e[i]).join(' | ')}`;
  }
  return stitched;
};

export interface Message {
  type: 'danger' | 'warning' | 'info';
  content: string;
}
export const renderMessage = (message: Message): string => {
  switch (message.type) {
    case 'danger':
      return chalk.red(message.content);
    case 'warning':
      return chalk.yellow(message.content);
    case 'info':
    default:
      return chalk.blue(message.content);
  }
};

export const wrapInBorder = (
  content: string,
  options?: {
    borderSign?: string;
    topBottomThickness?: number;
    sideTickness?: number;
  }
) => {
  const borderSignParsed = options?.borderSign || '#';
  const topBottomThicknessParsed = options?.topBottomThickness || 1;
  const sideThicknessParsed = options?.sideTickness || 1;
  const terminalWidth = process.stdout.columns || defaultTerminalWidth;
  const terminalHeight = process.stdout.rows || defualtTerminalHeight;

  const topBorder = new Array(topBottomThicknessParsed).fill(
    new Array(terminalWidth).fill(borderSignParsed).join('')
  );

  let newOutput: string[] = [
    ...topBorder,
    content
      .split('\n')
      .map(
        (e) =>
          new Array(sideThicknessParsed).fill(borderSignParsed).join('') + e
      )
      .join('\n'),
    ...topBorder,
  ];

  return newOutput.join('\n');
};

/**
 * @param cols - any number of strings you wish to be merged, where each row is separated by \n(newline)
 * @returns - a string where all the columns are merged into a row
 */
export const joinColumns = (...cols: string[]) => {
  // Splitting those creates a string[][] where the elements of nested arrays are lines
  const colsSplit = cols.map((element) => element.split('\n'));

  // Find the vertically longest argument
  // Length of which is going the be the iterator on how many times we have to print a line
  const verticallyLongestArg = colsSplit.reduce(
    (acc, value) => (value.length > acc ? value.length : acc),
    0
  );

  const colsHeightMatched = colsSplit.map((elem) => [
    ...elem,
    ...new Array(verticallyLongestArg - elem.length).fill(' '),
  ]);
  const argsNumber = cols.length;
  const mergedArgs = [] as string[];
  for (const [i] of [...new Array(verticallyLongestArg)].entries()) {
    let nextLine = '';
    for (const [i2] of [...new Array(argsNumber)].entries()) {
      if (!colsHeightMatched[i2][i]) continue;

      nextLine += colsHeightMatched[i2][i];
    }

    mergedArgs.push(nextLine);
  }
  return mergedArgs.join('\n');
};
