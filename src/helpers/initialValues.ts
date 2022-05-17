import chalk from 'chalk';
import {
  AbilitiesState,
  calcMoneyPerSec,
  gameState,
  Infrastructure,
  InfrastructureState,
} from './gameplay.js';

// click upgrades
export const initialAbilities: AbilitiesState = {
  'nano-skill': {
    level: 0,
    desc: 'Your nano editor skills',
  },
  'emacs-skill': {
    level: 0,
    desc: 'Your emacs editor skills',
  },
  'vim-skill': {
    level: 0,
    desc: 'Your vim editor skills',
  },
};

const genericGetColor = (base: Infrastructure) => {
  if (gameState.money >= base.getCost() * gameState.bulkMode) {
    return chalk.green;
  }
  return chalk.red;
};

const genericGetPercentage = (base: Infrastructure) => {
  const ratio = Math.floor((base.getMoneyPerSec() / calcMoneyPerSec()) * 100);
  if (isNaN(ratio)) return 0;
  return ratio;
};

// infrastructure upgrades(money over time)
export const initialInfra: InfrastructureState = {
  hackers: {
    level: 0,
    desc: 'Other hackers working for you',

    getCost: () =>
      Math.floor((1 + gameState.infrastructure.hackers.level * 0.2) * 20), //getGameState()!.state!.infrastructure!.hackers.level, //each level is 20% more expensive than the last
    getMoneyPerSec: () => {
      const base = gameState.infrastructure.hackers.level;
      return base ? Math.floor((1 + base * 0.2) * 25) : 0;
    },
    getPercentage: () => genericGetPercentage(gameState.infrastructure.hackers),
    getColor: () => genericGetColor(gameState?.infrastructure?.hackers),
    buyKey: 1,
    // resolver: (money: number) => {

    // }
  },
  'debian-linux-instances': {
    level: 0,
    desc: 'Your Debian linux instances',
    getCost: () => 100,
    getMoneyPerSec: () => {
      const base = gameState.infrastructure['debian-linux-instances'].level;
      return base ? Math.floor((1 + base * 0.2) * 25) : 0;
    },
    getPercentage: () =>
      genericGetPercentage(gameState.infrastructure['debian-linux-instances']),
    getColor: () =>
      genericGetColor(gameState?.infrastructure?.['debian-linux-instances']),
    buyKey: 2,
  },
  botnets: {
    level: 0,
    desc: 'Botnets you control',
    getCost: () => 200,

    getMoneyPerSec: () => {
      const base = gameState.infrastructure.botnets.level;
      return base ? Math.floor((1 + base * 0.2) * 25) : 0;
    },
    getPercentage: () => genericGetPercentage(gameState.infrastructure.botnets),
    getColor: () => genericGetColor(gameState?.infrastructure?.botnets),
    buyKey: 3,
  },
  'arch-linux-instances': {
    level: 0,
    desc: 'Your Arch linux instances(you use arch btw)',
    getCost: () => 500,

    getMoneyPerSec: () => {
      const base = gameState.infrastructure['arch-linux-instances'].level;
      return base ? Math.floor((1 + base * 0.2) * 25) : 0;
    },
    getPercentage: () =>
      genericGetPercentage(gameState.infrastructure['arch-linux-instances']),
    getColor: () =>
      genericGetColor(gameState?.infrastructure?.['arch-linux-instances']),
    buyKey: 4,
  },
};
