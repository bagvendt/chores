// Import custom components
import './components/ChoreCard.js';
import './components/RoutineCard.js';
import './components/ShopItem.js';
import { routines, shopItems } from './data.js';

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
 * Main application class
 */
class ChoresApp {
  /**
   * Initialize the application
   */
  constructor() {
    this.currentView = 'main-view';
    this.currentRoutine = null;
    this.routines = routines;
    this.shopItems = shopItems;
    this.totalPoints = 0;
    
    // Initialize the app
    this.init();
  }
  
  /**
   * Initialize the application and set up event listeners
   */
  init() {
    // Render the routines in the main view
    this.renderRoutines();
    
    // Render the shop items
    this.renderShopItems();
    
    // Calculate total points
    this.calculateTotalPoints();
    
    // Set up navigation events
    document.getElementById('back-to-main').addEventListener('click', () => {
      this.navigateTo('main-view');
    });
    
    document.getElementById('back-to-list').addEventListener('click', () => {
      this.navigateTo('routine-list-view');
    });
    
    // Initialize Web Transitions API if available
    if ('ViewTransition' in window) {
      document.documentElement.classList.add('view-transitions');
    }
    
    // Setup placeholder for missing images
    this.setupImageErrorHandling();
  }
  
  /**
   * Set up error handling for images that fail to load 
   */
  setupImageErrorHandling() {
    // Create a data URL for a simple image placeholder
    const placeholderImage = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f2f2f2' width='100' height='100'/%3E%3Cpath fill='%23aaaaaa' d='M30 50L50 30L70 50L50 70Z'/%3E%3C/svg%3E`;
    
    // Use event delegation to handle all image errors
    document.addEventListener('error', (event) => {
      const target = event.target;
      // Check if the error is from an image
      if (target.tagName === 'IMG') {
        console.log(`Billede kunne ikke indlæses: ${target.src}`);
        target.src = placeholderImage;
      }
    }, true); // Use capture phase to catch the error before it bubbles
  }
  
  /**
   * Navigate to a specific view
   * @param {string} viewId - The ID of the view to navigate to
   */
  navigateTo(viewId) {
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
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    
    // Show the requested view
    document.getElementById(viewId).classList.add('active');
    
    // Update current view
    this.currentView = viewId;
  }
  
  /**
   * Calculate total points from all completed chores
   */
  calculateTotalPoints() {
    this.totalPoints = this.routines.reduce((total, routine) => {
      // Calculate points from completed chores in this routine
      const routinePoints = routine.chores
        .filter(chore => chore.completed)
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
    document.querySelectorAll('shop-item').forEach(item => {
      item.userPoints = this.totalPoints;
    });
  }
  
  /**
   * Render all routines in the main view
   */
  renderRoutines() {
    const routinesContainer = document.querySelector('.routines-container');
    routinesContainer.innerHTML = '';
    
    this.routines.forEach(routine => {
      const routineElement = document.createElement('routine-card');
      routineElement.routine = routine;
      routineElement.addEventListener('click', () => {
        this.openRoutine(routine);
      });
      
      routinesContainer.appendChild(routineElement);
    });
    
    // Also render routines in the routine list view
    const routinesList = document.querySelector('.routines-list');
    routinesList.innerHTML = '';
    
    this.routines.forEach(routine => {
      const routineElement = document.createElement('routine-card');
      routineElement.routine = routine;
      routineElement.addEventListener('click', () => {
        this.openRoutineDetails(routine);
      });
      
      routinesList.appendChild(routineElement);
    });
  }
  
  /**
   * Render shop items in the shop container
   */
  renderShopItems() {
    const shopContainer = document.querySelector('.shop-container');
    
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
    this.shopItems.forEach(item => {
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
      pointsDisplay.textContent = this.totalPoints;
      
      // Update shop items with new point total
      this.updateShopItemsPoints();
      
      // Show success message
      alert(`Du har købt denne vare for ${cost} point!`);
      
      // Save to local storage
      this.saveToLocalStorage();
    }
  }
  
  /**
   * Open a routine from the main view
   * @param {Routine} routine - The routine to open
   */
  openRoutine(routine) {
    this.currentRoutine = routine;
    this.navigateTo('routine-list-view');
  }
  
  /**
   * Open the details of a routine
   * @param {Routine} routine - The routine to show details for
   */
  openRoutineDetails(routine) {
    this.currentRoutine = routine;
    
    // Update the routine title
    document.getElementById('routine-title').textContent = routine.title;
    
    // Render the chores
    const choresContainer = document.querySelector('.chores-container');
    choresContainer.innerHTML = '';
    
    routine.chores.forEach(chore => {
      const choreElement = document.createElement('chore-card');
      choreElement.chore = chore;
      choreElement.addEventListener('completion-changed', (event) => {
        this.updateChoreCompletion(chore.id, event.detail.completed);
      });
      
      choresContainer.appendChild(choreElement);
    });
    
    this.navigateTo('routine-detail-view');
  }
  
  /**
   * Update the completion status of a chore
   * @param {string} choreId - The ID of the chore to update
   * @param {boolean} completed - The new completion status
   */
  updateChoreCompletion(choreId, completed) {
    // Find the routine containing the chore
    const routine = this.routines.find(r => 
      r.chores.some(c => c.id === choreId)
    );
    
    if (routine) {
      // Find the chore in the routine
      const chore = routine.chores.find(c => c.id === choreId);
      if (chore) {
        chore.completed = completed;
        
        // Recalculate total points
        this.calculateTotalPoints();
        
        // Update points display
        const pointsDisplay = document.querySelector('.total-points-display .points-value');
        if (pointsDisplay) {
          pointsDisplay.textContent = this.totalPoints;
        }
        
        // Save to local storage
        this.saveToLocalStorage();
        
        // Re-render routines to show updated progress
        this.renderRoutines();
      }
    }
  }
  
  /**
   * Save the current state to local storage
   */
  saveToLocalStorage() {
    localStorage.setItem('chores-app-data', JSON.stringify({
      routines: this.routines,
      totalPoints: this.totalPoints
    }));
  }
  
  /**
   * Load the state from local storage
   */
  loadFromLocalStorage() {
    const data = localStorage.getItem('chores-app-data');
    if (data) {
      const parsed = JSON.parse(data);
      this.routines = parsed.routines;
      this.totalPoints = parsed.totalPoints || 0;
      
      // Re-render the routines
      this.renderRoutines();
      
      // Update points display
      const pointsDisplay = document.querySelector('.total-points-display .points-value');
      if (pointsDisplay) {
        pointsDisplay.textContent = this.totalPoints;
      }
      
      // Update shop items
      this.updateShopItemsPoints();
    }
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new ChoresApp();
  
  // Try to load data from local storage
  app.loadFromLocalStorage();
  
  // Expose app to window for debugging
  window.choresApp = app;
}); 