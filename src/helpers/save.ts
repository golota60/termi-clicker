import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { parse, stringify } from 'telejson';
import { gameState, GameState, getFreshGameState } from './gameplay.js';

const checkSaves = async () => {
  try {
    const existingSavesArr = await fs.readdir('./termi-clicker');
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

const loadGame = async (fileName: string) => {
  const file = await fs.readFile(`./termi-clicker/${fileName}.json`, {
    encoding: 'utf-8',
  });
  console.log(parse(file));
  return parse(file);
};

export const initGame = async () => {
  const existingSaves = await checkSaves();
  if (!existingSaves) {
    console.log(chalk.yellow('Welcome to termi-clicker!\n'));
    return await createProfilePrompt();
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
      return await createProfilePrompt();
    } else if (loadPick === loadExisting) {
      const pickedExistingSave = await inquirer.prompt([
        {
          type: 'list',
          message: 'Pick a saved profile',
          name: 'profile',
          choices: existingSaves.map((e) => e.split('.')[0]),
        },
      ]);
      return await loadGame(pickedExistingSave.profile);
    }
  }
};

const actualSave = async (data: GameState) => {
  await fs.writeFile(`./termi-clicker/${data.name}.json`, stringify(data));
};

export const createDirAndSaveGame = async () => {
  try {
    await fs.readdir('./termi-clicker');

    await actualSave(gameState);
  } catch (err: any) {
    const isNoPrevSave = err.code === 'ENOENT';
    if (isNoPrevSave) {
      await fs.mkdir('./termi-clicker');

      await actualSave(gameState);
    } else {
      console.error(`Error when reading a save directory ${err}`);
    }
  }
};
