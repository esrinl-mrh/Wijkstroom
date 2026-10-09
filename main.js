import { CONFIG } from "./config.js";

const statusEl = document.querySelector("#status");
const spinnerEl = document.querySelector("#spinner");
const errorEl = document.querySelector("#error");
const errorMessageEl = document.querySelector("#errorMessage");
const retryEl = document.querySelector("#retry");

let identityManager;

retryEl.addEventListener("click", () => {
  identityManager?.destroyCredentials();
  window.location.replace(new URL("./", window.location.href).href);
});

start();

async function start() {
  try {
    validateConfig();
    setStatus("ArcGIS Online SDK laden…");

    const [OAuthInfo, esriId, Portal, esriRequest] = await globalThis.$arcgis.import([
      "@arcgis/core/identity/OAuthInfo.js",
      "@arcgis/core/identity/IdentityManager.js",
      "@arcgis/core/portal/Portal.js",
      "@arcgis/core/request.js"
    ]);
    identityManager = esriId;

    const oauthInfo = new OAuthInfo({
      appId: CONFIG.appId,
      portalUrl: CONFIG.portalUrl,
      flowType: "authorization-code",
      popup: false,
      authNamespace: CONFIG.authNamespace
    });
    esriId.registerOAuthInfos([oauthInfo]);

    setStatus("Aanmelding bij ArcGIS Online controleren…");
    await esriId.getCredential(`${CONFIG.portalUrl}/sharing`);

    setStatus("Wijkstroom-account ophalen…");
    const portal = new Portal({ url: CONFIG.portalUrl, authMode: "immediate" });
    await portal.load();
    const user = portal.user;

    if (!user?.username) throw new RouterError("NO_USER", "Geen aangemelde ArcGIS-gebruiker ontvangen.");
    if (user.orgId !== CONFIG.expectedOrgId) return safeRedirect(CONFIG.noAccessUrl);
    if (normalize(user.username) === normalize(CONFIG.admin.username)) return safeRedirect(CONFIG.admin.destination);

    setStatus("Wijkstroom-organisatie bepalen…");
    // SDK request gebruikt de bij IdentityManager geregistreerde OAuth-credential.
    // /community/self retourneert voor de huidige gebruiker onder andere groups[].
    const selfResponse = await esriRequest(`${CONFIG.portalUrl}/sharing/rest/community/self`, {
      query: { f: "json" },
      responseType: "json"
    });
    const self = selfResponse.data;
    if (!self?.username || self.username !== user.username) {
      throw new RouterError("SELF_MISMATCH", "De portalgebruiker en /community/self komen niet overeen.");
    }

    const groups = Array.isArray(self.groups) ? self.groups : [];
    const matches = groups.filter(group => group?.id && Object.hasOwn(CONFIG.groupRoutes, group.id));

    if (matches.length === 0) return safeRedirect(CONFIG.noAccessUrl);
    if (matches.length > 1) return safeRedirect(CONFIG.configurationErrorUrl);

    const route = CONFIG.groupRoutes[matches[0].id];
    setStatus(`${route.name}-omgeving openen…`);
    safeRedirect(route.destination);
  } catch (error) {
    showError(error);
  }
}

function validateConfig() {
  const values = [CONFIG.appId, CONFIG.expectedOrgId, ...Object.keys(CONFIG.groupRoutes), ...Object.values(CONFIG.groupRoutes).map(r => r.destination)];
  if (values.some(v => !v || String(v).includes("VUL_"))) {
    throw new RouterError("CONFIG_INCOMPLETE", "De routerconfiguratie bevat nog invulwaarden.");
  }
  const ids = Object.keys(CONFIG.groupRoutes);
  if (new Set(ids).size !== ids.length) throw new RouterError("DUPLICATE_GROUP", "Een groeps-ID komt dubbel voor.");
}

function normalize(value) { return String(value ?? "").trim().toLocaleLowerCase("nl-NL"); }

function allowedDestinations() {
  return new Set([CONFIG.admin.destination, CONFIG.noAccessUrl, CONFIG.configurationErrorUrl, ...Object.values(CONFIG.groupRoutes).map(r => r.destination)]);
}

function safeRedirect(destination) {
  if (!allowedDestinations().has(destination)) throw new RouterError("UNSAFE_REDIRECT", "Niet-toegestane redirect geblokkeerd.");
  window.location.replace(destination);
}

function setStatus(message) { statusEl.textContent = message; }

function showError(error) {
  console.error("Wijkstroom routerfout", { code: error?.code ?? "UNKNOWN", message: error?.message ?? "Onbekende fout" });
  spinnerEl.hidden = true;
  errorEl.hidden = false;
  errorMessageEl.textContent = error?.code === "CONFIG_INCOMPLETE"
    ? "De router is nog niet volledig geconfigureerd. Neem contact op met het Wijkstroom-beheer."
    : "De Wijkstroom-omgeving kon niet veilig worden bepaald. Probeer opnieuw of neem contact op met het Wijkstroom-beheer.";
}

class RouterError extends Error {
  constructor(code, message) { super(message); this.name = "RouterError"; this.code = code; }
}
