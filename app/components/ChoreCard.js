/**
 * ChoreCard web component
 * Displays a single chore with its details and allows toggling completion status
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
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        
        .chore-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .chore-card.completed {
          opacity: 0.7;
          background-color: rgba(76, 175, 80, 0.1);
        }
        
        .chore-image {
          width: 100%;
          height: auto;
          margin-bottom: 10px;
          border-radius: 5px;
        }
        
        .chore-title {
          font-size: 1.2rem;
          margin: 0 0 10px 0;
        }
        
        .chore-details {
          margin-bottom: 15px;
          font-size: 0.9rem;
        }
        
        .time {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        
        .points {
          font-weight: bold;
          color: #4CAF50;
        }
        
        .completion-status {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }
        
        .completion-checkbox {
          margin-right: 8px;
          transform: scale(1.2);
        }
      </style>
      
      <div class="chore-card ${completedClass}">
        <img class="chore-image" src="${this._chore.imageUrl}" alt="${this._chore.title}">
        <h3 class="chore-title">${this._chore.title}</h3>
        
        <div class="chore-details">
          <div class="time">Tid: ${this._chore.estimatedTime} min</div>
          <div class="points">Point: ${this._chore.points}</div>
        </div>
        
        <div class="completion-status">
          <input type="checkbox" class="completion-checkbox" ${this._chore.completed ? 'checked' : ''}>
          <span>${this._chore.completed ? 'Fuldført' : 'Markér som fuldført'}</span>
        </div>
      </div>
    `;

    // Add event listener for the checkbox
    this.shadowRoot.querySelector('.completion-checkbox').addEventListener('change', (e) => {
      const completed = e.target.checked;
      this._chore.completed = completed;
      
      // Update the appearance
      const card = this.shadowRoot.querySelector('.chore-card');
      if (completed) {
        card.classList.add('completed');
        this.shadowRoot.querySelector('.completion-status span').textContent = 'Fuldført';
      } else {
        card.classList.remove('completed');
        this.shadowRoot.querySelector('.completion-status span').textContent = 'Markér som fuldført';
      }
      
      // Dispatch an event to notify parent components
      this.dispatchEvent(new CustomEvent('completion-changed', {
        detail: { choreId: this._chore.id, completed }
      }));
    });
  }
}

// Register the custom element
customElements.define('chore-card', ChoreCard);

export default ChoreCard; 