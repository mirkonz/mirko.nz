# AI Coding Agent Instructions for mirko.nz

Welcome to the `mirko.nz` codebase! This document provides essential guidance for AI coding agents to be productive in this project. Please follow the outlined conventions and workflows to ensure consistency and maintainability.

## Project Overview

This project is a personal website built with the following technologies:

- **Nuxt.js (Vue)**: A framework for building server-side rendered Vue.js applications. (Version: ^4.0.3)
- **TailwindCSS**: A utility-first CSS framework. (Version: ^4.1.12)
- **Netlify**: Used for hosting and deployment.

The website is live at [mirko.nz](https://mirko.nz/).

### Codebase Structure

- `app/`: Contains the main application files.
  - `assets/`: Static assets like CSS and icons.
  - `components/`: Vue components used across the application.
  - `layouts/`: Layout templates for pages.
  - `pages/`: Vue files corresponding to routes.
  - `plugins/`: Nuxt plugins for extending functionality (e.g., `posthog.client.ts` for analytics).
- `public/`: Publicly accessible static files.
- `nuxt.config.ts`: Nuxt configuration file.
- `netlify.toml`: Netlify configuration file.

### Key Patterns and Conventions

1. **Component Organization**:
   - Components are stored in `app/components/`.
   - Follow Vue.js best practices for component structure and naming.

2. **Styling**:
   - Use TailwindCSS for styling. Avoid inline styles unless necessary.
   - Global styles are defined in `app/assets/css/main.css`.

3. **Routing**:
   - Routes are auto-generated based on the `app/pages/` directory.
   - Use Nuxt's `asyncData` or `fetch` methods for data fetching in pages.

4. **Plugins**:
   - Plugins are initialized in the `app/plugins/` directory.
   - Example: `posthog.client.ts` is used for analytics integration (PostHog.js Version: ^1.260.3).

5. **TypeScript**:
   - Use TypeScript by default for all new files and components.

### Developer Workflows

#### Build and Run

- Install dependencies: `pnpm install` (Package Manager: pnpm@10.15.0)
- Start development server: `pnpm dev`
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`

#### Testing and Debugging

- No explicit testing framework is set up. Add tests as needed.
- Use browser developer tools and Nuxt's debugging features for troubleshooting.

#### Deployment

- The project is deployed on Netlify.
- Configuration is managed via `netlify.toml`.

### External Dependencies

- **PostHog**: Analytics integration via `posthog.client.ts` (Version: ^1.260.3).
- **Netlify**: Hosting and deployment.
- **Vue**: Core framework (Version: ^3.5.20).
- **ESLint**: Linting tool (Version: ^9.34.0).
- **Prettier**: Code formatter (Version: ^3.6.2).

### Notes for AI Agents

- Ensure all new components follow the established directory structure and naming conventions.
- When modifying styles, prefer TailwindCSS utilities over custom CSS.
- Document any new patterns or workflows introduced.
- Use the exact versions of dependencies specified in `package.json` when providing code examples or suggestions.
- Use TypeScript by default for all new files and components.

For any questions or clarifications, refer to the `README.md` or the Nuxt.js documentation.

---

This document is a living guide. Update it as the project evolves to ensure it remains accurate and helpful.
