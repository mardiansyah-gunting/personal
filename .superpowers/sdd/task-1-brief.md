### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `public/favicon.ico` (placeholder)

**Interfaces:**
- Consumes: nothing
- Produces: working Astro project scaffold

- [ ] **Step 1: Create package.json**

```json
{
  "name": "portfolio-web",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mardiansyah-gunting.github.io',
  base: '/portfolio-web',
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 4: Create src/env.d.ts**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 5: Create placeholder favicon**

Run: `touch public/favicon.ico`

- [ ] **Step 6: Install dependencies and verify build**

Run: `npm install && npm run build`
Expected: `astro build` completes without errors, `dist/` directory created.

