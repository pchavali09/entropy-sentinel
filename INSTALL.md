# 📥 How to Install Entropy Sentinel (Beta)

Since this extension is currently in **Private Beta**, it is not yet available on the public VS Code Marketplace. You will need to install it manually using the `.vsix` file.

## Prerequisites
* **Visual Studio Code** (Version 1.80.0 or higher recommended)
* No other dependencies required (Node.js is **not** needed).

---

## 🚀 Step 1: Download the Build
1. Go to the **[Releases Page](../../releases)** of this repository.
2. Find the latest version (e.g., `v0.0.1`).
3. Under **Assets**, click to download the file named:
   📄 **`entropy-sentinel-0.0.1.vsix`**

---

## 📦 Step 2: Install into VS Code

1. Open Visual Studio Code.
2. Click on the **Extensions** icon in the left Sidebar (or press `Cmd+Shift+X` / `Ctrl+Shift+X`).
3. Click the **Three Dots (...)** menu at the top-right of the Extensions panel.
4. Select **"Install from VSIX..."** from the dropdown menu.



5. Locate the `.vsix` file you downloaded in Step 1 and select it.

---

## ✅ Step 3: Verify Installation

1. Once installed, you should see a notification: *"Completed installing Entropy Sentinel."*
2. **Reload VS Code** (close and reopen) to ensure the extension is fully active.
3. Create a test file (e.g., `test.js`) and paste this dummy secret to verify it works:
   ```javascript
   const apiKey = "sk_live_123456789";
4. You should see a Red Box appear around the key string. 🛡️
   
## ❓ Troubleshooting
"Error: Incompatible VS Code Version"

This means your VS Code is too old. Please update VS Code via Code > Check for Updates.

"File is corrupted"

Re-download the .vsix file from the Releases page. Sometimes browsers interrupt the download.