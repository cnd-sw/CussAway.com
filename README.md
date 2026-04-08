# 🦢 CussAway

**CussAway** is a secure, anonymous, and educational linguistic awareness application. It helps travelers recognize and identify potentially hostile or abusive language in foreign environments to promote safety, de-escalation, and situational awareness.

## 🚀 Getting Started

### 1. Prerequisites
*   **Node.js** (v18 or higher)
*   **npm** or **yarn**
*   **Xcode** (for iOS testing)
*   **Android Studio** (for Android testing)

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Setup
The project uses **Web3Forms** for anonymous word suggestions.
1.  Create a `.env` file in the root directory.
2.  Add your access key:
    ```env
    VITE_WEB3FORMS_KEY=your_access_key_here
    ```
    *(You can get a free key at [web3forms.com](https://web3forms.com/))*

---

## 💻 Web Development
Run the development server locally:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Mobile Development

### Syncing Changes
Every time you make changes to the web code and want to see them on mobile, you must build the project and sync:
```bash
npm run build
npx cap sync
```

### iOS (macOS only)
To open the project in Xcode:
```bash
npx cap open ios
```
*   Select your simulator/device in Xcode and click **Run**.

### Android
To open the project in Android Studio:
```bash
npx cap open android
```
*   Click **Run** in Android Studio to deploy to an emulator or physical device.

---

## 🔒 Security & Privacy
*   **No Tracking**: No cookies, no trackers, and no personal data logging.
*   **Local-First**: Age verification is stored only in `sessionStorage` (clears when tab closes).
*   **Anonymity**: All word suggestions are sent without IP or metadata logging.
*   **Scrape Protection**: Includes measures to block automated bots and crawlers.

---

## ⚖️ Legal
This is an educational resource for **Adults (18+)** only. Content is documented for awareness and safety purposes, not for endorsement. 

**License:** MIT
**Copyright:** © 2026 the CussAway Development Team
