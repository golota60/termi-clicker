import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { parse, stringify } from 'telejson';
import {
  gameState,
  GameState,
  getFreshGameState,
  updateGameState,
} from './gameplay.js';

const checkSaves = async () => {
  try {
    const existingSavesArr = await fs.readdir(
      __dirname + '/../../../../../../../termi-clicker'
    );
    return existingSavesArr;
  } catch (err) {
    return undefined;
  }
};

const createProfilePrompt = async () => {
  const newProfilePrompt = await inquirer.prompt([
    {
      type: 'input',
      message: 'Create a profile name:',
      name: 'profile',
    },
  ]);
  return getFreshGameState(newProfilePrompt.profile);
};

export const loadGame = async (fileName: string) => {
  const file = await fs.readFile(
    __dirname + `/../../../../../../../termi-clicker/${fileName}.json`,
    {
      encoding: 'utf-8',
    }
  );
  return parse(file);
};

export const initGame = async (): Promise<{
  game: GameState;
  loaded: boolean;
}> => {
  const existingSaves = await checkSaves();
  if (!existingSaves) {
    console.log(chalk.yellow('Welcome to termi-clicker!\n'));
    const prof = await createProfilePrompt();
    return { game: prof, loaded: false };
  } else {
    console.log(chalk.yellow('Welcome back to termi-clicker!\n'));
    const createNew = 'Create a new profile';
    const loadExisting = 'Load a previously saved profile';
    const { loadPick } = await inquirer.prompt([
      {
        type: 'list',
        message: 'Action',
        name: 'loadPick',
        choices: [createNew, loadExisting],
      },
    ]);
    if (loadPick === createNew) {
      const prof = await createProfilePrompt();
      return { game: prof, loaded: false };
    } else if (loadPick === loadExisting) {
      const pickedExistingSave = await inquirer.prompt([
        {
          type: 'list',
          message: 'Pick a saved profile',
          name: 'profile',
          choices: existingSaves.map((e) => e.split('.')[0]),
        },
      ]);
      const temp = getFreshGameState(pickedExistingSave.profile);
      return { game: temp, loaded: true };
      // updateGameState(temp);
    }
  }
  throw new Error(
    'Error when initializing a game; this should not happen, please open an issue in the github repo'
  );
};

const actualSave = async (data: GameState) => {
  await fs.writeFile(
    __dirname + `/../../../../../../../termi-clicker/${data.name}.json`,
    stringify(data)
  );
};

export const createDirAndSaveGame = async () => {
  try {
    await fs.readdir(__dirname + '/../../../../../../../termi-clicker');

    await actualSave(gameState);
  } catch (err: any) {
    const isNoPrevSave = err.code === 'ENOENT';
    if (isNoPrevSave) {
      await fs.mkdir(__dirname + '/../../../../../../../termi-clicker');

      await actualSave(gameState);
    } else {
      console.error(`Error when reading a save directory ${err}`);
    }
  }
};
