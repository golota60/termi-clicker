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
const addSpacesToMatchLength = (string: string, lengthToMatch: number) => {
  if (string.length >= lengthToMatch) return string;
  const lengthDiff = lengthToMatch - string.length;
  return `${string}${new Array(lengthDiff).fill(' ').join('')}`;
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
  stringArr: Array<string>,
  lineOffset = 0
) => {
  const longestArgLength = stringArr.reduce((acc, curr) => {
    const length = curr.length;
    return length > acc ? length : acc;
  }, 0);
  return stringArr.map((line) => {
    if (line.length < longestArgLength + lineOffset) {
      return addSpacesToMatchLength(line, longestArgLength + lineOffset);
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
export const getPrettyPrintableObject = (
  obj: Record<string, Record<string, any> | string>, // obj: {key: {keyToLog: val}}
  keyToLog?: string
) => {
  const normalizedKeys = equalizeStringArray(Object.keys(obj), 1);
  const normalizedValues = equalizeStringArray(
    Object.values(obj).map((e) =>
      keyToLog && typeof e !== 'string' ? e[keyToLog] : e
    ) as Array<string>
  );

  // stitch those badboys together
  let stitched = '';
  for (let i = 0; i < normalizedKeys.length; i++) {
    stitched = `${stitched}
    ${[normalizedKeys[i]]}: ${normalizedValues[i]}`;
  }
  return stitched;
};
