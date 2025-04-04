# AjiMall Development Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

## Tech Stack
- Astro (SSR mode) with Vue for interactive components
- Tailwind CSS with DaisyUI for styling
- PocketBase for backend
- TypeScript for type safety
- Nanostores for state management

## Code Style Guidelines
- **Formatting**: Follow existing indentation (2 spaces)
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Types**: Use TypeScript types for all variables, parameters, and return values
- **Imports**: Group imports by source (framework, lib, local)
- **Components**: Vue SFCs for interactive components, Astro components for static
- **Error Handling**: Use try/catch blocks when working with PocketBase
- **Store Access**: Use nanostores for shared state, persistent when needed
- **File Structure**: Follow the existing organization pattern in /src

## Architecture
- SSR pages with hydrated Vue components where needed
- RESTful API calls to PocketBase backend
- Cart state persisted in local storage via nanostores