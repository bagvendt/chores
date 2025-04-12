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

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .chore-card {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
          cursor: pointer;
          text-align: center;
          position: relative;
          overflow: hidden;
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
        }
        
        .chore-image {
          width: 100%;
          height: auto;
          max-height: 150px;
          object-fit: contain;
          border-radius: 5px;
        }
        
        .status-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 1.5rem;
          z-index: 10;
        }
        
        .progress-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 5px;
          background-color: #4CAF50;
          width: 0%;
          transition: width 0.1s linear;
        }
        
        @keyframes completedAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .completed-animation {
          animation: completedAnimation 0.5s ease;
        }
      </style>
      
      <div class="chore-card ${completedClass}">
        <div class="status-indicator">${statusEmoji}</div>
        <img class="chore-image" src="${this._chore.imageUrl}" alt="${this._chore.title}">
        <div class="progress-indicator"></div>
      </div>
    `;

    const card = this.shadowRoot.querySelector('.chore-card');

    // Add touch/mouse events for long press
    card.addEventListener('mousedown', this.startPress.bind(this));
    card.addEventListener('touchstart', this.startPress.bind(this), { passive: true });

    card.addEventListener('mouseup', this.endPress.bind(this));
    card.addEventListener('mouseleave', this.cancelPress.bind(this));
    card.addEventListener('touchend', this.endPress.bind(this));
    card.addEventListener('touchcancel', this.cancelPress.bind(this));
    card.addEventListener('touchmove', this.checkTouchMove.bind(this), { passive: true });
  }

  /**
   * Start the press timer for long press
   * @param {Event} e - The event object
   */
  startPress(e) {
    if (this.animationActive) return;

    const progressIndicator = this.shadowRoot.querySelector('.progress-indicator');
    const card = this.shadowRoot.querySelector('.chore-card');

    // Add pressing class for visual feedback
    card.classList.add('pressing');

    this.pressStarted = true;

    // Store touch position if it's a touch event
    if (e.type === 'touchstart' && e.touches && e.touches[0]) {
      this.touchStartY = e.touches[0].clientY;
    }

    // Start timing for long press
    let progress = 0;
    this.pressTimer = setInterval(() => {
      progress += 100 / (this.longPressDuration / 100); // Increment by percentage per 100ms
      if (progressIndicator) {
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

    const progressIndicator = this.shadowRoot.querySelector('.progress-indicator');
    const card = this.shadowRoot.querySelector('.chore-card');

    if (progressIndicator) {
      progressIndicator.style.width = '0%';
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

    // Update the appearance
    const card = this.shadowRoot.querySelector('.chore-card');
    const statusIndicator = this.shadowRoot.querySelector('.status-indicator');

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
