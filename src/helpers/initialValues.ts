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
        'debian-linux-instances': {
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
        botnets: {
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
        'arch-linux-instances': {
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
        'js-libraries': {
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
        'udemy-courses': {
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
        'hacking-ais': {
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
        'stolen-databases': {
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

export const genericGetColor = (base: Infrastructure) => {
  if (gameState.money >= base.getCost(gameState)) {
    return chalk.green;
  }
  return chalk.red;
};

export const genericGetPercentage = (base: Infrastructure) => {
  const ratio = Math.floor(
    (base.getMoneyPerSec(gameState) / calcMoneyPerSec()) * 100
  );
  if (isNaN(ratio)) return 0;
  return ratio;
};

//ALL OF FUNCTIONS NEED TO GET EVERYTHINGS AS AN ARGUMENT CAUSE OF SERIALIZATION ISSUES WITH GLOBAL STATE(I.E THEY NEED TO BE PURE)
//ALSO FUNCTIONS CANNOT BE SHORTENED E.G. () => value. THEY NEED TO LOOK LIKE () => {return value;} BECAUSE OF ISSUE WITH TELEJSON
export const initialInfra: InfrastructureState = {
  hackers: {
    level: 0,
    alias: 'Hackers',
    desc: 'Other hackers working for you',

    getCost: (gs) => {
      return Math.floor(
        100 * gs.bulkMode * (1 + gs.infrastructure.hackers.level * 0.2 || 1)
      );
    },
    getMoneyPerSec: (gs) => {
      const base = gs.infrastructure.hackers;
      return base ? 1 * base.level * base.multiplier : 0;
    },
    getPercentage: (gs, getPercentageFunc) => {
      return getPercentageFunc(gs.infrastructure.hackers);
    },
    getColor: (gs, getColorFunc) => {
      return getColorFunc(gs?.infrastructure?.hackers);
    },
    multiplier: 1,
    buyKey: 1,
    // resolver: (money: number) => {

    // }
  },
  'debian-linux-instances': {
    level: 0,
    alias: 'Debian Linux Instances',
    desc: 'Your Debian linux instances',
    getCost: (gs) => {
      return Math.floor(
        1200 *
          gs.bulkMode *
          (1 + gs.infrastructure['debian-linux-instances'].level * 0.2 || 1)
      );
    },
    getMoneyPerSec: (gs) => {
      const base = gs.infrastructure['debian-linux-instances'];
      return base ? 8 * base.level * base.multiplier : 0;
    },
    getPercentage: (gs, getPercentageFunc) => {
      return getPercentageFunc(gs.infrastructure['debian-linux-instances']);
    },
    getColor: (gs, getColorFunc) => {
      return getColorFunc(gs?.infrastructure?.['debian-linux-instances']);
    },
    multiplier: 1,
    buyKey: 2,
  },
  botnets: {
    level: 0,
    alias: 'Botnets',
    desc: 'Botnets you control',
    getCost: (gs) => {
      return Math.floor(
        12000 * gs.bulkMode * (1 + gs.infrastructure.botnets.level * 0.2 || 1)
      );
    },

    getMoneyPerSec: (gs) => {
      const base = gs.infrastructure.botnets;
      return base ? 42 * base.level * base.multiplier : 0;
    },
    getPercentage: (gs, getPercentageFunc) => {
      return getPercentageFunc(gs.infrastructure.botnets);
    },
    getColor: (gs, getColorFunc) => {
      return getColorFunc(gs?.infrastructure?.botnets);
    },
    multiplier: 1,
    buyKey: 3,
  },
  'arch-linux-instances': {
    level: 0,
    alias: 'Arch Linux Instances',
    desc: 'Your Arch linux instances(you use arch btw)',
    getCost: (gs) => {
      return Math.floor(
        110000 *
          gs.bulkMode *
          (1 + gs.infrastructure['arch-linux-instances'].level * 0.2 || 1)
      );
    },

    getMoneyPerSec: (gs) => {
      const base = gs.infrastructure['arch-linux-instances'];
      return base ? 250 * base.level * base.multiplier : 0;
    },
    getPercentage: (gs, getPercentageFunc) => {
      return getPercentageFunc(gs.infrastructure['arch-linux-instances']);
    },
    getColor: (gs, getColorFunc) => {
      return getColorFunc(gs?.infrastructure?.['arch-linux-instances']);
    },
    multiplier: 1,
    buyKey: 4,
  },
  'js-libraries': {
    level: 0,
    alias: 'Javascript libraries',
    desc: 'JS libraries you use(totally not bloated at all!)',
    getCost: (gs) => {
      return Math.floor(
        1500000 *
          gs.bulkMode *
          (1 + gs.infrastructure['js-libraries'].level * 0.2 || 1)
      );
    },

    getMoneyPerSec: (gs) => {
      const base = gs.infrastructure['js-libraries'];
      return base ? 1450 * base.level * base.multiplier : 0;
    },
    getPercentage: (gs, getPercentageFunc) => {
      return getPercentageFunc(gs.infrastructure['js-libraries']);
    },
    getColor: (gs, getColorFunc) => {
      return getColorFunc(gs?.infrastructure?.['js-libraries']);
    },
    multiplier: 1,
    buyKey: 5,
  },
  'udemy-courses': {
    level: 0,
    alias: 'Online programming courses',
    desc: 'Your programming courses that you are surely going to watch',
    getCost: (gs) => {
      return Math.floor(
        20000000 *
          gs.bulkMode *
          (1 + gs.infrastructure['udemy-courses'].level * 0.2 || 1)
      );
    },

    getMoneyPerSec: (gs) => {
      const base = gs.infrastructure['udemy-courses'];
      return base ? 7500 * base.level * base.multiplier : 0;
    },
    getPercentage: (gs, getPercentageFunc) => {
      return getPercentageFunc(gs.infrastructure['udemy-courses']);
    },
    getColor: (gs, getColorFunc) => {
      return getColorFunc(gs?.infrastructure?.['udemy-courses']);
    },
    multiplier: 1,
    buyKey: 6,
  },
  'hacking-ais': {
    level: 0,
    alias: 'AI for hacking',
    desc: 'Next-gen AI that hacks for you!',
    getCost: (gs) => {
      return Math.floor(
        330000000 *
          gs.bulkMode *
          (1 + gs.infrastructure['hacking-ais'].level * 0.2 || 1)
      );
    },

    getMoneyPerSec: (gs) => {
      const base = gs.infrastructure['hacking-ais'];
      return base ? 44000 * base.level * base.multiplier : 0;
    },
    getPercentage: (gs, getPercentageFunc) => {
      return getPercentageFunc(gs.infrastructure['hacking-ais']);
    },
    getColor: (gs, getColorFunc) => {
      return getColorFunc(gs?.infrastructure?.['hacking-ais']);
    },
    multiplier: 1,
    buyKey: 7,
  },
  'stolen-databases': {
    level: 0,
    alias: 'Stolen databases',
    desc: 'Databases you stole',
    getCost: (gs) => {
      return Math.floor(
        5000000000 *
          gs.bulkMode *
          (1 + gs.infrastructure['stolen-databases'].level * 0.2 || 1)
      );
    },

    getMoneyPerSec: (gs) => {
      const base = gs.infrastructure['stolen-databases'];
      return base ? 260000 * base.level * base.multiplier : 0;
    },
    getPercentage: (gs, getPercentageFunc) => {
      return getPercentageFunc(gs.infrastructure['stolen-databases']);
    },
    getColor: (gs, getColorFunc) => {
      return getColorFunc(gs?.infrastructure?.['stolen-databases']);
    },
    multiplier: 1,
    buyKey: 8,
  },
};
