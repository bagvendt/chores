@echo off
echo Installing dependencies...
call npm install

echo Initializing Husky...
call npx husky install

echo.
echo Setup complete! Code quality tools are now installed and configured.
echo The following tools will run automatically on commit:
echo - ESLint: Checks for code quality and potential issues
echo - Prettier: Enforces consistent code formatting
echo - TypeScript: Validates JSDoc type annotations 