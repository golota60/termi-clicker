//TODO: convert those to funs which load save states when that is implemented

// click upgrades
export const initialAbilities = {
  'nano-skill': {
    value: 0,
    desc: 'Your nano editor skills',
  },
  'emacs-skill': {
    value: 0,
    desc: 'Your emacs editor skills',
  },
  'vim-skill': {
    value: 0,
    desc: 'Your vim editor skills',
  },
};

// infrastructure upgrades(money over time)
export const initialInfra = {
  hackers: {
    value: 0,
    desc: 'Other hackers working for you',
    cost: 20,
    // resolver: (money: number) => {

    // }
  },
  'debian-linux-instances': {
    value: 0,
    desc: 'Your Debian linux instances',
    cost: 100,
  },
  botnets: {
    value: 0,
    desc: 'Botnets you control',
    cost: 200,
  },
  'arch-linux-instances': {
    value: 0,
    desc: 'Your Arch linux instances(you use arch btw)',
    cost: 500,
  },
};

//you
export const player = {
  abilities: initialAbilities,
  infrastructure: initialInfra,
  moneyPerTick: 0, //todo: resove overlap with abilities
  moneyPerClick: 0, //todo: resove overlap with infra
};
