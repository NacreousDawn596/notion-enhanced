# Notion Enhanced (v0.15.0)

**Customise the all-in-one productivity workspace Notion.**

[![docs](https://img.shields.io/badge/docs-read%20online-blue.svg)](https://notion-enhancer.github.io/) 
[![version](https://img.shields.io/badge/version-v0.15.0-success.svg)](#)

A cross-platform app and browser extension ecosystem that natively hooks into Notion, providing advanced theming, powerful integrations, and bespoke UI modifications.

---

## Features

- **Platform Agnostic**: Runs as a browser extension inside any Chromium or Firefox environment, or fully natively on Linux desktops using the built-in Electron wrapper.
- **Robust API Engine**: Re-engineered core APIs with exponential web backoff to transparently handle network failures, rate-limiting, and severe backend drops.
- **Fail-Safe Injections**: All UI modifications and integrations are fully wrapped in safe-load boundaries. One broken snippet will *never* crash your primary Notion experience.
- **Advanced Integrations**: Connect directly to specialized external tools like automated Quick Notes or immersive icon sets.

## Installation Methods

### Natively Wrapped Desktop App (Linux/Nix)

For Linux users, `notion-enhanced` ships as a fully native, system-integrated Electron desktop application complete with `.desktop` menu tracking, persistent login state, and custom badging.

**Run Directly (No Installation):**
```bash
nix run github:NacreousDawn596/notion-enhanced
```

**Install to User Profile (Gnome/KDE/etc):**
```bash
nix profile install github:NacreousDawn596/notion-enhanced
```

### Browser Extension

You can inject the enhancer seamlessly into Notion web sessions.

**Build Requirements:**
Node.js >= 18.x.x is required.
```bash
git clone https://github.com/NacreousDawn596/notion-enhanced.git
cd notion-enhanced
npm install
npm run build
```
The unpacked extension will be compiled into a zip file at `dist/notion-enhanced-0.15.0.zip`.

**Loading the Extension:**
1. **Unzip** the build (`unzip dist/notion-enhanced-0.15.0.zip -d dist/`).
2. **Chrome/Chromium**:
   - Go to `chrome://extensions`.
   - Enable **Developer mode** (top right toggle).
   - Click **Load unpacked**.
   - Select the `dist/` folder in this project directory.
3. **Firefox**:
   - Go to `about:debugging#/runtime/this-firefox`.
   - Click **Load Temporary Add-on...**.
   - Select the `manifest.json` file inside the `dist/` folder.

---

## Development & Testing

This project incorporates a deeply integrated CI/CD validation pipeline to guarantee application stability before distribution.

**Run all Multistage Validation Tests:**
```bash
npm test
```
*This command executes an intense 5-stage native `node:test` suite verifying Core internals, Extension/Integration boundaries, API handlers, and bash scripting pipelines.*

**Format and Code Quality Checks:**
```bash
npm run format && npm run lint
```
*Auto-enforces strict Prettier & ESLint standardization rules across the codebase.*
