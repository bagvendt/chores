/**
 * Sample data for the chores application
 */

/**
 * @typedef {Object} Chore
 * @property {string} id - Unique identifier for the chore
 * @property {string} title - Title of the chore
 * @property {number} estimatedTime - Estimated time to complete in minutes
 * @property {string} imageUrl - URL to the pictogram
 * @property {number} points - Points awarded on completion
 * @property {boolean} completed - Whether the chore is completed
 */

/**
 * @typedef {Object} Routine
 * @property {string} id - Unique identifier for the routine
 * @property {string} title - Title of the routine
 * @property {Array<Chore>} chores - Chores in the routine
 */

/**
 * Sample chores data
 * @type {Array<Routine>}
 */
export const routines = [
  {
    id: 'morning',
    title: 'Morgenrutine',
    chores: [
      {
        id: 'brush-teeth-morning',
        title: 'Børst tænder',
        estimatedTime: 5,
        imageUrl: 'img/brush-teeth.png',
        points: 5,
        completed: false
      },
      {
        id: 'get-dressed',
        title: 'Tag tøj på',
        estimatedTime: 10,
        imageUrl: 'img/get-dressed.png',
        points: 10,
        completed: false
      },
      {
        id: 'pack-lunch',
        title: 'Pak madkasse',
        estimatedTime: 10,
        imageUrl: 'img/lunch-box.png',
        points: 15,
        completed: false
      },
      {
        id: 'eat-breakfast',
        title: 'Spis morgenmad',
        estimatedTime: 15,
        imageUrl: 'img/breakfast.png',
        points: 10,
        completed: false
      },
      {
        id: 'leave-house',
        title: 'Kom ud af døren',
        estimatedTime: 5,
        imageUrl: 'img/door.png',
        points: 5,
        completed: false
      }
    ]
  },
  {
    id: 'before-dinner',
    title: 'Før aftensmad',
    chores: [
      {
        id: 'wash-hands',
        title: 'Vask hænder',
        estimatedTime: 2,
        imageUrl: 'img/wash-hands.png',
        points: 5,
        completed: false
      },
      {
        id: 'set-table',
        title: 'Dæk bordet',
        estimatedTime: 10,
        imageUrl: 'img/set-table.png',
        points: 15,
        completed: false
      },
      {
        id: 'help-cooking',
        title: 'Hjælp med madlavning',
        estimatedTime: 20,
        imageUrl: 'img/cooking.png',
        points: 25,
        completed: false
      }
    ]
  },
  {
    id: 'after-dinner',
    title: 'Efter aftensmad',
    chores: [
      {
        id: 'clear-table',
        title: 'Ryd bordet',
        estimatedTime: 5,
        imageUrl: 'img/clear-table.png',
        points: 10,
        completed: false
      },
      {
        id: 'load-dishwasher',
        title: 'Fyld opvaskemaskinen',
        estimatedTime: 10,
        imageUrl: 'img/dishwasher.png',
        points: 15,
        completed: false
      },
      {
        id: 'wipe-counters',
        title: 'Tør køkkenbordet af',
        estimatedTime: 5,
        imageUrl: 'img/wipe-counter.png',
        points: 10,
        completed: false
      }
    ]
  },
  {
    id: 'bedtime',
    title: 'Sengetid',
    chores: [
      {
        id: 'brush-teeth-night',
        title: 'Børst tænder',
        estimatedTime: 5,
        imageUrl: 'img/brush-teeth.png',
        points: 5,
        completed: false
      },
      {
        id: 'pajamas',
        title: 'Tag nattøj på',
        estimatedTime: 5,
        imageUrl: 'img/pajamas.png',
        points: 5,
        completed: false
      },
      {
        id: 'read-book',
        title: 'Læs en bog',
        estimatedTime: 15,
        imageUrl: 'img/book.png',
        points: 15,
        completed: false
      },
      {
        id: 'lights-out',
        title: 'Sluk lyset',
        estimatedTime: 1,
        imageUrl: 'img/lights-out.png',
        points: 5,
        completed: false
      }
    ]
  }
];

/**
 * Sample shop items that can be purchased with points
 */
export const shopItems = [
  {
    id: 'extra-screen-time',
    title: 'Ekstra skærmtid (30 min)',
    points: 50,
    imageUrl: 'img/screen-time.png'
  },
  {
    id: 'favorite-dessert',
    title: 'Yndlingsdessert',
    points: 75,
    imageUrl: 'img/dessert.png'
  },
  {
    id: 'small-toy',
    title: 'Lille legetøj',
    points: 150,
    imageUrl: 'img/toy.png'
  },
  {
    id: 'movie-night',
    title: 'Familie filmaften',
    points: 200,
    imageUrl: 'img/movie.png'
  }
]; 