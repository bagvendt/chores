/**
 * ShopItem web component
 * Displays a shop item that can be purchased with points
 */
class ShopItem extends HTMLElement {
  constructor() {
    super();
    this._item = null;
    this._userPoints = 0;
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Set the shop item data for this component
   * @param {object} item - The shop item data to display
   */
  set item(item) {
    this._item = item;
    this.render();
  }

  /**
   * Get the shop item data for this component
   * @returns {object} The shop item data
   */
  get item() {
    return this._item;
  }

  /**
   * Set the user's available points
   * @param {number} points - The user's available points
   */
  set userPoints(points) {
    this._userPoints = points;
    this.render();
  }

  /**
   * Component connected callback
   */
  connectedCallback() {
    if (this._item) {
      this.render();
    }
  }

  /**
   * Render the shop item
   */
  render() {
    if (!this._item) return;

    const canPurchase = this._userPoints >= this._item.points;
    const disabledClass = canPurchase ? '' : 'disabled';

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        
        .shop-item {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        
        .shop-item:not(.disabled):hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .shop-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .shop-image {
          width: 100%;
          height: auto;
          margin-bottom: 10px;
          border-radius: 5px;
        }
        
        .shop-title {
          font-size: 1.2rem;
          margin: 0 0 10px 0;
        }
        
        .points-cost {
          font-weight: bold;
          color: #4CAF50;
          margin-bottom: 15px;
        }
        
        .purchase-button {
          background-color: #2196F3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
          width: 100%;
        }
        
        .purchase-button:not(:disabled):hover {
          background-color: #0b7dda;
        }
        
        .purchase-button:disabled {
          background-color: #cccccc;
          color: #666666;
          cursor: not-allowed;
        }
      </style>
      
      <div class="shop-item ${disabledClass}">
        <img draggable="false" class="shop-image" src="${this._item.imageUrl}" alt="${this._item.title}">
        <h3 class="shop-title">${this._item.title}</h3>
        <div class="points-cost">${this._item.points} point</div>
        <button class="purchase-button" ${canPurchase ? '' : 'disabled'}>
          ${canPurchase ? 'Køb' : 'Ikke nok point'}
        </button>
      </div>
    `;

    // Add event listener for the purchase button
    if (canPurchase && this.shadowRoot) {
      const purchaseButton = this.shadowRoot.querySelector('.purchase-button');
      if (purchaseButton) {
        purchaseButton.addEventListener('click', () => {
          this.dispatchEvent(
            new CustomEvent('purchase', {
              detail: { itemId: this._item.id, cost: this._item.points },
            })
          );
        });
      }

      // Prevent context menu on the shop item
      const shopItem = this.shadowRoot.querySelector('.shop-item');
      if (shopItem) {
        shopItem.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });
      }
    }
  }
}

// Register the custom element
customElements.define('shop-item', ShopItem);

export default ShopItem;
