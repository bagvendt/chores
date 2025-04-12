#!/bin/bash

# Install dependencies
npm install

# Initialize Husky
npx husky install

# Make pre-commit hook executable
chmod +x .husky/pre-commit

echo "Setup complete! Code quality tools are now installed and configured."
echo "The following tools will run automatically on commit:"
echo "- ESLint: Checks for code quality and potential issues"
echo "- Prettier: Enforces consistent code formatting"
echo "- TypeScript: Validates JSDoc type annotations" 