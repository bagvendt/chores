/**
 * ChoreCard web component
 * Displays a single chore with just an image and gamification elements
 */
class ChoreCard extends HTMLElement {
  /**
   * Initialize the ChoreCard
   */
  constructor() {
    super();
    /**
     * The chore data object
     * @type {Object|null}
     * @private
     */
    this._chore = null;

    /**
     * Shadow DOM for encapsulation
     * @type {ShadowRoot}
     */
    this.attachShadow({ mode: 'open' });

    /**
     * Timer for tracking long press
     * @type {number|null}
     * @private
     */
    this.pressTimer = null;

    /**
     * Flag to track if press is active
     * @type {boolean}
     * @private
     */
    this.pressStarted = false;

    /**
     * Duration in ms for long press to trigger
     * @type {number}
     * @private
     */
    this.longPressDuration = 1500; // 1500ms for long press

    /**
     * Flag to prevent interactions during animations
     * @type {boolean}
     * @private
     */
    this.animationActive = false;

    /**
     * Y coordinate of touch start
     * @type {number|null}
     * @private
     */
    this.touchStartY = null;
  }

  /**
   * Set the chore data for this component
   * @param {object} chore - The chore data to display
   */
  set chore(chore) {
    this._chore = chore;
    this.render();
  }

  /**
   * Get the chore data for this component
   * @returns {object|null} The chore data
   */
  get chore() {
    return this._chore;
  }

  /**
   * Component connected callback
   */
  connectedCallback() {
    if (this._chore) {
      this.render();
    }
  }

  /**
   * Render the chore card
   */
  render() {
    if (!this._chore) return;

    const completedClass = this._chore.completed ? 'completed' : '';
    const statusEmoji = this._chore.completed ? '✅' : '❌';

    // Handle potentially null shadowRoot with a check
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .chore-card {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          padding: 0;
          aspect-ratio: 1 / 1;
        }
        
        .chore-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .chore-card.completed {
          background-color: rgba(76, 175, 80, 0.1);
        }
        
        .chore-card.pressing {
          transform: scale(0.95);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          animation: crazyShake 0.5s infinite;
        }
        
        .chore-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        .status-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 2rem;
          z-index: 10;
          text-shadow: 0 0 5px white, 0 0 5px white;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
        }
        
        .progress-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 8px;
          background-color: #4CAF50;
          width: 0%;
          transition: width 0.1s linear;
          z-index: 10;
        }
        
        @keyframes completedAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes crazyShake {
          0% { transform: scale(0.95) rotate(0deg); }
          10% { transform: scale(0.95) rotate(-10deg) translate(-4px, -2px); }
          20% { transform: scale(0.95) rotate(8deg) translate(7px, 3px); }
          30% { transform: scale(0.92) rotate(-12deg) translate(-7px, 0); }
          40% { transform: scale(0.98) rotate(9deg) translate(4px, -3px); }
          50% { transform: scale(0.94) rotate(-8deg) translate(-2px, 2px); }
          60% { transform: scale(0.97) rotate(10deg) translate(7px, 0); }
          70% { transform: scale(0.92) rotate(-6deg) translate(-7px, 3px); }
          80% { transform: scale(0.97) rotate(5deg) translate(2px, -3px); }
          90% { transform: scale(0.94) rotate(-7deg) translate(-3px, 0); }
          100% { transform: scale(0.95) rotate(0deg); }
        }
        
        .completed-animation {
          animation: completedAnimation 0.5s ease;
        }
        
        .progress-indicator.active {
          background: linear-gradient(90deg, 
            #FF9900, #FF5722, #E91E63, #9C27B0, #3F51B5, #2196F3, #00BCD4, #009688, #4CAF50, #8BC34A);
          background-size: 1000% 100%;
          animation: rainbowProgress 2s linear infinite;
        }
        
        @keyframes rainbowProgress {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      </style>
      
      <div class="chore-card ${completedClass}">
        <img class="chore-image" src="${this._chore.imageUrl}" alt="${this._chore.title}">
        <div class="status-indicator">${statusEmoji}</div>
        <div class="progress-indicator"></div>
      </div>
    `;

    const card = this.shadowRoot.querySelector('.chore-card');

    // Add touch/mouse events for long press
    if (card) {
      card.addEventListener('mousedown', this.startPress.bind(this));
      card.addEventListener('touchstart', this.startPress.bind(this), { passive: true });

      card.addEventListener('mouseup', this.endPress.bind(this));
      card.addEventListener('mouseleave', this.cancelPress.bind(this));
      card.addEventListener('touchend', this.endPress.bind(this));
      card.addEventListener('touchcancel', this.cancelPress.bind(this));

      // Use a more type-safe approach to handle touch move events
      card.addEventListener(
        'touchmove',
        (e) => {
          // Cast the event to make TypeScript happy
          if (e instanceof TouchEvent) {
            this.checkTouchMove(e);
          }
        },
        { passive: true }
      );
    }
  }

  /**
   * Start the press timer for long press
   * @param {Event} e - The event object
   */
  startPress(e) {
    if (this.animationActive) return;

    const shadowRoot = this.shadowRoot;
    if (!shadowRoot) return;

    const progressIndicator = shadowRoot.querySelector('.progress-indicator');
    const card = shadowRoot.querySelector('.chore-card');

    if (!card) return;

    // Add pressing class for visual feedback
    card.classList.add('pressing');

    if (progressIndicator instanceof HTMLElement) {
      progressIndicator.classList.add('active');
    }

    this.pressStarted = true;

    // Store touch position if it's a touch event
    if (e.type === 'touchstart' && 'touches' in e) {
      // Use instanceof check instead of type assertion
      if (e instanceof TouchEvent && e.touches[0]) {
        this.touchStartY = e.touches[0].clientY;
      }
    }

    // Start timing for long press
    let progress = 0;
    this.pressTimer = setInterval(() => {
      progress += 100 / (this.longPressDuration / 100); // Increment by percentage per 100ms
      if (progressIndicator instanceof HTMLElement) {
        progressIndicator.style.width = `${progress}%`;
      }

      // Add vibration feedback every 300ms
      if (progress % 20 === 0 && navigator.vibrate) {
        navigator.vibrate(10);
      }

      if (progress >= 100) {
        this.completeLongPress();
      }
    }, 100);
  }

  /**
   * End the press before completion
   */
  endPress() {
    if (!this.pressStarted) return;
    this.cancelPress();
  }

  /**
   * Cancel the current press
   */
  cancelPress() {
    if (this.pressTimer) {
      clearInterval(this.pressTimer);
      this.pressTimer = null;
    }

    const shadowRoot = this.shadowRoot;
    if (!shadowRoot) return;

    const progressIndicator = shadowRoot.querySelector('.progress-indicator');
    const card = shadowRoot.querySelector('.chore-card');

    if (progressIndicator instanceof HTMLElement) {
      progressIndicator.style.width = '0%';
      progressIndicator.classList.remove('active');
    }

    if (card) {
      card.classList.remove('pressing');
    }

    this.pressStarted = false;
  }

  /**
   * Check if the touch has moved too far (for cancellation)
   * @param {TouchEvent} e - The touch event
   */
  checkTouchMove(e) {
    if (!this.pressStarted || !this.touchStartY || !e.touches || !e.touches[0]) return;

    const touchY = e.touches[0].clientY;
    const yDiff = Math.abs(touchY - this.touchStartY);

    // Cancel if moved more than 20px
    if (yDiff > 20) {
      this.cancelPress();
    }
  }

  /**
   * Complete the long press and toggle the completion status
   */
  completeLongPress() {
    this.cancelPress();

    if (!this._chore) return;

    // Toggle completion state
    this._chore.completed = !this._chore.completed;

    const shadowRoot = this.shadowRoot;
    if (!shadowRoot) return;

    // Update the appearance
    const card = shadowRoot.querySelector('.chore-card');
    const statusIndicator = shadowRoot.querySelector('.status-indicator');

    if (!card || !statusIndicator) return;

    if (this._chore.completed) {
      card.classList.add('completed');
      statusIndicator.textContent = '✅';

      // Add completion animation
      statusIndicator.classList.add('completed-animation');

      // Add stronger vibration feedback for completion
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 100]);
      }
    } else {
      card.classList.remove('completed');
      statusIndicator.textContent = '❌';

      // Add vibration feedback for un-completion
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }

    // Prevent interactions during animation
    this.animationActive = true;
    setTimeout(() => {
      if (statusIndicator) {
        statusIndicator.classList.remove('completed-animation');
      }
      this.animationActive = false;
    }, 500);

    // Dispatch an event to notify parent components
    this.dispatchEvent(
      new CustomEvent('completion-changed', {
        detail: { choreId: this._chore.id, completed: this._chore.completed },
      })
    );
  }
}

// Register the custom element
customElements.define('chore-card', ChoreCard);

export default ChoreCard;
