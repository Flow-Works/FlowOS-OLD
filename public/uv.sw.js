(() => {
  // src/uv.sw.js
  var Ultraviolet = self.Ultraviolet;
  var cspHeaders = [
    "cross-origin-embedder-policy",
    "cross-origin-opener-policy",
    "cross-origin-resource-policy",
    "content-security-policy",
    "content-security-policy-report-only",
    "expect-ct",
    "feature-policy",
    "origin-isolation",
    "strict-transport-security",
    "upgrade-insecure-requests",
    "x-content-type-options",
    "x-download-options",
    "x-frame-options",
    "x-permitted-cross-domain-policies",
    "x-powered-by",
    "x-xss-protection"
  ];
  var emptyMethods = ["GET", "HEAD"];
  var UVServiceWorker = class extends Ultraviolet.EventEmitter {
    constructor(config = __uv$config) {
      super();
      if (!config.bare)
        config.bare = "/bare/";
      if (!config.prefix)
        config.prefix = "/service/";
      this.config = config;
      const addresses = (Array.isArray(config.bare) ? config.bare : [config.bare]).map((str) => new URL(str, location).toString());
      this.address = addresses[~~(Math.random() * addresses.length)];
      this.bareClient = new Ultraviolet.BareClient(this.address);
    }
    /**
     *
     * @param {Event & {request: Request}} param0
     * @returns
     */
    async fetch({ request }) {
      let fetchedURL;
      try {
        if (!request.url.startsWith(location.origin + this.config.prefix))
          return await fetch(request);
        const ultraviolet = new Ultraviolet(this.config, this.address);
        if (typeof this.config.construct === "function") {
          this.config.construct(ultraviolet, "service");
        }
        const db = await ultraviolet.cookie.db();
        ultraviolet.meta.origin = location.origin;
        ultraviolet.meta.base = ultraviolet.meta.url = new URL(
          ultraviolet.sourceUrl(request.url)
        );
        const requestCtx = new RequestContext(
          request,
          this,
          ultraviolet,
          !emptyMethods.includes(request.method.toUpperCase()) ? await request.blob() : null
        );
        if (ultraviolet.meta.url.protocol === "blob:") {
          requestCtx.blob = true;
          requestCtx.base = requestCtx.url = new URL(
            requestCtx.url.pathname
          );
        }
        if (request.referrer && request.referrer.startsWith(location.origin)) {
          const referer = new URL(
            ultraviolet.sourceUrl(request.referrer)
          );
          if (requestCtx.headers.origin || ultraviolet.meta.url.origin !== referer.origin && request.mode === "cors") {
            requestCtx.headers.origin = referer.origin;
          }
          requestCtx.headers.referer = referer.href;
        }
        const cookies = await ultraviolet.cookie.getCookies(db) || [];
        const cookieStr = ultraviolet.cookie.serialize(
          cookies,
          ultraviolet.meta,
          false
        );
        requestCtx.headers["user-agent"] = navigator.userAgent;
        if (cookieStr)
          requestCtx.headers.cookie = cookieStr;
        const reqEvent = new HookEvent(requestCtx, null, null);
        this.emit("request", reqEvent);
        if (reqEvent.intercepted)
          return reqEvent.returnValue;
        fetchedURL = requestCtx.blob ? "blob:" + location.origin + requestCtx.url.pathname : requestCtx.url;
        const response = await this.bareClient.fetch(fetchedURL, {
          headers: requestCtx.headers,
          method: requestCtx.method,
          body: requestCtx.body,
          credentials: requestCtx.credentials,
          mode: location.origin !== requestCtx.address.origin ? "cors" : requestCtx.mode,
          cache: requestCtx.cache,
          redirect: requestCtx.redirect
        });
        const responseCtx = new ResponseContext(requestCtx, response);
        const resEvent = new HookEvent(responseCtx, null, null);
        this.emit("beforemod", resEvent);
        if (resEvent.intercepted)
          return resEvent.returnValue;
        for (const name of cspHeaders) {
          if (responseCtx.headers[name])
            delete responseCtx.headers[name];
        }
        if (responseCtx.headers.location) {
          responseCtx.headers.location = ultraviolet.rewriteUrl(
            responseCtx.headers.location
          );
        }
        if (request.destination === "document") {
          const header = responseCtx.headers["content-disposition"];
          if (!/\s*?((inline|attachment);\s*?)filename=/i.test(header)) {
            const type = /^\s*?attachment/i.test(header) ? "attachment" : "inline";
            const [filename] = new URL(response.finalURL).pathname.split("/").slice(-1);
            responseCtx.headers["content-disposition"] = `${type}; filename=${JSON.stringify(filename)}`;
          }
        }
        if (responseCtx.headers["set-cookie"]) {
          Promise.resolve(
            ultraviolet.cookie.setCookies(
              responseCtx.headers["set-cookie"],
              db,
              ultraviolet.meta
            )
          ).then(() => {
            self.clients.matchAll().then(function(clients) {
              clients.forEach(function(client) {
                client.postMessage({
                  msg: "updateCookies",
                  url: ultraviolet.meta.url.href
                });
              });
            });
          });
          delete responseCtx.headers["set-cookie"];
        }
        if (responseCtx.body) {
          switch (request.destination) {
            case "script":
            case "worker":
              {
                const scripts = [
                  ultraviolet.bundleScript,
                  ultraviolet.clientScript,
                  ultraviolet.configScript,
                  ultraviolet.handlerScript
                ].map((script) => JSON.stringify(script)).join(",");
                responseCtx.body = `if (!self.__uv && self.importScripts) { ${ultraviolet.createJsInject(
                  this.address,
                  this.bareClient.manifest,
                  ultraviolet.cookie.serialize(
                    cookies,
                    ultraviolet.meta,
                    true
                  ),
                  request.referrer
                )} importScripts(${scripts}); }
`;
                responseCtx.body += ultraviolet.js.rewrite(
                  await response.text()
                );
              }
              break;
            case "style":
              responseCtx.body = ultraviolet.rewriteCSS(
                await response.text()
              );
              break;
            case "iframe":
            case "document":
              if (isHtml(
                ultraviolet.meta.url,
                responseCtx.headers["content-type"] || ""
              )) {
                responseCtx.body = ultraviolet.rewriteHtml(
                  await response.text(),
                  {
                    document: true,
                    injectHead: ultraviolet.createHtmlInject(
                      ultraviolet.handlerScript,
                      ultraviolet.bundleScript,
                      ultraviolet.clientScript,
                      ultraviolet.configScript,
                      this.address,
                      this.bareClient.manifest,
                      ultraviolet.cookie.serialize(
                        cookies,
                        ultraviolet.meta,
                        true
                      ),
                      request.referrer
                    )
                  }
                );
              }
          }
        }
        if (requestCtx.headers.accept === "text/event-stream") {
          responseCtx.headers["content-type"] = "text/event-stream";
        }
        if (crossOriginIsolated) {
          responseCtx.headers["Cross-Origin-Embedder-Policy"] = "require-corp";
        }
        this.emit("response", resEvent);
        if (resEvent.intercepted)
          return resEvent.returnValue;
        return new Response(responseCtx.body, {
          headers: responseCtx.headers,
          status: responseCtx.status,
          statusText: responseCtx.statusText
        });
      } catch (err) {
        if (!["document", "iframe"].includes(request.destination))
          return new Response(void 0, { status: 500 });
        console.error(err);
        return renderError(err, fetchedURL, this.address);
      }
    }
    static Ultraviolet = Ultraviolet;
  };
  self.UVServiceWorker = UVServiceWorker;
  var ResponseContext = class {
    /**
     *
     * @param {RequestContext} request
     * @param {import("@tomphttp/bare-client").BareResponseFetch} response
     */
    constructor(request, response) {
      this.request = request;
      this.raw = response;
      this.ultraviolet = request.ultraviolet;
      this.headers = {};
      for (const key in response.rawHeaders)
        this.headers[key.toLowerCase()] = response.rawHeaders[key];
      this.status = response.status;
      this.statusText = response.statusText;
      this.body = response.body;
    }
    get url() {
      return this.request.url;
    }
    get base() {
      return this.request.base;
    }
    set base(val) {
      this.request.base = val;
    }
  };
  var RequestContext = class {
    /**
     *
     * @param {Request} request
     * @param {UVServiceWorker} worker
     * @param {Ultraviolet} ultraviolet
     * @param {BodyInit} body
     */
    constructor(request, worker, ultraviolet, body = null) {
      this.ultraviolet = ultraviolet;
      this.request = request;
      this.headers = Object.fromEntries(request.headers.entries());
      this.method = request.method;
      this.address = worker.address;
      this.body = body || null;
      this.cache = request.cache;
      this.redirect = request.redirect;
      this.credentials = "omit";
      this.mode = request.mode === "cors" ? request.mode : "same-origin";
      this.blob = false;
    }
    get url() {
      return this.ultraviolet.meta.url;
    }
    set url(val) {
      this.ultraviolet.meta.url = val;
    }
    get base() {
      return this.ultraviolet.meta.base;
    }
    set base(val) {
      this.ultraviolet.meta.base = val;
    }
  };
  function isHtml(url, contentType = "") {
    return (Ultraviolet.mime.contentType(contentType || url.pathname) || "text/html").split(";")[0] === "text/html";
  }
  var HookEvent = class {
    #intercepted;
    #returnValue;
    constructor(data = {}, target = null, that = null) {
      this.#intercepted = false;
      this.#returnValue = null;
      this.data = data;
      this.target = target;
      this.that = that;
    }
    get intercepted() {
      return this.#intercepted;
    }
    get returnValue() {
      return this.#returnValue;
    }
    respondWith(input) {
      this.#returnValue = input;
      this.#intercepted = true;
    }
  };
  function hostnameErrorTemplate(fetchedURL, bareServer) {
    const parsedFetchedURL = new URL(fetchedURL);
    const script = `remoteHostname.textContent = ${JSON.stringify(
      parsedFetchedURL.hostname
    )};bareServer.href = ${JSON.stringify(bareServer)};uvHostname.textContent = ${JSON.stringify(location.hostname)};reload.addEventListener("click", () => location.reload());uvVersion.textContent = ${JSON.stringify(
      "2.0.0"
    )};`;
    return `<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title></head><body><h1>This site can\u2019t be reached</h1><hr /><p><b id="remoteHostname"></b>\u2019s server IP address could not be found.</p><p>Try:</p><ul><li>Verifying you entered the correct address</li><li>Clearing the site data</li><li>Contacting <b id="uvHostname"></b>'s administrator</li><li>Verifying the <a id='bareServer' title='Bare server'>${config.bare}</a> isn't censored</li></ul><button id="reload">Reload</button><hr /><p><i>Ultraviolet v<span id="uvVersion"></span></i></p><script src="${"data:application/javascript," + encodeURIComponent(script)}"><\/script></body></html>`;
  }
  function errorTemplate(title, code, id, message, trace, fetchedURL, bareServer) {
    if (message === "The specified host could not be resolved.")
      return hostnameErrorTemplate(fetchedURL, bareServer);
    const script = `errorTitle.textContent = ${JSON.stringify(title)};errorCode.textContent = ${JSON.stringify(code)};` + (id ? `errorId.textContent = ${JSON.stringify(id)};` : "") + `errorMessage.textContent =  ${JSON.stringify(message)};errorTrace.value = ${JSON.stringify(trace)};fetchedURL.textContent = ${JSON.stringify(fetchedURL)};bareServer.href = ${JSON.stringify(bareServer)};for (const node of document.querySelectorAll("#uvHostname")) node.textContent = ${JSON.stringify(
      location.hostname
    )};reload.addEventListener("click", () => location.reload());uvVersion.textContent = ${JSON.stringify(
      "2.0.0"
    )};`;
    return `<!DOCTYPE html><html><head><meta charset='utf-8' /><title>Error</title></head><body><h1 id='errorTitle'></h1><hr /><p>Failed to load <b id="fetchedURL"></b></p><p id="errorMessage"></p><table><tbody><tr><td>Code:</td><td id="errorCode"></td></tr>` + (id ? '<tr><td>ID:</td><td id="errorId"></td></tr>' : "") + `</tbody></table><textarea id="errorTrace" cols="40" rows="10" readonly></textarea><p>Try:</p><ul><li>Checking your internet connection</li><li>Verifying you entered the correct address</li><li>Clearing the site data</li><li>Contacting <b id="uvHostname"></b>'s administrator</li><li>Verify the <a id='bareServer' title='Bare server'>${config.bare}</a> isn't censored</li></ul><p>If you're the administrator of <b id="uvHostname"></b>, try:</p><ul><li>Restarting your Bare server</li><li>Updating Ultraviolet</li><li>Troubleshooting the error on the <a href="https://github.com/titaniumnetwork-dev/Ultraviolet" target="_blank">GitHub repository</a></li></ul><button id="reload">Reload</button><hr /><p><i>Ultraviolet v<span id="uvVersion"></span></i></p><script src="${"data:application/javascript," + encodeURIComponent(script)}"><\/script></body></html>`;
  }
  function isBareError(err) {
    return err instanceof Error && typeof err.body === "object";
  }
  function renderError(err, fetchedURL, bareServer) {
    let status;
    let title;
    let code;
    let id = "";
    let message;
    if (isBareError(err)) {
      status = err.status;
      title = "Error communicating with the Bare server";
      message = err.body.message;
      code = err.body.code;
      id = err.body.id;
    } else {
      status = 500;
      title = "Error processing your request";
      message = "Internal Server Error";
      code = err instanceof Error ? err.name : "UNKNOWN";
    }
    return new Response(
      errorTemplate(
        title,
        code,
        id,
        message,
        String(err),
        fetchedURL,
        bareServer
      ),
      {
        status,
        headers: {
          "content-type": "text/html"
        }
      }
    );
  }
})();
//# sourceMappingURL=uv.sw.js.map
