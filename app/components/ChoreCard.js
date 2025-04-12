/**
 * ChoreCard web component
 * Displays a single chore with just an image
 */
class ChoreCard extends HTMLElement {
  constructor() {
    super();
    this._chore = null;
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Set the chore data for this component
   * @param {Object} chore - The chore data to display
   */
  set chore(chore) {
    this._chore = chore;
    this.render();
  }

  /**
   * Get the chore data for this component
   * @returns {Object} The chore data
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
        }
        
        .chore-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .chore-card.completed {
          background-color: rgba(76, 175, 80, 0.1);
        }
        
        .chore-image {
          width: 100%;
          height: auto;
          max-height: 150px;
          object-fit: contain;
          border-radius: 5px;
        }
      </style>
      
      <div class="chore-card ${completedClass}">
        <img class="chore-image" src="${this._chore.imageUrl}" alt="${this._chore.title}">
      </div>
    `;

    // Add click event listener to toggle completion
    this.shadowRoot.querySelector('.chore-card').addEventListener('click', () => {
      // Toggle completion state
      this._chore.completed = !this._chore.completed;
      
      // Update the appearance
      const card = this.shadowRoot.querySelector('.chore-card');
      if (this._chore.completed) {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }
      
      // Dispatch an event to notify parent components
      this.dispatchEvent(new CustomEvent('completion-changed', {
        detail: { choreId: this._chore.id, completed: this._chore.completed }
      }));
    });
  }
}

// Register the custom element
customElements.define('chore-card', ChoreCard);

export default ChoreCard; 