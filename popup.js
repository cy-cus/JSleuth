function renderResults(data) {
  // Links
  document.getElementById("links").textContent =
    data.links.length ? data.links.join("\n") : "- none -";

  // Endpoints
  document.getElementById("endpoints").textContent =
    data.endpoints.length ? data.endpoints.join("\n") : "- none -";

  // JS Endpoints
  document.getElementById("jsfiles").textContent =
    data.jsfiles.length ? data.jsfiles.join("\n") : "- none -";

  // Modules
  document.getElementById("modules").textContent =
    data.modules.length ? data.modules.join("\n") : "- none -";

  // Secrets
  if (data.secrets.length) {
    document.getElementById("secrets").textContent = data.secrets
      .map(s => `[${s.type}] ${s.value}`)
      .join("\n");
  } else {
    document.getElementById("secrets").textContent = "- none -";
  }

  // Counts
  document.getElementById("count").textContent =
    `Links: ${data.links.length} | Endpoints: ${data.endpoints.length} | JS Files: ${data.jsfiles.length} | Modules: ${data.modules.length} | Secrets: ${data.secrets.length}`;
}

function formatResults(data) {
  let text = "";

  text += "Links (" + data.links.length + ")\n";
  text += data.links.length ? data.links.join("\n") : " - none -";
  text += "\n\n";

  text += "Endpoints (" + data.endpoints.length + ")\n";
  text += data.endpoints.length ? data.endpoints.join("\n") : " - none -";
  text += "\n\n";

  text += "JS Files (" + data.jsfiles.length + ")\n";
  text += data.jsfiles.length ? data.jsfiles.join("\n") : " - none -";
  text += "\n\n";

  text += "Modules (" + data.modules.length + ")\n";
  text += data.modules.length ? data.modules.join("\n") : " - none -";
  text += "\n\n";

  text += "Secrets (" + data.secrets.length + ")\n";
  if (data.secrets.length) {
    text += data.secrets.map(s => `[${s.type}] ${s.value}`).join("\n");
  } else {
    text += " - none -";
  }

  return text.trim();
}

// 🔹 Listen for results coming from content.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "scanResults") {
    chrome.storage.local.set({ scanResults: message.data }, () => {
      renderResults(message.data);
    });
  }
});

document.getElementById("scan").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"]
    });
  });
});

document.getElementById("copy").addEventListener("click", () => {
  chrome.storage.local.get("scanResults", ({ scanResults }) => {
    if (scanResults) {
      navigator.clipboard.writeText(formatResults(scanResults));
    }
  });
});

document.getElementById("download").addEventListener("click", () => {
  chrome.storage.local.get("scanResults", ({ scanResults }) => {
    if (scanResults) {
      const blob = new Blob([formatResults(scanResults)], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "jsleuth_results.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  });
});

document.getElementById("filter").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  chrome.storage.local.get("scanResults", ({ scanResults }) => {
    if (scanResults) {
      const filtered = {
        links: scanResults.links.filter(x => x.toLowerCase().includes(term)),
        endpoints: scanResults.endpoints.filter(x => x.toLowerCase().includes(term)),
        jsfiles: scanResults.jsfiles.filter(x => x.toLowerCase().includes(term)),
        modules: scanResults.modules.filter(x => x.toLowerCase().includes(term)),
        secrets: scanResults.secrets.filter(s =>
          (s.value || "").toLowerCase().includes(term) || (s.type || "").toLowerCase().includes(term)
        )
      };
      renderResults(filtered);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("scanResults", ({ scanResults }) => {
    if (scanResults) {
      renderResults(scanResults);
    }
  });

  chrome.storage.local.get("autoScan", ({ autoScan }) => {
    document.getElementById("autoScan").checked = autoScan || false;
    if (autoScan) {
      document.getElementById("scan").click();
    }
  });
});

document.getElementById("autoScan").addEventListener("change", (e) => {
  chrome.storage.local.set({ autoScan: e.target.checked });
});
