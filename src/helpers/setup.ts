//TODO: convert those to funs which load save states when that is implemented
export interface Ability {
  level: number;
  desc: string;
}
export type AbilitiesState = Record<string, Ability>;

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

export interface Infrastructure {
  level: number;
  desc: string;

  getCostForLevel: (level: number) => number;
  getMoneyPerSec: (level: number) => number;
  buyKey: number;

  //todo: loadcost, loadmoneypersec?
}
export type InfrastructureState = Record<string, Infrastructure>;

// infrastructure upgrades(money over time)
export const initialInfra: InfrastructureState = {
  hackers: {
    level: 0,
    desc: 'Other hackers working for you',

    getCostForLevel: (level: number) => (1 + level * 0.2) * 20, //getGameState()!.state!.infrastructure!.hackers.level, //each level is 20% more expensive than the last
    getMoneyPerSec: (level: number) => (1 + level * 0.2) * 5,

    buyKey: 1,
    // resolver: (money: number) => {

    // }
  },
  'debian-linux-instances': {
    level: 0,
    desc: 'Your Debian linux instances',
    getCostForLevel: () => 100,
    getMoneyPerSec: (level: number) => (1 + level * 0.2) * 25,
    buyKey: 2,
  },
  botnets: {
    level: 0,
    desc: 'Botnets you control',
    getCostForLevel: () => 200,
    getMoneyPerSec: (level: number) => (1 + level * 0.2) * 50,
    buyKey: 3,
  },
  'arch-linux-instances': {
    level: 0,
    desc: 'Your Arch linux instances(you use arch btw)',
    getCostForLevel: () => 500,
    getMoneyPerSec: (level: number) => (1 + level * 0.2) * 125,
    buyKey: 4,
  },
};

//you
export const player = {
  abilities: initialAbilities,
  infrastructure: initialInfra,
  moneyPerTick: 0, //todo: resove overlap with abilities
  moneyPerClick: 0, //todo: resove overlap with infra
};
