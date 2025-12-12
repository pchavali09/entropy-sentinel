# Contributing to Entropy Sentinel

First off, thank you for considering contributing to Entropy Sentinel! 🛡️

This extension is built on a **"Security Zero"** philosophy. Our goal is to catch secrets in real-time without compromising privacy or performance.

## ⚡ Quick Start (How to Build)

1.  **Clone the repo:**
    ```bash
    git clone git clone https://github.com/pchavali09/entropy-sentinel.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the Extension:**
    Press `F5` in VS Code. This will open a new window with the extension loaded.

## 🐛 Fixing False Positives (The Most Common Contribution)

Did the tool flag a variable that isn't a secret? (e.g., a color hex `#FFFFFF` or a git hash). This is usually a Regex tuning issue.

**Where the logic lives:**
👉 [`src/analysis/scanner.ts`](src/analysis/scanner.ts)

**How to fix it:**
1.  Open `src/analysis/scanner.ts`.
2.  Locate the `scanText` function.
3.  If the variable name caused the issue, check the `SENSITIVE_KEYS` regex.
4.  If the value caused the issue, check `calculateShannonEntropy` in `src/analysis/entropy.ts`.
5.  **Add a test case** in `src/test/suite/extension.test.ts` to prove your fix works.

## 🚫 Performance Rules (Read Before Submitting)

* **No Heavy Dependencies:** We do not accept PRs that add large npm packages (e.g., no `lodash`, no `moment`). This tool must run on every keystroke.
* **Zero Network Calls:** The scanner logic must remain 100% offline. Any PR adding network requests to the scanning engine will be rejected immediately.

## 📜 Coding Style
* We use TypeScript.
* We use Strict Typing (No implicit `any`).
* Run `npm run lint` before pushing.

Thank you for making Vibe Coding safer! 🚀