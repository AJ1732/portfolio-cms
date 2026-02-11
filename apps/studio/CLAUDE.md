# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Sanity Studio project for a portfolio website. Sanity is a headless CMS with a real-time content editing environment. The studio connects to project ID `rlnho0c7` on the `production` dataset.

## Development Commands

### Running the Studio
- `pnpm dev` - Start development server (hot reload enabled)
- `pnpm start` - Start production server
- `pnpm build` - Build the studio for production

### Deployment
- `pnpm deploy` - Deploy the studio to Sanity's hosting
- `pnpm deploy-graphql` - Deploy GraphQL schema to Sanity

### Schema Management
- `npx sanity schema deploy` - Deploy schema changes to the cloud (run after modifying schema files)

### Code Quality
- `npx eslint .` - Run linting (uses @sanity/eslint-config-studio)
- `npx prettier --write .` - Format code

## Project Structure

### Configuration Files
- `sanity.config.ts` - Main Sanity configuration (plugins, schema registration, project settings)
- `sanity.cli.ts` - CLI configuration (project ID, dataset, deployment settings)
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration using Sanity's studio preset

### Schema System
- `schemaTypes/` - Schema type definitions
- `schemaTypes/index.ts` - Schema type export point (currently empty, add new types here)

All schema types must be:
1. Created as separate files in `schemaTypes/` using `defineType()` from `'sanity'`
2. Exported from `schemaTypes/index.ts`
3. Will be automatically picked up by the config via `schema: { types: schemaTypes }`

### Static Assets
- `static/` - Static files served with the studio

## Architecture Notes

### Sanity Studio Plugins
Currently configured with:
- `structureTool()` - Default structure builder for organizing content
- `visionTool()` - Query testing and debugging tool (GROQ playground)

### Code Style
Prettier configuration enforces:
- No semicolons
- Single quotes
- No bracket spacing
- 100 character line width

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module preservation for modern ESM/CJS compatibility
- JSX preserved (not transformed)

## Sanity-Specific Patterns

### Schema Creation Workflow
1. Create schema file in `schemaTypes/` (e.g., `schemaTypes/project.ts`)
2. Use `defineType()` from `'sanity'` to define the schema
3. Export default from the file
4. Import and add to array in `schemaTypes/index.ts`
5. Run `npx sanity schema deploy` to deploy changes

### Auto-Updates
Studio has auto-updates enabled in deployment configuration - the studio will automatically update to the latest compatible version.

## Important Constraints

- Schema changes require deployment via `npx sanity schema deploy` to be available in the API
- Project uses pnpm as package manager - use pnpm commands, not npm or yarn
- All schema definitions must use the `defineType()` helper for proper type inference
