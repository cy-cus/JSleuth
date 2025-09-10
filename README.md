# 🕵️‍♂️ JSleuth – Discover Hidden Endpoints, Modules & Secrets in JavaScript

**JSleuth** is a Chrome Extension for bug bounty hunters, pentesters, and security researchers.  
It scans JavaScript files (both auto-loaded in web pages and manually provided URLs) to extract **endpoints, modules, and potential secrets**.  

---

## ✨ Features
- 🔍 **Auto Scan** – Extracts endpoints, modules, and secrets from JavaScript loaded in the current page.  
- 📝 **Manual Scan** – Paste one or multiple JS URLs and scan them directly.  
- 📑 **Secrets Detection** – Detects AWS keys, Google API keys, JWTs, private keys, and generic tokens.  
- 📦 **Module Extraction** – Finds `import` and `require()` dependencies.  
- 📂 **Unified Results View** – Links, endpoints, JS files, modules, and secrets all neatly organized.  
- 📤 **Export Options** – Copy results to clipboard or download them as `.txt`.  
- 🔄 **Auto Scan Mode** – Automatically scans pages when you open the popup.  
- ⚡ **Filter Results** – Quickly search through findings.  

---

## 🚀 Installation
1. Clone or download this repository.  
   ```bash
   git clone https://github.com/cy-cus/jsleuth.git
   cd jsleuth
   ```
2. Open Chrome and go to:  
   ```
   chrome://extensions/
   ```
3. Enable **Developer mode**.  
4. Click **Load unpacked** and select the project folder.  
5. Done 🎉 JSleuth is now installed.  

---

## 🛠️ Usage
1. Open any target website.  
2. Click the JSleuth icon in your extensions bar.  
3. Use:  
   - **Scan Current Page** → extracts endpoints, JS files, modules, and secrets from scripts on the page.  
   - **Manual Scan** → paste external JS URLs (one per line) to scan them directly.  
4. Filter, copy, or download results for further analysis.  

---

## 📸 Screenshots (TODO)
<img width="885" height="1202" alt="image" src="https://github.com/user-attachments/assets/f868e2d6-ff33-46bc-ba41-c1d98a7db1e1" />


---

## ⚡ Example Output
```text
Links (77)
https://api.example.com/v1/user
https://cdn.example.com/lib.js

Endpoints (297)
/api/v1/login
/api/v1/logout

JS Files (62)
/chunks/pages/home-abc123.js
/scripts/vendor.js

Modules (4)
axios
lodash

Secrets (3)
[AWS Key] AKIA1234567890EXAMPLE
[Google API Key] AIzaSyD12345EXAMPLEKEY
[JWT] eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛡️ Disclaimer
This tool is intended for **educational and security research purposes only**.  
Do not use JSleuth against systems you don’t own or do not have explicit permission to test.  

---

## 📌 Roadmap
- [ ] Add more secret detection regex patterns  
- [ ] Improve UI styling  
- [ ] Option to export results in JSON format  
- [ ] Dark/light mode toggle  

---

## 🤝 Contributing
Pull requests are welcome! If you’d like to add new secret detectors, improve parsing, or enhance UI/UX, open an issue or PR.  

---

## 📜 License
MIT License © 2025 
