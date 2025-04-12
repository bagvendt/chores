# Chores Tracker

A web-based application for children to track their chores and earn points for completing them. This application is designed for use on an iPad in landscape mode.

## Features

- View and start different routine types (Morning, Before Dinner, After Dinner, Bedtime)
- Check off chores as they are completed
- Earn points for completing chores
- Spend points in the shop to purchase rewards
- Data automatically saved to browser local storage

## Technical Details

- Built with modern ES6 JavaScript
- Uses web components for modularity and encapsulation
- Uses the Web Transitions API for smooth page transitions
- Designed for iPad in landscape mode (but works on other devices)
- Simple, no-framework approach

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Start tracking chores!

## File Structure

```
├── index.html              # Main HTML file
├── app/                    # Application code
│   ├── main.js             # Main application logic
│   ├── data.js             # Sample data for routines and shop items
│   ├── components/         # Web components
│   │   ├── ChoreCard.js    # Component for displaying a chore
│   │   ├── RoutineCard.js  # Component for displaying a routine
│   │   └── ShopItem.js     # Component for displaying a shop item
│   └── styles/             # CSS styles
│       └── main.css        # Main application styles
└── img/                    # Images for chores and shop items
```

## Development

This project follows these principles:
- Simplicity over complexity
- Explicit beats implicit
- No DRY (Don't Repeat Yourself) constraint
- No SOLID constraint

## License

MIT 