# 🛡️ Entropy Sentinel
> **Secure Vibe Coding.** The open-source bodyguard for your clipboard.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security: Local](https://img.shields.io/badge/Security-100%25_Local-green)](https://github.com/YOUR_USERNAME/entropy-sentinel/blob/main/src/analysis/scanner.ts)
[![VS Code](https://img.shields.io/badge/VS%20Code-Marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=YOUR_ID.entropy-sentinel)

## 📦 Installation
Currently in Beta. **[👉 Click here for Installation Instructions](INSTALL.md)**

AI coding assistants are great, but they love to suggest code like `const apiKey = "sk_123..."`.
**Entropy Sentinel** watches your editor in real-time and warns you before you commit secrets.

---

## ✨ Features

### 1. 🛑 Real-Time Secret Detection
We use **Shannon Entropy** analysis to detect random strings (API keys, tokens, salts) instantly.
* **High Risk:** Fading **Red Glow** (Entropy > 4.5 or Sensitive Variable Name).
* **Weak Keys:** Fading **Yellow Glow** (Detects dummy values like `123456` or `changeMe`).

### 2. 🧠 Context-Aware Scanning
Unlike dumb linters, we understand variable names:
* `const page_id = "a8b9c..."` → **Safe** (Ignored).
* `const stripe_key = "a8b9c..."` → **Danger** (Flagged).

### 3. 💡 The "One-Click Vault"
Don't break your flow to create a `.env` file.
1.  Click the Lightbulb 💡 on any flagged secret.
2.  Select **"Move to .env"**.
3.  **Done.** We create the file, append the key, and refactor your code to `process.env.KEY`.

---

## 🔒 Privacy & Security (Zero Data Exfiltration)

**We take this seriously.**
* **100% Local:** All entropy calculation happens on your machine.
* **No Analytics:** We do not track your keystrokes.
* **No Cloud:** We do not send your code to any server.

Don't believe us? **Audit the code:**
👉 [View the Scanner Logic](src/analysis/scanner.ts)

---

## 🚀 Contributing
Found a False Positive? (e.g., it flagged your CSS hex code).
Please open an issue or submit a PR! See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License
MIT