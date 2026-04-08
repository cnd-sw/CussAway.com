# CussAway — Project Overview

**CussAway** is a secure, anonymous, and educational web application designed to help travelers identify and understand potentially hostile or abusive language in foreign environments. By promoting linguistic awareness, the platform equips users to recognize escalations, stay calm, and de-escalate situations appropriately while traveling. 

The application features a fully modern, Gen-Z & Developer-friendly glassmorphism UI, a robust client-side fuzzy search, and a curated repository of phrases sorted by severity levels. It is built as a serverless Single Page Application (SPA) with a lightweight, secure architecture.

Below is the project summary detailed across three core perspectives:

---

## 1. Project Manager (Execution & Lifecycle View)

**Objective**: Deliver a secure, cross-platform (Web & Android via Capacitor) educational tool that scales easily without backend overhead, ensuring a strict timeline and high code quality.

* **Scope & Deliverables**:
  * Implement a fast, responsive frontend architecture.
  * Deliver an 18+ Age Gate to comply with explicit educational content guidelines.
  * Facilitate an anonymous user-submission pipeline via Web3Forms.
  * Ensure mobile-readiness for Android deployment.
* **Risk Management & Security**: 
  * Ensure zero exposure of sensitive data (strict environment variable management).
  * Implement frontend security standards including session-based rate-limits (max 5 submissions per 15 min), input sanitization limits (XSS prevention), and production console locking to prevent data leaks.
* **Resource Optimization**: Minimized server costs by using a completely serverless architecture with static JSON data stores, avoiding database maintenance entirely.

---

## 2. Product Manager (User Value & Market View)

**Objective**: Create an engaging, premium, and highly intuitive product that resonates with younger demographics (Gen-Z/Gen-Alpha) and tech-savvy users while solving a genuine traveler safety problem.

* **Target Audience**: Travelers, digital nomads, and language enthusiasts (Aged 18+).
* **Value Proposition**: "Understand what is being said around you." CussAway turns a taboo subject into a critical traveler safety and linguistic awareness tool.
* **Key Features & UX**:
  * **Ultra-Modern Aesthetic**: Features a highly aesthetic "Developer/Gen-Z" dark mode with glassmorphism, subtle neon cyber-glows, and bouncy micro-animations to maximize user retention and perceived value.
  * **Frictionless Discovery**: Global dynamic search that allows users to instantly filter through available languages or drill deep into specific localized terminology.
  * **Anonymous Contributions**: Users can seamlessly suggest new regional phrases securely without needing to create an account, passively sourcing community-driven data.

---

## 3. Developer (Architecture & Technical View)

**Objective**: Build a high-performance, maintainable, and strictly secure local-first frontend application.

* **Tech Stack**: 
  * **Core**: React 19, Vite (esbuild bundling).
  * **Styling**: Vanilla CSS utilizing modern CSS variables, `backdrop-filter` glass architectures, and modern fonts (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`). 
  * **Search Engine**: `fuse.js` for highly performant, client-side fuzzy string matching across transliterations and context strings.
  * **Mobile Integration**: `@capacitor/core` & `@capacitor/android` for wrapping the web build directly into an Android `.apk`.
* **Data Architecture**:
  * Completely static data fetching architecture (`/public/data/*.json`) allowing Vercel/Netlify edge caching for instant load times globally.
  * Serverless API interaction using `fetch` to `Web3Forms` for form submissions.
* **Security Implementations**:
  * **Rate Limiting**: Custom `sessionStorage`-based rolling window rate limiter protecting the Web3Forms endpoint.
  * **Input Sanitization**: Custom Regex stripping against XSS vectors (`<script>`, `onLoad=`, etc.) along with strict `maxLength` truncation before memory storage or API transmission.
  * **Scrubbed Environment**: Application exclusively relies on Vite's `import.meta.env` system for secret injection at build time. No tokens exist in git history.
