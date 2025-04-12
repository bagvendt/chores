/**
 * RoutineCard web component
 * Displays a routine with summary information about its chores
 */
class RoutineCard extends HTMLElement {
  constructor() {
    super();
    this._routine = null;
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Set the routine data for this component
   * @param {Object} routine - The routine data to display
   */
  set routine(routine) {
    this._routine = routine;
    this.render();
  }

  /**
   * Get the routine data for this component
   * @returns {Object} The routine data
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
  }

  /**
   * Get the total points for this routine
   * @returns {number} Total points
   */
  getTotalPoints() {
    if (!this._routine || !this._routine.chores) return 0;
    return this._routine.chores.reduce((total, chore) => total + chore.points, 0);
  }

  /**
   * Get the total earned points for this routine
   * @returns {number} Total earned points
   */
  getEarnedPoints() {
    if (!this._routine || !this._routine.chores) return 0;
    return this._routine.chores
      .filter(chore => chore.completed)
      .reduce((total, chore) => total + chore.points, 0);
  }

  /**
   * Get the total estimated time for this routine
   * @returns {number} Total time in minutes
   */
  getTotalTime() {
    if (!this._routine || !this._routine.chores) return 0;
    return this._routine.chores.reduce((total, chore) => total + chore.estimatedTime, 0);
  }

  /**
   * Get the completion percentage for this routine
   * @returns {number} Completion percentage
   */
  getCompletionPercentage() {
    if (!this._routine || !this._routine.chores || this._routine.chores.length === 0) return 0;
    
    const completedChores = this._routine.chores.filter(chore => chore.completed).length;
    return Math.round((completedChores / this._routine.chores.length) * 100);
  }

  /**
   * Render the routine card
   */
  render() {
    if (!this._routine) return;

    const totalPoints = this.getTotalPoints();
    const earnedPoints = this.getEarnedPoints();
    const totalTime = this.getTotalTime();
    const completionPercentage = this.getCompletionPercentage();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .routine-card {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        
        .routine-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .routine-title {
          font-size: 1.4rem;
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .routine-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-size: 0.8rem;
          color: #666;
        }
        
        .detail-value {
          font-size: 1.1rem;
          font-weight: bold;
        }
        
        .points-value {
          color: #4CAF50;
        }
        
        .progress-container {
          margin-top: 15px;
        }
        
        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }
        
        .progress-bar {
          height: 10px;
          background-color: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background-color: #4CAF50;
          width: ${completionPercentage}%;
          transition: width 0.3s ease;
        }
      </style>
      
      <div class="routine-card">
        <h2 class="routine-title">${this._routine.title}</h2>
        
        <div class="routine-details">
          <div class="detail-item">
            <span class="detail-label">Pligter</span>
            <span class="detail-value">${this._routine.chores.length}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Tid</span>
            <span class="detail-value">${totalTime} min</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Samlede Point</span>
            <span class="detail-value points-value">${totalPoints}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Optjente Point</span>
            <span class="detail-value points-value">${earnedPoints}</span>
          </div>
        </div>
        
        <div class="progress-container">
          <div class="progress-label">
            <span>Fremskridt</span>
            <span>${completionPercentage}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
    `;

    // Add click event listener
    this.shadowRoot.querySelector('.routine-card').addEventListener('click', () => {
      this.dispatchEvent(new Event('click'));
    });
  }
}

// Register the custom element
customElements.define('routine-card', RoutineCard);

export default RoutineCard; 