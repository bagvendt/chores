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

## Development

This project follows these principles:
- Simplicity over complexity
- Explicit beats implicit
- No DRY (Don't Repeat Yourself) constraint
- No SOLID constraint

### Code Quality Tools

The project includes the following code quality tools:

- **ESLint**: Checks for code quality and potential issues
- **TypeScript**: Validates JSDoc type annotations without requiring TypeScript
- **Prettier**: Enforces consistent code formatting
- **Husky**: Runs pre-commit hooks to ensure code quality before commits

### Running the Tools

```bash
# Install dependencies
npm install

# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check types using TypeScript (based on JSDoc)
npm run typecheck
```

All tools are configured to run automatically on pre-commit, ensuring code quality.

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

## License

MIT 