// content.js

(function () {
  const scripts = Array.from(document.scripts).map(s => s.src).filter(Boolean);

  const regexLinks = /https?:\/\/[^\s"'<>]+/g;
  const regexEndpoints = /\/[A-Za-z0-9_\-\/\.?=&]+/g;
  const regexImports = /import\s+[\w*{}\s,]+\s+from\s+["']([^"']+)["']/g;
  const regexRequires = /require\(\s*["']([^"']+)["']\s*\)/g;

  // Extended secret patterns
  const regexSecrets = {
    "Cloudinary": /cloudinary:\/\/.*/g,

    "Firebase URL": /.*firebaseio\.com/g,
    "Firebase API Key": /AIza[0-9A-Za-z\-_]{35}/g,

    "Slack Token (legacy)": /(xox[pboa]-[0-9]{12}-[0-9]{12}-[0-9]{12}-[a-z0-9]{32})/g,
    "Slack App Token": /xapp-[0-9A-Za-z-]{32,48}/g,
    "Slack User Token": /xoxa-[0-9A-Za-z-]{32,64}/g,

    "RSA private key": /-----BEGIN RSA PRIVATE KEY-----/g,
    "SSH (DSA) private key": /-----BEGIN DSA PRIVATE KEY-----/g,
    "SSH (EC) private key": /-----BEGIN EC PRIVATE KEY-----/g,
    "PGP private key block": /-----BEGIN PGP PRIVATE KEY BLOCK-----/g,

    "Amazon AWS Access Key ID": /AKIA[0-9A-Z]{16}/g,
    "Amazon AWS Secret Key": /(?i)aws(.{0,20})?(?-i)['\\\"][0-9a-zA-Z\\/+=]{40}['\\\"]/g,
    "Amazon MWS Auth Token": /amzn\.mws\.[0-9a-f\-]{36}/g,
    "AWS Session Token": /FwoGZXIvYXdzEP\/\/\/\/\/\/\/\/[A-Za-z0-9\+\/]{200,}/g,

    "GitHub PAT (old)": /[gG]ithub.*['|\"][0-9a-zA-Z]{35,40}['|\"]/g,
    "GitHub Personal Access Token": /gh[pousr]_[0-9a-zA-Z]{36}/g,
    "GitHub Fine-Grained Token": /github_pat_[0-9a-zA-Z_]{82}/g,

    "GitLab Personal Access Token": /glpat-[0-9a-zA-Z\-_]{20}/g,
    "GitLab Runner Registration Token": /GR1348941[a-zA-Z0-9\-_]{20,40}/g,

    "Bitbucket App Password": /bbp_[a-zA-Z0-9]{24}/g,

    "Generic API Key": /(?i)(api[_-]?key|apikey)['\"=:\s]+[0-9a-zA-Z]{16,45}/g,
    "Generic Secret": /(?i)(secret|secret[_-]?key)['\"=:\s]+[0-9a-zA-Z]{16,45}/g,

    "Google API Key": /AIza[0-9A-Za-z\-_]{35}/g,
    "Google OAuth Access Token": /ya29\.[0-9A-Za-z\-_]+/g,
    "Google OAuth Refresh Token": /1\/\/[0-9A-Za-z\-_]+/g,
    "Google Service Account": /"type": "service_account"/g,
    "Google Client ID": /[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com/g,

    "OpenAI API Key": /sk-[a-zA-Z0-9]{48}/g,
    "OpenAI Org ID": /org-[a-zA-Z0-9]{24}/g,

    "Heroku API Key": /[hH]eroku[a-zA-Z0-9_-]*[0-9A-F]{8}-([0-9A-F]{4}-){3}[0-9A-F]{12}/g,

    "MailChimp API Key": /[0-9a-f]{32}-us[0-9]{1,2}/g,
    "Mailgun API Key": /key-[0-9a-zA-Z]{32}/g,

    "Password in URL": /[a-zA-Z]{3,10}:\/\/[^/\s:@]{3,20}:[^/\s:@]{3,20}@.{1,100}[\"'\s]/g,

    "PayPal Braintree Access Token": /access_token\$(production|sandbox)\$[0-9a-z]{16}\$[0-9a-f]{32}/g,

    "Stripe API Key": /sk_(live|test)_[0-9a-zA-Z]{24}/g,
    "Stripe Restricted API Key": /rk_(live|test)_[0-9a-zA-Z]{24}/g,

    "Square Access Token": /sq0atp-[0-9A-Za-z\-_]{22}/g,
    "Square OAuth Secret": /sq0csp-[0-9A-Za-z\-_]{43}/g,

    "Twilio API Key": /SK[0-9a-fA-F]{32}/g,
    "Twilio Account SID": /AC[0-9a-fA-F]{32}/g,

    "Twitter Access Token": /[1-9][0-9]+-[0-9a-zA-Z]{40}/g,
    "Twitter OAuth Token": /AAAAA[0-9A-Za-z%]{35,100}/g,

    "Microsoft / Azure Tenant ID": /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
    "Microsoft / Azure Client Secret": /(?i)(azure[_-]?secret|client[_-]?secret)['\"=:\s]+[0-9a-zA-Z\-_]{32,}/g,
    "Microsoft Graph Token": /eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}/g,

    "Vercel Token": /vc\.proj\.[a-zA-Z0-9]{24}\.[a-zA-Z0-9]{64}/g,
    "Netlify Token": /nf_[0-9a-zA-Z]{20,50}/g,
    "Render API Key": /rnd_[a-zA-Z0-9]{40}/g,

    "Supabase Anon Key": /eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}/g,
    "Supabase Service Role Key": /eyJ[A-Za-z0-9-_]{100,}/g,

    "Shopify Access Token": /shpat_[a-fA-F0-9]{32}/g,
    "Shopify Custom App API Key": /shpca_[a-fA-F0-9]{32}/g,
    "Shopify Private App Password": /shppa_[a-fA-F0-9]{32}/g,

    "HashiCorp Vault Token": /hvs\.[a-zA-Z0-9\-_]{24,64}/g,
    "Terraform Cloud Token": /tfe\.[a-zA-Z0-9]{32}/g,

    "Kubernetes Service Account Token": /eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}/g,

    "Atlassian API Token": /ATATTOKEN[a-zA-Z0-9]{32,64}/g,

    "JWT (generic)": /eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}/g
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
      const resp = await fetch(url, { mode: "no-cors" });
      const text = await resp.text();

      // Extract
      (text.match(regexLinks) || []).forEach(m => results.links.add(m));
      (text.match(regexEndpoints) || []).forEach(m => results.endpoints.add(m));
      (text.match(regexImports) || []).forEach(m => results.modules.add(m));
      (text.match(regexRequires) || []).forEach(m => results.modules.add(m));

      // Secret matches
      Object.entries(regexSecrets).forEach(([type, rgx]) => {
        const matches = text.match(rgx) || [];
        matches.forEach(val => results.secrets.push({ type, value: val }));
      });

    } catch (e) {
      console.error("Failed to fetch:", url, e);
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
      chrome.runtime.sendMessage({ type: "scanResults", data: payload });
    });
})();
