/**
 * RoutineCard web component
 * Displays a routine as a full-image card (child-friendly, no text)
 */
class RoutineCard extends HTMLElement {
  constructor() {
    super();
    this._routine = null;
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Set the routine data for this component
   * @param {object} routine - The routine data to display
   */
  set routine(routine) {
    this._routine = routine;
    this.render();
  }

  /**
   * Get the routine data for this component
   * @returns {object} The routine data
   */
  get routine() {
    return this._routine;
  }

  /**
   * Component connected callback
   */
  connectedCallback() {
    if (this._routine) {
      this.render();
    }

    // Listen for attribute changes
    this.attributeChangedCallback();
  }

  /**
   * Define which attributes to observe
   */
  static get observedAttributes() {
    return ['today'];
  }

  /**
   * Handle attribute changes
   */
  attributeChangedCallback() {
    if (this._routine) {
      this.render();
    }
  }

  /**
   * Get the completion percentage for this routine
   * @returns {number} Completion percentage
   */
  getCompletionPercentage() {
    if (!this._routine || !this._routine.chores || this._routine.chores.length === 0) return 0;

    const completedChores = this._routine.chores.filter((chore) => chore.completed).length;
    return Math.round((completedChores / this._routine.chores.length) * 100);
  }

  /**
   * Render the routine card
   */
  render() {
    if (!this._routine) return;

    // Get whether this is today's routine
    const isToday = this.hasAttribute('today');
    const completionPercentage = this.getCompletionPercentage();

    // Ensure we have an image URL with fallback to a placeholder
    const placeholderImage = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f2f2f2' width='100' height='100'/%3E%3Cpath fill='%23aaaaaa' d='M30 50L50 30L70 50L50 70Z'/%3E%3C/svg%3E`;
    const imageUrl = this._routine.imageUrl || placeholderImage;

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        
        .routine-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          aspect-ratio: 1 / 1;
          display: flex;
          flex-direction: column;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        
        .routine-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        
        .routine-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        
        .today-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          background-color: #FF5722;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        
        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 8px;
          background-color: rgba(76, 175, 80, 0.7);
          width: ${completionPercentage}%;
        }
      </style>
      
      <div class="routine-card">
        <img class="routine-image" src="${imageUrl}" alt="${this._routine.title}">
        ${isToday ? '<div class="today-indicator"></div>' : ''}
        ${completionPercentage > 0 ? '<div class="progress-bar"></div>' : ''}
      </div>
    `;

    const cardElement = this.shadowRoot.querySelector('.routine-card');
    if (cardElement) {
      cardElement.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('routine-click', {
            detail: { routine: this._routine },
            bubbles: true,
            composed: true,
          })
        );
      });

      // Prevent context menu from appearing on long press
      cardElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
    }
  }
}

// Define the element
customElements.define('routine-card', RoutineCard);

export default RoutineCard;
