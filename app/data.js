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
 */

/**
 * @typedef {Object} RoutineTemplate
 * @property {string} id - Unique identifier for the routine template
 * @property {string} title - Title of the routine
 * @property {string} imageUrl - URL to the background image for the routine
 * @property {Array<Chore>} chores - Chores in the routine
 */

/**
 * @typedef {Object} ChoreInstance
 * @property {string} id - Unique identifier for the chore instance
 * @property {string} choreId - Reference to the original chore template
 * @property {string} title - Title of the chore
 * @property {number} estimatedTime - Estimated time to complete in minutes
 * @property {string} imageUrl - URL to the pictogram
 * @property {number} points - Points awarded on completion
 * @property {boolean} completed - Whether the chore is completed
 * @property {Date|null} completedAt - When the chore was completed
 */

/**
 * @typedef {Object} RoutineInstance
 * @property {string} id - Unique identifier for the routine instance
 * @property {string} routineId - Reference to the original routine template
 * @property {string} title - Title of the routine
 * @property {string} imageUrl - URL to the background image for the routine
 * @property {Date} startedAt - When this routine instance was started
 * @property {Date|null} completedAt - When this routine instance was completed
 * @property {Array<ChoreInstance>} chores - Chores in this routine instance
 * @property {string} status - Status of the routine (initial, ongoing, completed)
 */

/**
 * Sample routine templates
 * @type {Array<RoutineTemplate>}
 */
export const routineTemplates = [
  {
    id: 'morning',
    title: 'Morgenrutine',
    imageUrl: 'img/morning.png',
    chores: [
      {
        id: 'eat-breakfast',
        title: 'Spis morgenmad',
        estimatedTime: 15,
        imageUrl: 'img/breakfast.png',
        points: 10,
      },
      {
        id: 'get-dressed',
        title: 'Tag tøj på',
        estimatedTime: 10,
        imageUrl: 'img/get-dressed.png',
        points: 10,
      },
      {
        id: 'brush-teeth-morning',
        title: 'Børst tænder',
        estimatedTime: 5,
        imageUrl: 'img/brush-teeth.png',
        points: 5,
      },
      {
        id: 'pack-lunch',
        title: 'Pak madkasse',
        estimatedTime: 10,
        imageUrl: 'img/lunch-box.png',
        points: 15,
      },
      {
        id: 'leave-house',
        title: 'Kom ud af døren',
        estimatedTime: 5,
        imageUrl: 'img/door.png',
        points: 5,
      },
    ],
  },
  {
    id: 'afternoon',
    title: 'Eftermiddag',
    imageUrl: 'img/afternoon.png',
    chores: [
      {
        id: 'wash-hands',
        title: 'Vask hænder',
        estimatedTime: 2,
        imageUrl: 'img/wash-hands.png',
        points: 5,
      },
      {
        id: 'set-table',
        title: 'Dæk bordet',
        estimatedTime: 10,
        imageUrl: 'img/set-table.png',
        points: 15,
      },
      {
        id: 'help-cooking',
        title: 'Hjælp med madlavning',
        estimatedTime: 20,
        imageUrl: 'img/prepare-dinner.png',
        points: 25,
      },
    ],
  },
  {
    id: 'bedtime',
    title: 'Sengetid',
    imageUrl: 'img/bedtime.png',
    chores: [
      {
        id: 'brush-teeth-night',
        title: 'Børst tænder',
        estimatedTime: 5,
        imageUrl: 'img/brush-teeth.png',
        points: 5,
      },
      {
        id: 'pyjamas',
        title: 'Tag nattøj på',
        estimatedTime: 5,
        imageUrl: 'img/pyjamas.png',
        points: 5,
      },
      {
        id: 'read-book',
        title: 'Læs en bog',
        estimatedTime: 15,
        imageUrl: 'img/read-story-father.png',
        points: 200,
      },
    ],
  },
];

/**
 * Default empty routine instances
 * @type {Array<RoutineInstance>}
 */
export const defaultRoutineInstances = [];

/**
 * Sample shop items that can be purchased with points
 */
export const shopItems = [
  {
    id: 'extra-screen-time',
    title: 'Ekstra skærmtid (30 min)',
    points: 50,
    imageUrl: 'img/gaming.png',
  },
  {
    id: 'favorite-dessert',
    title: 'Yndlingsdessert',
    points: 75,
    imageUrl: 'img/dessert.png',
  },
  {
    id: 'small-toy',
    title: 'Lille legetøj',
    points: 150,
    imageUrl: 'img/toy.png',
  },
  {
    id: 'movie-night',
    title: 'Familie filmaften',
    points: 200,
    imageUrl: 'img/movie.png',
  },
];

/**
 * Create a new instance of a routine from a template
 * @param {RoutineTemplate} template - The routine template
 * @returns {RoutineInstance} A new routine instance
 */
export function createRoutineInstance(template) {
  const now = new Date();
  const instanceId = `${template.id}-${now.getTime()}`;

  // Create chore instances from the template
  const choreInstances = template.chores.map((chore) => ({
    id: `${chore.id}-${now.getTime()}`,
    choreId: chore.id,
    title: chore.title,
    estimatedTime: chore.estimatedTime,
    imageUrl: chore.imageUrl,
    points: chore.points,
    completed: false,
    completedAt: null,
  }));

  // Create the routine instance
  return {
    id: instanceId,
    routineId: template.id,
    title: template.title,
    imageUrl: template.imageUrl,
    startedAt: now,
    completedAt: null,
    chores: choreInstances,
    status: 'ongoing',
  };
}
