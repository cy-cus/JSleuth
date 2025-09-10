(function () {
    const scripts = Array.from(document.scripts).map(s => s.src).filter(Boolean);

    const regexLinks = /https?:\/\/[^\s"'<>]+/g;
    const regexEndpoints = /\/[A-Za-z0-9_\-\/\.?=&]+/g;
    const regexImports = /import\s+[\w*{}\s,]+\s+from\s+["']([^"']+)["']/g;
    const regexRequires = /require\(\s*["']([^"']+)["']\s*\)/g;

    const regexSecrets = {
        "AWS Key": /AKIA[0-9A-Z]{16}/g,
        "Google API Key": /AIza[0-9A-Za-z\-_]{35}/g,
        "JWT": /eyJ[A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+/g,
        "Generic Token": /[a-zA-Z0-9_\-]{32,45}/g,
        "Private Key": /-----BEGIN (RSA|EC|PGP) PRIVATE KEY-----/g
    };

    let results = {
        links: new Set(),
        endpoints: new Set(),
        jsfiles: new Set(),
        modules: new Set(),
        secrets: []
    };

    async function scanJS(url) {
        try {
            const resp = await fetch(url);
            const text = await resp.text();

            // Links
            (text.match(regexLinks) || []).forEach(m => results.links.add(m));

            // Endpoints vs JS files
            (text.match(regexEndpoints) || []).forEach(m => {
                if (m.endsWith(".js")) results.jsfiles.add(m);
                else results.endpoints.add(m);
            });

            // Modules (imports/requires)
            let m;
            while ((m = regexImports.exec(text)) !== null) {
                results.modules.add(m[1]);
            }
            while ((m = regexRequires.exec(text)) !== null) {
                results.modules.add(m[1]);
            }

            // Secrets
            for (const [type, regex] of Object.entries(regexSecrets)) {
                const matches = text.match(regex) || [];
                matches.forEach(val => results.secrets.push({ type, value: val }));
            }

        } catch (e) {
            if (e instanceof TypeError && e.message.includes("Failed to fetch")) {
                console.warn("[JSleuth] Skipped external JS (CORS):", url);
            } else {
                console.error("[JSleuth] Error fetching:", url, e);
            }
        }
    }

    // Scan all discovered scripts
    Promise.all([...new Set(scripts)].map(url => scanJS(url)))
        .then(() => {
            const payload = {
                links: Array.from(results.links),
                endpoints: Array.from(results.endpoints),
                jsfiles: Array.from(results.jsfiles),
                modules: Array.from(results.modules),
                secrets: results.secrets
            };

            console.log("[JSleuth] Results:", payload);

            try {
                chrome.runtime.sendMessage({ type: "scanResults", data: payload });
            } catch (e) {
                console.warn("[JSleuth] No active listener for results");
            }
        });
})();
