import chalk from 'chalk';
import {
  calcMoneyPerSec,
  gameState,
  Infrastructure,
  InfrastructureState,
  updateGameState,
} from './gameplay.js';

interface BaseUpgrade {
  name: string;
  action: () => any;
  price: number;
  id: string;
}

const getDoubleClick = (price: number, id: string): BaseUpgrade => ({
  name: '2x click power',
  action: () =>
    updateGameState({ ...gameState, clickPower: gameState.clickPower * 2 }),
  price,
  id,
});
const getDoubleHackers = (price: number, id: string): BaseUpgrade => ({
  name: '2x hackers',
  action: () =>
    updateGameState({
      ...gameState,
      infrastructure: {
        ...gameState.infrastructure,
        hackers: {
          ...gameState.infrastructure.hackers,
          multiplier: gameState.infrastructure.hackers.multiplier * 2,
        },
      },
    }),
  price,
  id,
});
const getDoubleDebian = (price: number, id: string): BaseUpgrade => ({
  name: '2x debian power',
  action: () =>
    updateGameState({
      ...gameState,
      infrastructure: {
        ...gameState.infrastructure,
        hackers: {
          ...gameState.infrastructure['debian-linux-instances'],
          multiplier:
            gameState.infrastructure['debian-linux-instances'].multiplier * 2,
        },
      },
    }),
  price,
  id,
});
const getDoubleBotnet = (price: number, id: string): BaseUpgrade => ({
  name: '2x botnet power',
  action: () =>
    updateGameState({
      ...gameState,
      infrastructure: {
        ...gameState.infrastructure,
        hackers: {
          ...gameState.infrastructure.botnets,
          multiplier: gameState.infrastructure.botnets.multiplier * 2,
        },
      },
    }),
  price,
  id,
});
const getDoubleArch = (price: number, id: string): BaseUpgrade => ({
  name: '2x arch power',
  action: () =>
    updateGameState({
      ...gameState,
      infrastructure: {
        ...gameState.infrastructure,
        hackers: {
          ...gameState.infrastructure['arch-linux-instances'],
          multiplier:
            gameState.infrastructure['arch-linux-instances'].multiplier * 2,
        },
      },
    }),
  price,
  id,
});
const getDoubleJS = (price: number, id: string): BaseUpgrade => ({
  name: '2x JS libs power',
  action: () =>
    updateGameState({
      ...gameState,
      infrastructure: {
        ...gameState.infrastructure,
        hackers: {
          ...gameState.infrastructure['js-libraries'],
          multiplier: gameState.infrastructure['js-libraries'].multiplier * 2,
        },
      },
    }),
  price,
  id,
});
const getDoubleCourses = (price: number, id: string): BaseUpgrade => ({
  name: '2x courses power',
  action: () =>
    updateGameState({
      ...gameState,
      infrastructure: {
        ...gameState.infrastructure,
        hackers: {
          ...gameState.infrastructure['udemy-courses'],
          multiplier: gameState.infrastructure['udemy-courses'].multiplier * 2,
        },
      },
    }),
  price,
  id,
});
const getDoubleAI = (price: number, id: string): BaseUpgrade => ({
  name: '2x AI power',
  action: () =>
    updateGameState({
      ...gameState,
      infrastructure: {
        ...gameState.infrastructure,
        hackers: {
          ...gameState.infrastructure['hacking-ais'],
          multiplier: gameState.infrastructure['hacking-ais'].multiplier * 2,
        },
      },
    }),
  price,
  id,
});
const getDoubleStolenDB = (price: number, id: string): BaseUpgrade => ({
  name: '2x stolen DB power',
  action: () =>
    updateGameState({
      ...gameState,
      infrastructure: {
        ...gameState.infrastructure,
        hackers: {
          ...gameState.infrastructure['stolen-databases'],
          multiplier:
            gameState.infrastructure['stolen-databases'].multiplier * 2,
        },
      },
    }),
  price,
  id,
});
const getMoreMoneyPerSec = (
  price: number,
  percentage: number,
  id: string
): BaseUpgrade => ({
  name: `${percentage * 100}% increase in total money per second`,
  action: () =>
    updateGameState({
      ...gameState,
      moneyPerSecUpgrade: Math.round(
        gameState.moneyPerSecUpgrade + gameState.moneyPerSecUpgrade * percentage
      ),
    }),
  price,
  id,
});

export const upgradesInOrder = [
  getDoubleClick(100, '1'),
  getDoubleClick(500, '2'),
  getDoubleHackers(1000, '3'),
  getDoubleDebian(10000, '4'),
  getDoubleBotnet(120000, '5'),
  getMoreMoneyPerSec(1000000, 0.01, '6'),
  getDoubleArch(1300000, '7'),
  getMoreMoneyPerSec(5000000, 0.01, '8'),
  getMoreMoneyPerSec(10000000, 0.01, '9'),
  getDoubleJS(14000000, '10'),
  getMoreMoneyPerSec(50000000, 0.02, '11'),
  getMoreMoneyPerSec(100000000, 0.02, '12'),
  getMoreMoneyPerSec(100000000, 0.02, '13'),
  getMoreMoneyPerSec(100000000, 0.02, '14'),
  getMoreMoneyPerSec(100000000, 0.02, '15'),
  getMoreMoneyPerSec(100000000, 0.02, '16'),
  getMoreMoneyPerSec(100000000, 0.02, '17'),
  getDoubleCourses(200000000, '18'),
  getMoreMoneyPerSec(500000000, 0.02, '19'),
  getMoreMoneyPerSec(500000000, 0.02, '20'),
  getDoubleAI(3300000000, '21'),
];

const genericGetColor = (base: Infrastructure) => {
  if (gameState.money >= base.getCost()) {
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
    alias: 'Hackers',
    desc: 'Other hackers working for you',

    getCost: () =>
      Math.floor(
        100 *
          gameState.bulkMode *
          (1 + gameState.infrastructure.hackers.level * 0.2 || 1)
      ),
    getMoneyPerSec: () => {
      const base = gameState.infrastructure.hackers;
      return base ? 1 * base.level * base.multiplier : 0;
    },
    getPercentage: () => genericGetPercentage(gameState.infrastructure.hackers),
    getColor: () => genericGetColor(gameState?.infrastructure?.hackers),
    multiplier: 1,
    buyKey: 1,
    // resolver: (money: number) => {

    // }
  },
  'debian-linux-instances': {
    level: 0,
    alias: 'Debian Linux Instances',
    desc: 'Your Debian linux instances',
    getCost: () =>
      Math.floor(
        1200 *
          gameState.bulkMode *
          (1 + gameState.infrastructure['debian-linux-instances'].level * 0.2 ||
            1)
      ),
    getMoneyPerSec: () => {
      const base = gameState.infrastructure['debian-linux-instances'];
      return base ? 8 * base.level * base.multiplier : 0;
    },
    getPercentage: () =>
      genericGetPercentage(gameState.infrastructure['debian-linux-instances']),
    getColor: () =>
      genericGetColor(gameState?.infrastructure?.['debian-linux-instances']),
    multiplier: 1,
    buyKey: 2,
  },
  botnets: {
    level: 0,
    alias: 'Botnets',
    desc: 'Botnets you control',
    getCost: () =>
      Math.floor(
        12000 *
          gameState.bulkMode *
          (1 + gameState.infrastructure.botnets.level * 0.2 || 1)
      ),

    getMoneyPerSec: () => {
      const base = gameState.infrastructure.botnets;
      return base ? 42 * base.level * base.multiplier : 0;
    },
    getPercentage: () => genericGetPercentage(gameState.infrastructure.botnets),
    getColor: () => genericGetColor(gameState?.infrastructure?.botnets),
    multiplier: 1,
    buyKey: 3,
  },
  'arch-linux-instances': {
    level: 0,
    alias: 'Arch Linux Instances',
    desc: 'Your Arch linux instances(you use arch btw)',
    getCost: () =>
      Math.floor(
        110000 *
          gameState.bulkMode *
          (1 + gameState.infrastructure['arch-linux-instances'].level * 0.2 ||
            1)
      ),

    getMoneyPerSec: () => {
      const base = gameState.infrastructure['arch-linux-instances'];
      return base ? 250 * base.level * base.multiplier : 0;
    },
    getPercentage: () =>
      genericGetPercentage(gameState.infrastructure['arch-linux-instances']),
    getColor: () =>
      genericGetColor(gameState?.infrastructure?.['arch-linux-instances']),
    multiplier: 1,
    buyKey: 4,
  },
  'js-libraries': {
    level: 0,
    alias: 'Javascript libraries',
    desc: 'JS libraries you use(totally not bloated at all!)',
    getCost: () =>
      Math.floor(
        1500000 *
          gameState.bulkMode *
          (1 + gameState.infrastructure['js-libraries'].level * 0.2 || 1)
      ),

    getMoneyPerSec: () => {
      const base = gameState.infrastructure['js-libraries'];
      return base ? 1450 * base.level * base.multiplier : 0;
    },
    getPercentage: () =>
      genericGetPercentage(gameState.infrastructure['js-libraries']),
    getColor: () =>
      genericGetColor(gameState?.infrastructure?.['js-libraries']),
    multiplier: 1,
    buyKey: 5,
  },
  'udemy-courses': {
    level: 0,
    alias: 'Online programming courses',
    desc: 'Your programming courses that you are surely going to watch',
    getCost: () =>
      Math.floor(
        20000000 *
          gameState.bulkMode *
          (1 + gameState.infrastructure['udemy-courses'].level * 0.2 || 1)
      ),

    getMoneyPerSec: () => {
      const base = gameState.infrastructure['udemy-courses'];
      return base ? 7500 * base.level * base.multiplier : 0;
    },
    getPercentage: () =>
      genericGetPercentage(gameState.infrastructure['udemy-courses']),
    getColor: () =>
      genericGetColor(gameState?.infrastructure?.['udemy-courses']),
    multiplier: 1,
    buyKey: 6,
  },
  'hacking-ais': {
    level: 0,
    alias: 'AI for hacking',
    desc: 'Next-gen AI that hacks for you!',
    getCost: () =>
      Math.floor(
        330000000 *
          gameState.bulkMode *
          (1 + gameState.infrastructure['hacking-ais'].level * 0.2 || 1)
      ),

    getMoneyPerSec: () => {
      const base = gameState.infrastructure['hacking-ais'];
      return base ? 44000 * base.level * base.multiplier : 0;
    },
    getPercentage: () =>
      genericGetPercentage(gameState.infrastructure['hacking-ais']),
    getColor: () => genericGetColor(gameState?.infrastructure?.['hacking-ais']),
    multiplier: 1,
    buyKey: 7,
  },
  'stolen-databases': {
    level: 0,
    alias: 'Stolen databases',
    desc: 'Databases you stole',
    getCost: () =>
      Math.floor(
        5000000000 *
          gameState.bulkMode *
          (1 + gameState.infrastructure['stolen-databases'].level * 0.2 || 1)
      ),

    getMoneyPerSec: () => {
      const base = gameState.infrastructure['stolen-databases'];
      return base ? 260000 * base.level * base.multiplier : 0;
    },
    getPercentage: () =>
      genericGetPercentage(gameState.infrastructure['stolen-databases']),
    getColor: () =>
      genericGetColor(gameState?.infrastructure?.['stolen-databases']),
    multiplier: 1,
    buyKey: 8,
  },
};
