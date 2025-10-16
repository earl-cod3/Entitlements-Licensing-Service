// server.dev.js (Node CJS)

//
// HARD STARTUP GUARD: make sure no fake window exists on the server
//
if (typeof global !== "undefined" && typeof global.window !== "undefined") {
  try { delete global.window; } catch (_) { global.window = undefined; }
}

const http = require("http");
const next = require("next");

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    // Double-guard per request (paranoid mode)
    if (typeof global.window !== "undefined") {
      try { delete global.window; } catch (_) { global.window = undefined; }
    }
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Custom dev server ready on http://localhost:${port}`);
  });
});
