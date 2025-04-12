// Import custom components
import './components/ChoreCard.js';
import './components/RoutineCard.js';
import './components/ShopItem.js';
import {
  routineTemplates,
  defaultRoutineInstances,
  createRoutineInstance,
  shopItems,
} from './data.js';

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
 * @typedef {import('./data.js').RoutineTemplate} RoutineTemplate
 */

/**
 * @typedef {import('./data.js').RoutineInstance} RoutineInstance
 */

/**
 * @typedef {import('./data.js').ChoreInstance} ChoreInstance
 */

/**
 * Helper function to preload images
 * @param {string} url - The URL of the image to preload
 * @returns {Promise} A promise that resolves when the image is loaded or rejects on error
 */
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(); // Skip if URL is not provided
      return;
    }

    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => {
      console.warn(`Failed to preload image: ${url}`);
      resolve(); // Resolve anyway to not block other images
    };
    img.src = url;
  });
}

/**
 * Main application class
 */
class ChoresApp {
  /**
   * Initialize the application
   */
  constructor() {
    this.currentView = 'main-view';
    this.currentRoutine = null;

    // Store both templates and instances
    this.routineTemplates = routineTemplates;
    this.routineInstances = defaultRoutineInstances;

    this.shopItems = shopItems;
    this.totalPoints = 0;

    // Map view IDs to their URL paths for proper routing
    this.viewRoutes = {
      'main-view': '/',
      'routine-list-view': '/routines',
      'routine-detail-view': '/routine',
    };

    // Map URL paths back to view IDs
    this.routeViews = {
      '/': 'main-view',
      '/routines': 'routine-list-view',
      '/routine': 'routine-detail-view',
    };

    // Initialize the app
    this.init();
  }

  /**
   * Initialize the application and set up event listeners
   */
  init() {
    // Set global styles to prevent text selection and context menu
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      * {
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
      }
      
      img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }
    `;
    document.head.appendChild(styleElement);

    // Prevent context menu globally
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    // Set up navigation events
    const backToMainButton = document.getElementById('back-to-main');
    if (backToMainButton) {
      backToMainButton.addEventListener('click', () => {
        this.navigateTo('main-view');
      });
    }

    const backToListButton = document.getElementById('back-to-list');
    if (backToListButton) {
      backToListButton.addEventListener('click', () => {
        this.navigateTo('main-view');
      });
    }

    // Handle URL changes
    window.addEventListener('popstate', () => {
      this.handleUrlChange();
    });

    // Initialize Web Transitions API if available
    if ('ViewTransition' in window) {
      document.documentElement.classList.add('view-transitions');
    }

    // Setup placeholder for missing images
    this.setupImageErrorHandling();

    // Check initial URL to determine view
    this.handleUrlChange();

    // Load state from local storage
    this.loadFromLocalStorage();

    // Preload all images
    this.preloadAllImages()
      .then(() => {
        console.log('All images preloaded successfully');
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
      });

    // Render the routines and shop items
    this.renderRoutines();
    this.renderShopItems();

    // Calculate total points
    this.calculateTotalPoints();
  }

  /**
   * Preload all images used in the application
   * @returns {Promise} A promise that resolves when all images are loaded
   */
  preloadAllImages() {
    // Create a set to store unique image URLs for preloading
    const imageUrls = new Set();

    // Add additional static images that may not be in the data but used in the app
    const staticImages = [
      'img/morning.png',
      'img/afternoon.png',
      'img/bedtime.png',
      'img/breakfast.png',
      'img/get-dressed.png',
      'img/brush-teeth.png',
      'img/lunch-box.png',
      'img/door.png',
      'img/wash-hands.png',
      'img/set-table.png',
      'img/cooking.png',
      'img/pajamas.png',
      'img/book.png',
      'img/lights-out.png',
      'img/screen-time.png',
      'img/dessert.png',
      'img/toy.png',
      'img/movie.png',
    ];

    // Add all static images
    staticImages.forEach((url) => imageUrls.add(url));

    // Collect all image URLs from routine templates
    this.routineTemplates.forEach((template) => {
      // Add routine image
      if (template.imageUrl) {
        imageUrls.add(template.imageUrl);
      }

      // Add chore images
      if (template.chores && Array.isArray(template.chores)) {
        template.chores.forEach((chore) => {
          if (chore.imageUrl) {
            imageUrls.add(chore.imageUrl);
          }
        });
      }
    });

    // Collect all image URLs from routine instances
    this.routineInstances.forEach((instance) => {
      // Add routine image
      if (instance.imageUrl) {
        imageUrls.add(instance.imageUrl);
      }

      // Add chore images
      if (instance.chores && Array.isArray(instance.chores)) {
        instance.chores.forEach((chore) => {
          if (chore.imageUrl) {
            imageUrls.add(chore.imageUrl);
          }
        });
      }
    });

    // Collect all image URLs from shop items
    this.shopItems.forEach((item) => {
      if (item.imageUrl) {
        imageUrls.add(item.imageUrl);
      }
    });

    // Create a loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.id = 'image-preload-indicator';
    loadingElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    const spinnerElement = document.createElement('div');
    spinnerElement.style.cssText = `
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;

    const textElement = document.createElement('div');
    textElement.textContent = 'Indlæser billeder...';
    textElement.style.cssText = `
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
    `;

    // Add animation keyframes
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleElement);

    loadingElement.appendChild(spinnerElement);
    loadingElement.appendChild(textElement);
    document.body.appendChild(loadingElement);

    // Convert the set to an array and preload all images
    const preloadPromises = Array.from(imageUrls).map((url) => preloadImage(url));

    // Return a promise that resolves when all images are loaded
    return Promise.all(preloadPromises).finally(() => {
      // Remove the loading indicator when done
      if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
      }
    });
  }

  /**
   * Handle URL changes to update the view based on current URL
   */
  handleUrlChange() {
    // Parse the current URL
    const url = new URL(window.location.href);
    const path = url.pathname;
    const params = new URLSearchParams(url.search);
    const routineId = params.get('id');

    // Determine which view to show based on the path
    let viewId = this.routeViews[path] || 'main-view';

    // If we're on the routine detail view and have an ID, load that routine
    if (viewId === 'routine-detail-view' && routineId) {
      console.log(`Looking for routine with ID: ${routineId}`);

      // Find the routine instance by ID
      const routineInstance = this.routineInstances.find((r) => r.id === routineId);

      if (routineInstance) {
        console.log(`Found routine: ${routineInstance.title}`);
        this.currentRoutine = routineInstance;
        this.openRoutineDetails(routineInstance, false); // Don't update URL again
        return;
      } else {
        console.warn(`Routine with ID ${routineId} not found!`);

        // If routine not found, try to get it from its template ID part
        const templateId = routineId.split('-')[0]; // Extract the template ID part

        if (templateId) {
          const template = this.routineTemplates.find((t) => t.id === templateId);
          if (template) {
            console.log(`Creating new routine from template: ${template.title}`);
            // Start the routine from the template
            this.startNewRoutine(template);
            return;
          }
        }
      }
    }

    // Update the view without changing URL (since we're responding to URL change)
    this.updateView(viewId);
  }

  /**
   * Set up error handling for images that fail to load
   */
  setupImageErrorHandling() {
    // Create a data URL for a simple image placeholder
    const placeholderImage = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f2f2f2' width='100' height='100'/%3E%3Cpath fill='%23aaaaaa' d='M30 50L50 30L70 50L50 70Z'/%3E%3C/svg%3E`;

    // Use event delegation to handle all image errors
    document.addEventListener(
      'error',
      (event) => {
        if (event.target && 'tagName' in event.target) {
          const target = event.target;
          // Check if the error is from an image
          if (target.tagName === 'IMG') {
            console.log(`Billede kunne ikke indlæses: ${target.src}`);
            target.src = placeholderImage;
          }
        }
      },
      true
    ); // Use capture phase to catch the error before it bubbles
  }

  /**
   * Navigate to a specific view
   * @param {string} viewId - The ID of the view to navigate to
   * @param {object} params - Additional parameters for the navigation
   */
  navigateTo(viewId, params = {}) {
    // Generate the URL for this view
    const urlPath = this.viewRoutes[viewId] || '/';
    let url = urlPath;

    // Add parameters if any
    if (params.routineId) {
      url = `${url}?id=${params.routineId}`;
    }

    // Update browser history
    const state = { viewId, params };
    window.history.pushState(state, '', url);

    // Use View Transitions API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        this.updateView(viewId);
      });
    } else {
      this.updateView(viewId);
    }
  }

  /**
   * Update the current view
   * @param {string} viewId - The ID of the view to show
   */
  updateView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach((view) => {
      view.classList.remove('active');
    });

    // Show the requested view
    const viewElement = document.getElementById(viewId);
    if (viewElement) {
      viewElement.classList.add('active');
    }

    // Update current view
    this.currentView = viewId;
  }

  /**
   * Calculate total points from all completed chores across all routine instances
   */
  calculateTotalPoints() {
    this.totalPoints = this.routineInstances.reduce((total, routine) => {
      // Calculate points from completed chores in this routine
      const routinePoints = routine.chores
        .filter((chore) => chore.completed)
        .reduce((sum, chore) => sum + chore.points, 0);

      return total + routinePoints;
    }, 0);

    // Update shop items with new point total
    this.updateShopItemsPoints();
  }

  /**
   * Update shop items with current point total
   */
  updateShopItemsPoints() {
    document.querySelectorAll('shop-item').forEach((item) => {
      if (item instanceof HTMLElement) {
        item.userPoints = this.totalPoints;
      }
    });
  }

  /**
   * Check if a routine of the given template type has been started today
   * @param {string} templateId - The id of the template to check
   * @returns {RoutineInstance|null} The routine instance for today or null if none exists
   */
  getRoutineInstanceForToday(templateId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today

    // Find the newest routine instance for this template
    return (
      this.routineInstances.find((routine) => {
        // Check if it's from the same template
        if (routine.routineId !== templateId) return false;

        // Check if it was started today
        const routineDate = new Date(routine.startedAt);
        routineDate.setHours(0, 0, 0, 0); // Set to beginning of that day

        // Compare dates (same day)
        return routineDate.getTime() === today.getTime();
      }) || null
    ); // Ensure we return null instead of undefined if not found
  }

  /**
   * Render all routines in the main view
   */
  renderRoutines() {
    // Render routine templates in the main view
    const routinesContainer = document.querySelector('.routines-container');
    if (routinesContainer) {
      routinesContainer.innerHTML = '';

      this.routineTemplates.forEach((template) => {
        const routineElement = document.createElement('routine-card');

        // Check if this routine was already started today
        const todayInstance = this.getRoutineInstanceForToday(template.id);

        if (todayInstance) {
          // If the routine was already started today, show the instance instead
          routineElement.routine = todayInstance;
          // Add a visual indicator that this is today's routine
          routineElement.setAttribute('today', 'true');
          routineElement.addEventListener('routine-click', (event) => {
            this.openRoutineDetails(event.detail.routine);
          });
        } else {
          // Otherwise show the template as usual
          routineElement.routine = template;
          routineElement.addEventListener('routine-click', (event) => {
            this.startNewRoutine(template);
          });
        }

        routinesContainer.appendChild(routineElement);
      });
    }

    // Render active routine instances in the routine list view
    const routinesList = document.querySelector('.routines-list');
    if (routinesList) {
      routinesList.innerHTML = '';

      // Get today's date at 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all routines that are either ongoing or were completed today
      const routinesToShow = this.routineInstances.filter((routine) => {
        // Include all ongoing routines
        if (routine.status === 'ongoing') return true;

        // Include completed routines from today
        if (routine.status === 'completed' && routine.completedAt) {
          const completedDate = new Date(routine.completedAt);
          completedDate.setHours(0, 0, 0, 0);

          // Display if completed today
          return completedDate.getTime() === today.getTime();
        }

        return false;
      });

      if (routinesToShow.length === 0) {
        routinesList.innerHTML =
          '<p>Der er ingen aktive rutiner. Start en rutine fra forsiden.</p>';
      } else {
        routinesToShow.forEach((routine) => {
          const routineElement = document.createElement('routine-card');
          routineElement.routine = routine;

          // Mark routines from today
          const routineDate = new Date(routine.startedAt);
          routineDate.setHours(0, 0, 0, 0);
          if (routineDate.getTime() === today.getTime()) {
            routineElement.setAttribute('today', 'true');
          }

          routineElement.addEventListener('routine-click', (event) => {
            this.openRoutineDetails(event.detail.routine);
          });

          routinesList.appendChild(routineElement);
        });
      }
    }
  }

  /**
   * Render shop items in the shop container
   */
  renderShopItems() {
    const shopContainer = document.querySelector('.shop-container');
    if (!shopContainer) return;

    // Clear existing content
    shopContainer.innerHTML = '';

    // Create a points display
    const pointsDisplay = document.createElement('div');
    pointsDisplay.classList.add('total-points-display');
    pointsDisplay.innerHTML = `<h4>Dine Point: <span class="points-value">${this.totalPoints}</span></h4>`;
    shopContainer.appendChild(pointsDisplay);

    // Create a container for the shop items
    const itemsContainer = document.createElement('div');
    itemsContainer.classList.add('shop-items-grid');
    itemsContainer.style.display = 'grid';
    itemsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    itemsContainer.style.gap = '20px';
    itemsContainer.style.marginTop = '15px';

    // Add shop items
    this.shopItems.forEach((item) => {
      const shopItemElement = document.createElement('shop-item');
      shopItemElement.item = item;
      shopItemElement.userPoints = this.totalPoints;

      shopItemElement.addEventListener('purchase', (event) => {
        this.purchaseItem(event.detail.itemId, event.detail.cost);
      });

      itemsContainer.appendChild(shopItemElement);
    });

    shopContainer.appendChild(itemsContainer);
  }

  /**
   * Handle the purchase of a shop item
   * @param {string} itemId - The ID of the item to purchase
   * @param {number} cost - The cost of the item in points
   */
  purchaseItem(itemId, cost) {
    if (this.totalPoints >= cost) {
      // Subtract points
      this.totalPoints -= cost;

      // Update points display
      const pointsDisplay = document.querySelector('.total-points-display .points-value');
      if (pointsDisplay) {
        pointsDisplay.textContent = this.totalPoints.toString();
      }

      // Update shop items with new point total
      this.updateShopItemsPoints();

      // Show success message
      alert(`Du har købt denne vare for ${cost} point!`);

      // Save to local storage
      this.saveToLocalStorage();
    }
  }

  /**
   * Start a new routine from a template
   * @param {RoutineTemplate} template - The routine template to start
   */
  startNewRoutine(template) {
    // Check if a routine of this type has already been started today
    const existingRoutine = this.getRoutineInstanceForToday(template.id);

    if (existingRoutine) {
      // If the routine already exists for today, open it instead of creating a new one
      this.currentRoutine = existingRoutine;
      this.openRoutineDetails(existingRoutine);
      return;
    }

    // Create a new routine instance from the template
    const routineInstance = createRoutineInstance(template);

    // Add to routine instances
    this.routineInstances.push(routineInstance);

    // Set as current routine
    this.currentRoutine = routineInstance;

    // Save to local storage before opening details
    this.saveToLocalStorage();

    // Open the routine details view with the new instance
    this.openRoutineDetails(routineInstance);
  }

  /**
   * Open a routine from the main view
   * @param {RoutineInstance} routine - The routine to open
   */
  openRoutine(routine) {
    this.currentRoutine = routine;
    this.navigateTo('routine-detail-view', { routineId: routine.id });
  }

  /**
   * Open the details of a routine
   * @param {RoutineInstance} routine - The routine to show details for
   * @param {boolean} updateUrl - Whether to update the URL (default: true)
   */
  openRoutineDetails(routine, updateUrl = true) {
    if (!routine) {
      console.error('Attempted to open routine details with no routine!');
      this.navigateTo('main-view');
      return;
    }

    console.log(`Opening routine details for: ${routine.title} (ID: ${routine.id})`);
    this.currentRoutine = routine;

    // Update the routine title
    const titleElement = document.getElementById('routine-title');
    if (titleElement) {
      titleElement.textContent = routine.title || 'Rutine Detaljer';
    }

    // Render the chores
    const choresContainer = document.querySelector('.chores-container');
    if (choresContainer) {
      // Clear existing chores
      choresContainer.innerHTML = '';

      if (!routine.chores || routine.chores.length === 0) {
        choresContainer.innerHTML = '<p>Denne rutine har ingen pligter.</p>';
      } else {
        console.log(`Rendering ${routine.chores.length} chores for routine`);

        // Create chore cards
        routine.chores.forEach((chore) => {
          const choreElement = document.createElement('chore-card');
          choreElement.chore = chore;
          choreElement.addEventListener('completion-changed', (event) => {
            // Access detail safely using the CustomEvent interface or fallback
            const detail = event instanceof CustomEvent ? event.detail : { completed: false };
            this.updateChoreCompletion(routine.id, chore.id, detail.completed);
          });

          choresContainer.appendChild(choreElement);
        });
      }
    } else {
      console.error('Chores container not found in the DOM!');
    }

    // Update the URL if needed
    if (updateUrl) {
      this.navigateTo('routine-detail-view', { routineId: routine.id });
    } else {
      this.updateView('routine-detail-view');
    }
  }

  /**
   * Update the completion status of a chore
   * @param {string} routineId - The ID of the routine containing the chore
   * @param {string} choreId - The ID of the chore to update
   * @param {boolean} completed - The new completion status
   */
  updateChoreCompletion(routineId, choreId, completed) {
    console.log(
      `Updating chore completion - Routine: ${routineId}, Chore: ${choreId}, Completed: ${completed}`
    );

    // Find the routine instance
    const routineInstance = this.routineInstances.find((r) => r.id === routineId);

    if (routineInstance) {
      // Find the chore in the routine
      const chore = routineInstance.chores.find((c) => c.id === choreId);
      if (chore) {
        chore.completed = completed;
        chore.completedAt = completed ? new Date() : null;

        // Check if all chores are completed
        const allCompleted = routineInstance.chores.every((c) => c.completed);
        if (allCompleted && routineInstance.status === 'ongoing') {
          routineInstance.status = 'completed';
          routineInstance.completedAt = new Date();
        }

        // Recalculate total points
        this.calculateTotalPoints();

        // Update points display
        const pointsDisplay = document.querySelector('.total-points-display .points-value');
        if (pointsDisplay) {
          pointsDisplay.textContent = this.totalPoints.toString();
        }

        // Save to local storage
        this.saveToLocalStorage();

        // Re-render routines to show updated progress
        this.renderRoutines();
      } else {
        console.error(`Chore with ID ${choreId} not found in routine ${routineId}`);
      }
    } else {
      console.error(`Routine with ID ${routineId} not found`);
    }
  }

  /**
   * Save the current state to local storage
   */
  saveToLocalStorage() {
    localStorage.setItem(
      'chores-app-data',
      JSON.stringify({
        routineInstances: this.routineInstances,
        totalPoints: this.totalPoints,
      })
    );
  }

  /**
   * Load the state from local storage
   */
  loadFromLocalStorage() {
    const data = localStorage.getItem('chores-app-data');
    if (data) {
      try {
        const parsed = JSON.parse(data);

        // Convert ISO date strings back to Date objects
        if (parsed.routineInstances && Array.isArray(parsed.routineInstances)) {
          this.routineInstances = parsed.routineInstances.map((routine) => {
            // Convert string dates to Date objects
            if (routine.startedAt) {
              routine.startedAt = new Date(routine.startedAt);
            }
            if (routine.completedAt) {
              routine.completedAt = new Date(routine.completedAt);
            }

            // Convert chore dates too
            if (routine.chores && Array.isArray(routine.chores)) {
              routine.chores = routine.chores.map((chore) => {
                if (chore.completedAt) {
                  chore.completedAt = new Date(chore.completedAt);
                }
                return chore;
              });
            }

            return routine;
          });

          // Clean up old routine instances
          this.cleanupOldRoutines();
        } else {
          this.routineInstances = [];
        }

        this.totalPoints = parsed.totalPoints || 0;
      } catch (e) {
        console.error('Error parsing data from localStorage:', e);
        this.routineInstances = [];
        this.totalPoints = 0;
      }
    }
  }

  /**
   * Clean up old routines and auto-complete routines that should be completed
   */
  cleanupOldRoutines() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Loop through all routines and mark old ongoing ones as completed
    this.routineInstances = this.routineInstances.filter((routine) => {
      // Convert routine date to start of day for comparison
      const routineDate = new Date(routine.startedAt);
      routineDate.setHours(0, 0, 0, 0);

      // If routine is older than 7 days, remove it completely
      const daysDiff = Math.floor((today - routineDate) / (1000 * 60 * 60 * 24));
      if (daysDiff > 7) {
        return false; // Exclude from filtered array
      }

      // If routine is from before today and still ongoing, mark it as expired
      if (routineDate < today && routine.status === 'ongoing') {
        routine.status = 'expired';
        routine.completedAt = new Date();
      }

      return true; // Keep in the filtered array
    });

    // Save the updated list of instances
    this.saveToLocalStorage();
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new ChoresApp();

  // Expose app to window for debugging
  window.choresApp = app;
});
