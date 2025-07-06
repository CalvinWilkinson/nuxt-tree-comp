---
applyTo: '**'
---

### 🔄 Project Awareness & Context
- **Project Purpose**: This project provides a website interface to make it easy to manage assets for game development teams.
                       For example, we can have the artist on the team create the art and then upload it.  They can then mark assets
                       as the asset that will be used in the game.  Asset locking, versioning, search, comparing, and more will be part
                       of the application.  There will also bea different piece of software that will automatically sync the assets
                       to the developers machine.  This way, the developer does not have to manually download the assets and place
                       them in the correct place.  NOTE: The syncing piece of software is not part of this project/repository.
                       Team collaboration will also be a key feature to control different types of functionality and access to assets
                       based on the team member's role.  Other assets such as audio, video, and text files will also be supported.
- **Project Type**: Nuxt 3 with TypeScript, Vue 3, and Tailwind CSS.
- **Package Manager**: PNPM
- **UI Framework**: PrimeVue
- **File Structure**:
    ```plaintext
    nuxt-playground/
    ├── .github/
    │   └── copilot-instructions.md
    ├── .nuxt/                     # Nuxt build output (generated)
    ├── .output/                   # Production build output (generated)
    ├── assets/                    # Static assets (CSS, images, etc.)
    ├── components/                # Vue components
    ├── composables/               # Vue composables
    ├── layouts/                   # Nuxt layouts
    ├── middleware/                # Route middleware
    ├── pages/                     # File-based routing pages
    ├── plugins/                   # Nuxt plugins
    ├── public/                    # Static files served at root
    ├── server/                    # Server-side code
    │   └── api/                   # API routes
    ├── utils/                     # Utility functions
    ├── .gitignore                 # Git ignore rules
    ├── app.vue                    # Main app component
    ├── nuxt.config.ts            # Nuxt configuration
    ├── package.json              # Dependencies and scripts
    ├── pnpm-lock.yaml            # PNPM lock file
    ├── README.md                 # Project documentation
    └── tsconfig.json             # TypeScript configuration  
    ```

### 🧱 Code Structure & Modularity

### 🧪 Testing & Reliability

### ✅ Task Completion

### 📎 Style & Conventions
- Use meaningful variable and function names.
- Write modular, reusable code.
- Include comments and documentation where necessary.
- In CSS, use double quotes for strings.
- In typescript, use double quotes for strings.

### 📚 Documentation & Explainability

### 🧠 AI Behavior Rules
- **Never hallucinate libraries or functions** – only use known, verified npm and JSR packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.
- **Always use PNPM** for a package manager.
