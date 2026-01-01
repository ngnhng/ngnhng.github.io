Below is a tiny **plain HTML + CSS + JS** “OAuth2 Authorization Code flow” _simulator_ (no backend). It visually walks through:

1. Authorization request
2. User approves (consent) → **authorization code**
3. Client exchanges code → **access token + refresh token** (back-channel)
4. Client calls Resource Server with access token
5. Resource Server “verifies” token via Auth Server (introspection simulation)
   (+ access token expires quickly so you can test refresh)

> ⚠️ This is **educational only**. Real OAuth uses real redirects, HTTPS, and secrets are never safe in browser JS.

---

## 1) `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OAuth2 Toy Simulator (HTML/CSS/JS)</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="topbar">
      <div>
        <h1>OAuth2 Toy Simulator</h1>
        <p class="sub">
          A tiny, single-page demo of the <b>Authorization Code</b> flow
          (simulated).
        </p>
      </div>
      <div class="pill-row">
        <span class="pill">Frontend channel</span>
        <span class="pill pill-alt">Backend channel</span>
      </div>
    </header>

    <main class="layout">
      <!-- FRONTEND CHANNEL -->
      <section class="channel channel-frontend">
        <div class="channel-title">Frontend channel</div>

        <div class="grid">
          <!-- Resource Owner -->
          <div class="card">
            <div class="card-title">Resource Owner (User)</div>

            <div class="field">
              <label>Username</label>
              <input id="username" value="alice" autocomplete="off" />
            </div>

            <div class="field">
              <label>Password</label>
              <input
                id="password"
                type="password"
                value="wonderland"
                autocomplete="off"
              />
            </div>

            <div class="hint">
              Demo credentials: <code>alice / wonderland</code>
            </div>

            <div class="row">
              <button id="btn1" class="btn primary">
                1) Authorization request
              </button>
              <button id="reset" class="btn">Reset</button>
            </div>

            <div class="mini">
              <b>Consent</b>
              <div class="consent">
                <label class="check">
                  <input id="consent" type="checkbox" checked />
                  Allow “Toy Client App” to read your profile
                </label>
              </div>
            </div>
          </div>

          <!-- Client App -->
          <div class="card">
            <div class="card-title">Client App</div>

            <div class="kv">
              <div><span>client_id</span><code id="clientIdView"></code></div>
              <div>
                <span>redirect_uri</span><code id="redirectView"></code>
              </div>
              <div><span>scope</span><code id="scopeView"></code></div>
              <div><span>state</span><code id="stateView"></code></div>
            </div>

            <div class="row">
              <button id="btn3" class="btn primary" disabled>
                3) Request tokens (code → tokens)
              </button>
              <button id="btn4" class="btn primary" disabled>
                4) Access protected resource
              </button>
            </div>

            <div class="row">
              <button id="btnRefresh" class="btn" disabled>
                Use refresh token
              </button>
              <button id="toggleSecrets" class="btn">
                Show/hide client secret
              </button>
            </div>

            <div class="mini">
              <b>Client state</b>
              <pre id="clientState" class="pre"></pre>
            </div>
          </div>

          <!-- Authorization Server (front-facing screens) -->
          <div class="card">
            <div class="card-title">Authorization Server</div>

            <div class="mini">
              <b>What the user sees</b>
              <div id="authScreen" class="screen">
                Click “1) Authorization request” to start.
              </div>
            </div>

            <div class="row">
              <button id="btn2" class="btn primary" disabled>
                2) Approve delegation
              </button>
            </div>

            <div class="mini">
              <b>Issued items</b>
              <pre id="authState" class="pre"></pre>
            </div>
          </div>

          <!-- Resource Server -->
          <div class="card">
            <div class="card-title">Resource Server (API)</div>

            <div class="row">
              <button id="btn5" class="btn primary" disabled>
                5) Verify access token
              </button>
            </div>

            <div class="mini">
              <b>API response</b>
              <pre id="apiState" class="pre"></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- BACKEND CHANNEL (log) -->
      <section class="channel channel-backend">
        <div class="channel-title">
          Backend channel (simulated HTTP traffic)
        </div>

        <div class="log-wrap">
          <div class="log-head">
            <div class="log-title">Message log</div>
            <div class="log-actions">
              <button id="copyLog" class="btn small">Copy log</button>
              <button id="clearLog" class="btn small">Clear</button>
            </div>
          </div>
          <div id="log" class="log"></div>
        </div>
      </section>
    </main>

    <footer class="footer">
      Tip: access tokens expire fast in this demo so you can try refresh.
    </footer>

    <script src="app.js"></script>
  </body>
</html>
```

---

## 2) `styles.css`

```css
:root {
  --bg: #fbfbfd;
  --ink: #111827;
  --muted: #6b7280;
  --card: #ffffff;
  --line: #e5e7eb;
  --soft: #f3f4f6;
  --accent: #2563eb;
  --accent2: #059669;
  --danger: #dc2626;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica,
    Arial;
}

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: var(--sans);
  background: var(--bg);
  color: var(--ink);
}

.topbar {
  padding: 18px 18px 10px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
h1 {
  margin: 0;
  font-size: 20px;
}
.sub {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
  max-width: 60ch;
}

.pill-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.pill {
  font-size: 12px;
  padding: 6px 10px;
  border: 1px dashed var(--line);
  border-radius: 999px;
  background: #fff;
}
.pill-alt {
  border-color: #c7f9d8;
  background: #ecfdf5;
}

.layout {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
}

.channel {
  background: linear-gradient(0deg, #fff, #fff);
  border: 2px dashed #d1d5db;
  border-radius: 14px;
  padding: 14px;
}
.channel-frontend {
  border-color: #d1d5db;
}
.channel-backend {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.channel-title {
  font-weight: 700;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(12, 1fr);
}

.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
  min-height: 160px;
}

.card-title {
  font-weight: 700;
  margin-bottom: 10px;
}

.card:nth-child(1) {
  grid-column: span 3;
}
.card:nth-child(2) {
  grid-column: span 3;
}
.card:nth-child(3) {
  grid-column: span 3;
}
.card:nth-child(4) {
  grid-column: span 3;
}

@media (max-width: 980px) {
  .card {
    grid-column: span 12 !important;
  }
}

.field {
  margin-bottom: 10px;
}
label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 4px;
}
input {
  width: 100%;
  padding: 10px 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
}

.row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.btn {
  border: 1px solid var(--line);
  background: #fff;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}
.btn.small {
  padding: 7px 10px;
  font-size: 12px;
  border-radius: 10px;
}
.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.btn.primary {
  border-color: color-mix(in srgb, var(--accent) 35%, var(--line));
  background: color-mix(in srgb, var(--accent) 10%, #fff);
}
.btn.primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--accent) 14%, #fff);
}
.hint {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}
code {
  font-family: var(--mono);
  font-size: 12px;
  background: var(--soft);
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid var(--line);
}

.kv {
  display: grid;
  gap: 8px;
}
.kv > div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}
.kv span {
  color: var(--muted);
  font-size: 12px;
}

.mini {
  margin-top: 12px;
}
.pre {
  margin: 8px 0 0;
  padding: 10px;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  font-family: var(--mono);
  font-size: 12px;
  overflow: auto;
  min-height: 84px;
}

.screen {
  margin-top: 8px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
  font-size: 13px;
  color: var(--ink);
}
.screen b {
  color: var(--accent);
}

.check {
  font-size: 13px;
  color: var(--ink);
  display: flex;
  gap: 8px;
  align-items: center;
}
.consent {
  margin-top: 6px;
}

.log-wrap {
  background: #fff;
  border: 1px solid #d1fae5;
  border-radius: 14px;
  overflow: hidden;
}
.log-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #d1fae5;
  background: #ecfdf5;
}
.log-title {
  font-weight: 800;
  font-size: 13px;
}
.log {
  padding: 10px 12px;
  max-height: 280px;
  overflow: auto;
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.4;
  background: #fff;
}
.log .line {
  padding: 6px 0;
  border-bottom: 1px dashed #eef2f7;
}
.log .meta {
  color: var(--muted);
}
.log .ok {
  color: var(--accent2);
  font-weight: 700;
}
.log .bad {
  color: var(--danger);
  font-weight: 700;
}
.log .arrow {
  color: var(--muted);
}

.footer {
  padding: 10px 14px 18px;
  color: var(--muted);
  font-size: 12px;
}
```

---

## 3) `app.js`

```js
// OAuth2 Toy Simulator (single-page, no backend).
// Everything is simulated in-memory for learning purposes.

const $ = (id) => document.getElementById(id);

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString();
}

function rand(n = 20) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < n; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

function logLine(type, text, extra = "") {
  const el = document.createElement("div");
  el.className = "line";
  const meta = `<span class="meta">[${nowTime()}]</span> `;
  el.innerHTML = `${meta}${text} ${
    extra ? `<span class="meta">${extra}</span>` : ""
  }`;
  $("log").prepend(el);
}

function ok(text) {
  return `<span class="ok">${text}</span>`;
}
function bad(text) {
  return `<span class="bad">${text}</span>`;
}
function arrow(text) {
  return `<span class="arrow">${text}</span>`;
}

function base64UrlEncode(obj) {
  const json = typeof obj === "string" ? obj : JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function makeFakeJwt(payload) {
  // Not a real JWT signature. Purely for visualization.
  const header = { alg: "none", typ: "JWT" };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.${rand(16)}`;
}

function decodeFakeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const json = decodeURIComponent(
      escape(atob(parts[1].replaceAll("-", "+").replaceAll("_", "/")))
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** ---------------------------
 * Simulated "databases"
 * -------------------------- */
const db = {
  users: {
    alice: {
      password: "wonderland",
      profile: {
        id: "u_1001",
        name: "Alice",
        plan: "Free",
        favoriteColor: "Blue",
      },
    },
  },
  clients: {
    "toy-client": {
      secret: "toy-client-secret",
      redirect_uri: "https://client.example/callback",
    },
  },
  authCodes: new Map(), // code -> { client_id, username, scope, exp, redirect_uri }
  accessTokens: new Map(), // token -> { client_id, username, scope, exp }
  refreshTokens: new Map(), // refresh -> { client_id, username, scope }
};

/** ---------------------------
 * Simulated OAuth servers
 * -------------------------- */
const authorizationServer = {
  authorize({
    client_id,
    redirect_uri,
    scope,
    state,
    username,
    password,
    consent,
  }) {
    logLine(
      "info",
      `${arrow("Client → Auth")}: GET /authorize`,
      `client_id=${client_id}, scope=${scope}, state=${state}`
    );

    const client = db.clients[client_id];
    if (!client) return { error: "unauthorized_client" };
    if (client.redirect_uri !== redirect_uri)
      return { error: "invalid_redirect_uri" };

    const user = db.users[username];
    if (!user || user.password !== password)
      return { error: "access_denied", reason: "bad_credentials" };
    if (!consent)
      return { error: "access_denied", reason: "user_denied_consent" };

    const code = "code_" + rand(18);
    const exp = Date.now() + 60_000; // code valid 60s
    db.authCodes.set(code, { client_id, username, scope, redirect_uri, exp });

    logLine(
      "info",
      `${arrow("Auth → Browser")}: 302 Redirect to redirect_uri`,
      `?code=${code}&state=${state}`
    );

    return { code, state };
  },

  token({
    grant_type,
    code,
    redirect_uri,
    client_id,
    client_secret,
    refresh_token,
  }) {
    logLine(
      "info",
      `${arrow("Client → Auth")}: POST /token`,
      `grant_type=${grant_type}`
    );

    const client = db.clients[client_id];
    if (!client) return { error: "invalid_client" };
    if (client.secret !== client_secret)
      return { error: "invalid_client", reason: "bad_secret" };

    if (grant_type === "authorization_code") {
      const record = db.authCodes.get(code);
      if (!record) return { error: "invalid_grant", reason: "unknown_code" };
      if (record.redirect_uri !== redirect_uri)
        return { error: "invalid_grant", reason: "redirect_mismatch" };
      if (record.exp < Date.now())
        return { error: "invalid_grant", reason: "code_expired" };

      // one-time use
      db.authCodes.delete(code);

      const accessExp = Date.now() + 15_000; // short expiry so refresh is easy to see
      const accessPayload = {
        iss: "https://auth.example",
        sub: record.username,
        aud: "https://resource.example",
        scope: record.scope,
        client_id,
        exp: Math.floor(accessExp / 1000),
      };
      const access_token = makeFakeJwt(accessPayload);

      const refresh_token_out = "refresh_" + rand(26);

      db.accessTokens.set(access_token, {
        client_id,
        username: record.username,
        scope: record.scope,
        exp: accessExp,
      });
      db.refreshTokens.set(refresh_token_out, {
        client_id,
        username: record.username,
        scope: record.scope,
      });

      logLine(
        "info",
        `${arrow("Auth → Client")}: 200 OK`,
        ok("issued access_token + refresh_token")
      );

      return {
        token_type: "Bearer",
        access_token,
        expires_in: Math.floor((accessExp - Date.now()) / 1000),
        refresh_token: refresh_token_out,
        scope: record.scope,
      };
    }

    if (grant_type === "refresh_token") {
      const rr = db.refreshTokens.get(refresh_token);
      if (!rr)
        return { error: "invalid_grant", reason: "unknown_refresh_token" };
      if (rr.client_id !== client_id)
        return { error: "invalid_grant", reason: "client_mismatch" };

      const accessExp = Date.now() + 15_000;
      const accessPayload = {
        iss: "https://auth.example",
        sub: rr.username,
        aud: "https://resource.example",
        scope: rr.scope,
        client_id,
        exp: Math.floor(accessExp / 1000),
      };
      const access_token = makeFakeJwt(accessPayload);

      db.accessTokens.set(access_token, {
        client_id,
        username: rr.username,
        scope: rr.scope,
        exp: accessExp,
      });

      logLine(
        "info",
        `${arrow("Auth → Client")}: 200 OK`,
        ok("refreshed access_token")
      );

      return {
        token_type: "Bearer",
        access_token,
        expires_in: Math.floor((accessExp - Date.now()) / 1000),
        scope: rr.scope,
      };
    }

    return { error: "unsupported_grant_type" };
  },

  introspect(access_token) {
    // Simulated token verification endpoint (resource server calling auth server)
    logLine(
      "info",
      `${arrow("Resource → Auth")}: POST /introspect`,
      `token=${access_token.slice(0, 18)}…`
    );

    const rec = db.accessTokens.get(access_token);
    if (!rec) return { active: false };

    const active = rec.exp > Date.now();
    const payload = decodeFakeJwt(access_token);

    return {
      active,
      client_id: rec.client_id,
      username: rec.username,
      scope: rec.scope,
      exp: payload?.exp,
    };
  },
};

const resourceServer = {
  getProfile(access_token) {
    logLine(
      "info",
      `${arrow("Client → Resource")}: GET /me`,
      `Authorization: Bearer ${access_token.slice(0, 18)}…`
    );

    // Resource server verifies token (introspection simulation)
    const status = authorizationServer.introspect(access_token);
    if (!status.active) {
      logLine(
        "info",
        `${arrow("Resource → Client")}: 401 Unauthorized`,
        bad("token invalid/expired")
      );
      return {
        ok: false,
        status: 401,
        error: "invalid_token",
        details: status,
      };
    }

    // Check scope (super simplified)
    if (!status.scope.includes("profile:read")) {
      logLine(
        "info",
        `${arrow("Resource → Client")}: 403 Forbidden`,
        bad("insufficient_scope")
      );
      return {
        ok: false,
        status: 403,
        error: "insufficient_scope",
        details: status,
      };
    }

    const user = db.users[status.username];
    const body = { ok: true, status: 200, data: user.profile, token: status };
    logLine(
      "info",
      `${arrow("Resource → Client")}: 200 OK`,
      ok("returned protected resource")
    );
    return body;
  },
};

/** ---------------------------
 * UI state
 * -------------------------- */
const client = {
  client_id: "toy-client",
  client_secret: "toy-client-secret", // in real life: never keep secrets in browser
  redirect_uri: "https://client.example/callback",
  scope: "profile:read",
  state: "st_" + rand(10),
  authorization_code: null,
  access_token: null,
  refresh_token: null,
};

let showSecrets = false;
let tickTimer = null;

function setAuthScreen(html) {
  $("authScreen").innerHTML = html;
}

function updateViews() {
  $("clientIdView").textContent = client.client_id;
  $("redirectView").textContent = client.redirect_uri;
  $("scopeView").textContent = client.scope;
  $("stateView").textContent = client.state;

  const clientView = {
    client_id: client.client_id,
    client_secret: showSecrets ? client.client_secret : "••••••••••••••••",
    redirect_uri: client.redirect_uri,
    scope: client.scope,
    state: client.state,
    authorization_code: client.authorization_code,
    access_token: client.access_token
      ? client.access_token.slice(0, 40) + "…"
      : null,
    refresh_token: client.refresh_token
      ? client.refresh_token.slice(0, 22) + "…"
      : null,
    access_token_payload: client.access_token
      ? decodeFakeJwt(client.access_token)
      : null,
  };
  $("clientState").textContent = pretty(clientView);

  const authView = {
    outstandingAuthCodes: db.authCodes.size,
    issuedAccessTokens: db.accessTokens.size,
    issuedRefreshTokens: db.refreshTokens.size,
  };
  $("authState").textContent = pretty(authView);

  // enable/disable buttons based on progress
  $("btn2").disabled = false; // after step 1, we will re-disable if needed
  $("btn3").disabled = !client.authorization_code;
  $("btn4").disabled = !client.access_token;
  $("btn5").disabled = !client.access_token;
  $("btnRefresh").disabled = !client.refresh_token;

  // If no auth request started, disable step 2
  if (!uiFlags.authRequestStarted) $("btn2").disabled = true;
}

const uiFlags = {
  authRequestStarted: false,
  delegationApproved: false,
};

function resetAll() {
  // clear issued stuff
  db.authCodes.clear();
  db.accessTokens.clear();
  db.refreshTokens.clear();

  client.state = "st_" + rand(10);
  client.authorization_code = null;
  client.access_token = null;
  client.refresh_token = null;

  uiFlags.authRequestStarted = false;
  uiFlags.delegationApproved = false;

  $("apiState").textContent = pretty({});

  setAuthScreen("Click “1) Authorization request” to start.");
  logLine("info", ok("Reset complete"), "");

  stopTick();
  updateViews();
}

function startTick() {
  stopTick();
  tickTimer = setInterval(() => {
    // Just refresh the client state view; token expiry is checked on introspection
    updateViews();
  }, 500);
}
function stopTick() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = null;
}

/** ---------------------------
 * Steps
 * -------------------------- */
function step1_authorizationRequest() {
  uiFlags.authRequestStarted = true;

  // In real life: browser navigates to Auth Server /authorize endpoint.
  setAuthScreen(`
    <div><b>Login & consent</b></div>
    <div style="margin-top:6px">
      App <code>${client.client_id}</code> wants <code>${client.scope}</code>.
    </div>
    <div style="margin-top:6px;color:#6b7280">
      Next: click “2) Approve delegation” (simulates user login + consent).
    </div>
  `);

  logLine(
    "info",
    `${arrow("Client → Browser")}: open Authorization URL`,
    `/authorize?client_id=${client.client_id}&redirect_uri=${encodeURIComponent(
      client.redirect_uri
    )}&scope=${encodeURIComponent(client.scope)}&state=${client.state}`
  );

  updateViews();
}

function step2_approveDelegation() {
  if (!uiFlags.authRequestStarted) return;

  const username = $("username").value.trim();
  const password = $("password").value;
  const consent = $("consent").checked;

  const res = authorizationServer.authorize({
    client_id: client.client_id,
    redirect_uri: client.redirect_uri,
    scope: client.scope,
    state: client.state,
    username,
    password,
    consent,
  });

  if (res.error) {
    setAuthScreen(`
      <b>Denied</b><br/>
      Reason: <code>${res.error}</code>${res.reason ? ` (${res.reason})` : ""}
    `);
    logLine(
      "info",
      bad("Authorization failed"),
      `error=${res.error}${res.reason ? `, reason=${res.reason}` : ""}`
    );
    client.authorization_code = null;
    updateViews();
    return;
  }

  uiFlags.delegationApproved = true;

  // Simulated redirect back to client with code + state
  client.authorization_code = res.code;

  setAuthScreen(`
    <b>Approved!</b><br/>
    Redirecting back with <code>code</code> + <code>state</code>…
    <div style="margin-top:8px;color:#6b7280">
      Next: click “3) Request tokens”.
    </div>
  `);

  logLine(
    "info",
    `${arrow("Browser → Client")}: GET redirect_uri`,
    `?code=${res.code}&state=${res.state}`
  );

  updateViews();
}

function step3_requestTokens() {
  const code = client.authorization_code;
  if (!code) return;

  const res = authorizationServer.token({
    grant_type: "authorization_code",
    code,
    redirect_uri: client.redirect_uri,
    client_id: client.client_id,
    client_secret: client.client_secret,
  });

  if (res.error) {
    logLine(
      "info",
      bad("Token exchange failed"),
      `error=${res.error}${res.reason ? `, reason=${res.reason}` : ""}`
    );
    return;
  }

  client.access_token = res.access_token;
  client.refresh_token = res.refresh_token;

  // clear code after exchange (common pattern)
  client.authorization_code = null;

  logLine("info", ok("Client stored tokens"), `expires_in=${res.expires_in}s`);
  startTick();
  updateViews();
}

function step5_verifyTokenOnly() {
  if (!client.access_token) return;
  const status = authorizationServer.introspect(client.access_token);
  $("apiState").textContent = pretty({ introspection: status });
  logLine(
    "info",
    `Verification result: ${status.active ? ok("active") : bad("inactive")}`,
    ""
  );
  updateViews();
}

function step4_accessResource() {
  if (!client.access_token) return;
  const resp = resourceServer.getProfile(client.access_token);
  $("apiState").textContent = pretty(resp);
  updateViews();
}

function refreshAccessToken() {
  if (!client.refresh_token) return;

  const res = authorizationServer.token({
    grant_type: "refresh_token",
    refresh_token: client.refresh_token,
    client_id: client.client_id,
    client_secret: client.client_secret,
  });

  if (res.error) {
    logLine(
      "info",
      bad("Refresh failed"),
      `error=${res.error}${res.reason ? `, reason=${res.reason}` : ""}`
    );
    return;
  }

  client.access_token = res.access_token;
  logLine(
    "info",
    ok("Got new access token via refresh"),
    `expires_in=${res.expires_in}s`
  );
  startTick();
  updateViews();
}

/** ---------------------------
 * Wire up UI
 * -------------------------- */
$("btn1").addEventListener("click", step1_authorizationRequest);
$("btn2").addEventListener("click", step2_approveDelegation);
$("btn3").addEventListener("click", step3_requestTokens);
$("btn4").addEventListener("click", step4_accessResource);
$("btn5").addEventListener("click", step5_verifyTokenOnly);
$("btnRefresh").addEventListener("click", refreshAccessToken);

$("toggleSecrets").addEventListener("click", () => {
  showSecrets = !showSecrets;
  updateViews();
});

$("reset").addEventListener("click", resetAll);

$("clearLog").addEventListener("click", () => {
  $("log").innerHTML = "";
});

$("copyLog").addEventListener("click", async () => {
  const text = Array.from($("log").querySelectorAll(".line"))
    .map((n) => n.textContent.trim())
    .join("\n");
  try {
    await navigator.clipboard.writeText(text);
    logLine("info", ok("Log copied to clipboard"), "");
  } catch {
    logLine("info", bad("Could not copy (clipboard blocked)"), "");
  }
});

// initial render
resetAll();
updateViews();
```

---

## Run it

1. Create a folder with the three files: `index.html`, `styles.css`, `app.js`
2. Open `index.html` in your browser
3. Click buttons **1 → 2 → 3 → 4/5**, then wait for token expiry and try **refresh**

---

If you want, I can also:

- add a little arrow animation between boxes,
- show the “redirect URL” exactly like a browser address bar,
- add PKCE (code_verifier / code_challenge) in the toy flow.
