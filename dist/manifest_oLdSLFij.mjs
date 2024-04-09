import './chunks/astro_lVdhbMDE.mjs';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    })
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"","routes":[{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Lf_NhN2y.js"}],"styles":[{"type":"inline","content":".brands-wrapper[data-astro-cid-lf55hsyd]{padding:3em 1em 1em}.brands-wrapper[data-astro-cid-lf55hsyd] .brands[data-astro-cid-lf55hsyd]{list-style:none;padding:0;margin:0;display:flex;gap:1em;max-width:100%;overflow-x:scroll}.brands-wrapper[data-astro-cid-lf55hsyd] .brands[data-astro-cid-lf55hsyd] .brand[data-astro-cid-lf55hsyd]{background:#fff;border-radius:1em;padding:.2em 1em;display:flex;place-items:center}.brands-wrapper[data-astro-cid-lf55hsyd] .brands[data-astro-cid-lf55hsyd] .brand[data-astro-cid-lf55hsyd] img[data-astro-cid-lf55hsyd]{width:8em;margin:auto;object-fit:contain}main[data-astro-cid-j7pv25f6] .banner-wrapper[data-astro-cid-j7pv25f6]{display:flex;align-items:center;justify-content:center;position:relative;width:100%;min-height:70vh}main[data-astro-cid-j7pv25f6] .banner-wrapper[data-astro-cid-j7pv25f6] img[data-astro-cid-j7pv25f6]{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;z-index:100}main[data-astro-cid-j7pv25f6] .banner-wrapper[data-astro-cid-j7pv25f6] .wrapper-content[data-astro-cid-j7pv25f6]{width:90%;margin:auto;color:#fff;text-transform:uppercase;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:200}@media (min-width: 920px){main[data-astro-cid-j7pv25f6] .banner-wrapper[data-astro-cid-j7pv25f6] .wrapper-content[data-astro-cid-j7pv25f6]{width:60%}}main[data-astro-cid-j7pv25f6] .banner-wrapper[data-astro-cid-j7pv25f6] .wrapper-content[data-astro-cid-j7pv25f6] .quote-wrapper[data-astro-cid-j7pv25f6]{padding:2em 0 0}main[data-astro-cid-j7pv25f6] .banner-wrapper[data-astro-cid-j7pv25f6] .wrapper-content[data-astro-cid-j7pv25f6] .quote-wrapper[data-astro-cid-j7pv25f6] a[data-astro-cid-j7pv25f6]{text-decoration:auto}@media (min-width: 920px){main[data-astro-cid-j7pv25f6] .banner-wrapper[data-astro-cid-j7pv25f6] img[data-astro-cid-j7pv25f6]{width:100%;height:70vh}}\n.astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}.footer[data-astro-cid-mtxgg6pp]{display:flex;align-items:center;flex-direction:column;margin-top:2em}.footer[data-astro-cid-mtxgg6pp] img[data-astro-cid-mtxgg6pp]{width:10em;margin:1.2em auto}.footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{text-align:center;color:#ffffff8c;padding:1em}.footer[data-astro-cid-mtxgg6pp] .icons-list[data-astro-cid-mtxgg6pp]{padding:2em 1.5em;gap:1em;display:grid;grid-template-columns:repeat(auto-fit,minmax(12em,auto));width:100%}.footer__bottom[data-astro-cid-mtxgg6pp]{background:#000;width:100%;padding:1em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp]{text-align:center;font-size:.9em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp] a[data-astro-cid-mtxgg6pp]{text-decoration:none}@media (min-width: 500px){footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{max-width:50%}}.header-absolute[data-astro-cid-xbstl6g3]{width:100%;height:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:flex;justify-content:space-between;align-items:center}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:10em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:none}@media (min-width: 920px){.header-absolute[data-astro-cid-xbstl6g3]{position:absolute;top:0;z-index:700;display:flex;justify-content:space-between;padding:1em;width:100%;max-width:1530px;margin:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:initial}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:11em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] .item-menu-button[data-astro-cid-xbstl6g3]{display:none}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:flex;justify-content:end}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3]{list-style:none;padding:0;display:flex;align-items:center;gap:1em}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] a[data-astro-cid-xbstl6g3]{text-decoration:none;color:#fff}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] .anchor-icon[data-astro-cid-xbstl6g3]{display:flex;place-items:center;gap:.2em;padding:.7em 1.2em;text-align:center;border-radius:7em;border:none;font-weight:600;cursor:pointer;background-color:#f40f0f;color:#fff}}.header-absolute[data-astro-cid-xbstl6g3].header-sticky{position:fixed;z-index:700;background-color:#000000b3;padding:.2em 1em;backdrop-filter:blur(10px);animation:slideDown .35s ease-out}@keyframes slideDown{0%{transform:translateY(-100%)}to{transform:translateY(0)}}*{margin:0;padding:0;box-sizing:border-box}html{font-family:system-ui,sans-serif;background:#050505;color:#fff}body{margin:0;font-size:16px;overflow-x:hidden}.general-wrapper{max-width:1530px;margin:auto;position:relative;background:#13151a}.main{width:100%;height:auto}.color__primary{color:#f40f0f}.color__secondary{color:#0c0c0ccc}.color__white{color:#fff}.color__black{color:#000}\n"},{"type":"external","src":"/_astro/index.tBaSdcAP.css"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Lf_NhN2y.js"}],"styles":[{"type":"inline","content":"main[data-astro-cid-kz5zseqt]{width:100%;padding:12em 2em 2em;display:flex;justify-content:center;align-items:center}@media (max-width: 576px){main[data-astro-cid-kz5zseqt]{padding:3em 1.5em}}.about-us[data-astro-cid-kz5zseqt]{width:100%;display:flex;justify-content:center;flex-wrap:wrap-reverse;gap:2rem;padding:0 7rem}@media (max-width: 1200px){.about-us[data-astro-cid-kz5zseqt]{padding:0 2rem}}.about-us__img[data-astro-cid-kz5zseqt]{max-width:500px;height:280px}.about-us__img[data-astro-cid-kz5zseqt] img[data-astro-cid-kz5zseqt]{width:100%;height:100%;border-radius:15px}.about-us__text[data-astro-cid-kz5zseqt]{width:35%}.about-us__text-title[data-astro-cid-kz5zseqt]{font-size:3.5rem;line-height:1;text-transform:uppercase;font-style:italic;color:#f40f0f;margin-bottom:.625rem}@media (max-width: 576px){.about-us__text-title[data-astro-cid-kz5zseqt]{font-size:1.5rem}}.about-us__text-description[data-astro-cid-kz5zseqt]{text-align:left;font-size:1.2rem}@media (max-width: 1024px){.about-us__text[data-astro-cid-kz5zseqt]{width:100%}}\n.astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}.footer[data-astro-cid-mtxgg6pp]{display:flex;align-items:center;flex-direction:column;margin-top:2em}.footer[data-astro-cid-mtxgg6pp] img[data-astro-cid-mtxgg6pp]{width:10em;margin:1.2em auto}.footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{text-align:center;color:#ffffff8c;padding:1em}.footer[data-astro-cid-mtxgg6pp] .icons-list[data-astro-cid-mtxgg6pp]{padding:2em 1.5em;gap:1em;display:grid;grid-template-columns:repeat(auto-fit,minmax(12em,auto));width:100%}.footer__bottom[data-astro-cid-mtxgg6pp]{background:#000;width:100%;padding:1em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp]{text-align:center;font-size:.9em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp] a[data-astro-cid-mtxgg6pp]{text-decoration:none}@media (min-width: 500px){footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{max-width:50%}}.header-absolute[data-astro-cid-xbstl6g3]{width:100%;height:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:flex;justify-content:space-between;align-items:center}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:10em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:none}@media (min-width: 920px){.header-absolute[data-astro-cid-xbstl6g3]{position:absolute;top:0;z-index:700;display:flex;justify-content:space-between;padding:1em;width:100%;max-width:1530px;margin:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:initial}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:11em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] .item-menu-button[data-astro-cid-xbstl6g3]{display:none}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:flex;justify-content:end}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3]{list-style:none;padding:0;display:flex;align-items:center;gap:1em}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] a[data-astro-cid-xbstl6g3]{text-decoration:none;color:#fff}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] .anchor-icon[data-astro-cid-xbstl6g3]{display:flex;place-items:center;gap:.2em;padding:.7em 1.2em;text-align:center;border-radius:7em;border:none;font-weight:600;cursor:pointer;background-color:#f40f0f;color:#fff}}.header-absolute[data-astro-cid-xbstl6g3].header-sticky{position:fixed;z-index:700;background-color:#000000b3;padding:.2em 1em;backdrop-filter:blur(10px);animation:slideDown .35s ease-out}@keyframes slideDown{0%{transform:translateY(-100%)}to{transform:translateY(0)}}*{margin:0;padding:0;box-sizing:border-box}html{font-family:system-ui,sans-serif;background:#050505;color:#fff}body{margin:0;font-size:16px;overflow-x:hidden}.general-wrapper{max-width:1530px;margin:auto;position:relative;background:#13151a}.main{width:100%;height:auto}.color__primary{color:#f40f0f}.color__secondary{color:#0c0c0ccc}.color__white{color:#fff}.color__black{color:#000}\n"},{"type":"external","src":"/_astro/index.tBaSdcAP.css"}],"routeData":{"route":"/about-us","type":"page","pattern":"^\\/about-us\\/?$","segments":[[{"content":"about-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about-us/index.astro","pathname":"/about-us","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Lf_NhN2y.js"}],"styles":[{"type":"inline","content":"main[data-astro-cid-ttgomkr6]{width:100%;padding:12em 2em 2em}@media (max-width: 576px){main[data-astro-cid-ttgomkr6]{padding:3em 1.5em}}.card-list[data-astro-cid-ttgomkr6]{margin:auto;max-width:1280px;display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:1em;justify-content:center}.quote-button[data-astro-cid-ttgomkr6]{width:100%;display:flex;justify-content:center;align-items:center;margin:6em 0 2em}.quote-button[data-astro-cid-ttgomkr6] a[data-astro-cid-ttgomkr6]{text-decoration:auto}\n.astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}.footer[data-astro-cid-mtxgg6pp]{display:flex;align-items:center;flex-direction:column;margin-top:2em}.footer[data-astro-cid-mtxgg6pp] img[data-astro-cid-mtxgg6pp]{width:10em;margin:1.2em auto}.footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{text-align:center;color:#ffffff8c;padding:1em}.footer[data-astro-cid-mtxgg6pp] .icons-list[data-astro-cid-mtxgg6pp]{padding:2em 1.5em;gap:1em;display:grid;grid-template-columns:repeat(auto-fit,minmax(12em,auto));width:100%}.footer__bottom[data-astro-cid-mtxgg6pp]{background:#000;width:100%;padding:1em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp]{text-align:center;font-size:.9em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp] a[data-astro-cid-mtxgg6pp]{text-decoration:none}@media (min-width: 500px){footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{max-width:50%}}.header-absolute[data-astro-cid-xbstl6g3]{width:100%;height:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:flex;justify-content:space-between;align-items:center}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:10em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:none}@media (min-width: 920px){.header-absolute[data-astro-cid-xbstl6g3]{position:absolute;top:0;z-index:700;display:flex;justify-content:space-between;padding:1em;width:100%;max-width:1530px;margin:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:initial}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:11em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] .item-menu-button[data-astro-cid-xbstl6g3]{display:none}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:flex;justify-content:end}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3]{list-style:none;padding:0;display:flex;align-items:center;gap:1em}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] a[data-astro-cid-xbstl6g3]{text-decoration:none;color:#fff}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] .anchor-icon[data-astro-cid-xbstl6g3]{display:flex;place-items:center;gap:.2em;padding:.7em 1.2em;text-align:center;border-radius:7em;border:none;font-weight:600;cursor:pointer;background-color:#f40f0f;color:#fff}}.header-absolute[data-astro-cid-xbstl6g3].header-sticky{position:fixed;z-index:700;background-color:#000000b3;padding:.2em 1em;backdrop-filter:blur(10px);animation:slideDown .35s ease-out}@keyframes slideDown{0%{transform:translateY(-100%)}to{transform:translateY(0)}}*{margin:0;padding:0;box-sizing:border-box}html{font-family:system-ui,sans-serif;background:#050505;color:#fff}body{margin:0;font-size:16px;overflow-x:hidden}.general-wrapper{max-width:1530px;margin:auto;position:relative;background:#13151a}.main{width:100%;height:auto}.color__primary{color:#f40f0f}.color__secondary{color:#0c0c0ccc}.color__white{color:#fff}.color__black{color:#000}\n"},{"type":"external","src":"/_astro/index.tBaSdcAP.css"}],"routeData":{"route":"/products","type":"page","pattern":"^\\/products\\/?$","segments":[[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/products/index.astro","pathname":"/products","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Lf_NhN2y.js"}],"styles":[{"type":"inline","content":"main[data-astro-cid-ahc3q4vw]{padding:7em 2em 2em}@media (max-width: 576px){main[data-astro-cid-ahc3q4vw]{padding:3em 1.5em}}main[data-astro-cid-ahc3q4vw] .error-message-wrapper[data-astro-cid-ahc3q4vw]{width:60%;margin:auto}@media (max-width: 970px){main[data-astro-cid-ahc3q4vw] .error-message-wrapper[data-astro-cid-ahc3q4vw]{width:100%}}main[data-astro-cid-ahc3q4vw] section[data-astro-cid-ahc3q4vw]{background-image:url(/images/form-backgrouns.webp);padding:1em 1.5em 3em;max-width:550px;width:100%;margin:auto;text-align:center;border-radius:1em}main[data-astro-cid-ahc3q4vw] section[data-astro-cid-ahc3q4vw] span[data-astro-cid-ahc3q4vw]{display:inline-block;padding:.3em;font-size:2.2em;font-weight:600}\n.astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}.footer[data-astro-cid-mtxgg6pp]{display:flex;align-items:center;flex-direction:column;margin-top:2em}.footer[data-astro-cid-mtxgg6pp] img[data-astro-cid-mtxgg6pp]{width:10em;margin:1.2em auto}.footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{text-align:center;color:#ffffff8c;padding:1em}.footer[data-astro-cid-mtxgg6pp] .icons-list[data-astro-cid-mtxgg6pp]{padding:2em 1.5em;gap:1em;display:grid;grid-template-columns:repeat(auto-fit,minmax(12em,auto));width:100%}.footer__bottom[data-astro-cid-mtxgg6pp]{background:#000;width:100%;padding:1em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp]{text-align:center;font-size:.9em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp] a[data-astro-cid-mtxgg6pp]{text-decoration:none}@media (min-width: 500px){footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{max-width:50%}}.header-absolute[data-astro-cid-xbstl6g3]{width:100%;height:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:flex;justify-content:space-between;align-items:center}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:10em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:none}@media (min-width: 920px){.header-absolute[data-astro-cid-xbstl6g3]{position:absolute;top:0;z-index:700;display:flex;justify-content:space-between;padding:1em;width:100%;max-width:1530px;margin:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:initial}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:11em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] .item-menu-button[data-astro-cid-xbstl6g3]{display:none}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:flex;justify-content:end}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3]{list-style:none;padding:0;display:flex;align-items:center;gap:1em}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] a[data-astro-cid-xbstl6g3]{text-decoration:none;color:#fff}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] .anchor-icon[data-astro-cid-xbstl6g3]{display:flex;place-items:center;gap:.2em;padding:.7em 1.2em;text-align:center;border-radius:7em;border:none;font-weight:600;cursor:pointer;background-color:#f40f0f;color:#fff}}.header-absolute[data-astro-cid-xbstl6g3].header-sticky{position:fixed;z-index:700;background-color:#000000b3;padding:.2em 1em;backdrop-filter:blur(10px);animation:slideDown .35s ease-out}@keyframes slideDown{0%{transform:translateY(-100%)}to{transform:translateY(0)}}*{margin:0;padding:0;box-sizing:border-box}html{font-family:system-ui,sans-serif;background:#050505;color:#fff}body{margin:0;font-size:16px;overflow-x:hidden}.general-wrapper{max-width:1530px;margin:auto;position:relative;background:#13151a}.main{width:100%;height:auto}.color__primary{color:#f40f0f}.color__secondary{color:#0c0c0ccc}.color__white{color:#fff}.color__black{color:#000}\n"},{"type":"external","src":"/_astro/index.tBaSdcAP.css"}],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact/index.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Lf_NhN2y.js"}],"styles":[{"type":"inline","content":"main[data-astro-cid-xvv32rzd]{width:100%;padding:12em 2em 2em}@media (max-width: 576px){main[data-astro-cid-xvv32rzd]{padding:3em 1.5em}}.success[data-astro-cid-xvv32rzd]{width:100%;display:flex;align-items:center;justify-content:center;gap:2rem;padding:0 7rem}@media (max-width: 1200px){.success[data-astro-cid-xvv32rzd]{padding:0 2rem}}.success__img[data-astro-cid-xvv32rzd]{max-width:430px;height:auto}.success__img[data-astro-cid-xvv32rzd] img[data-astro-cid-xvv32rzd]{width:100%;height:100%;border-radius:15px}.success__text[data-astro-cid-xvv32rzd]{width:35%}.success__text-title[data-astro-cid-xvv32rzd]{font-size:2.7em;text-transform:uppercase;font-style:italic;color:#f40f0f;margin-bottom:.625rem}@media (max-width: 576px){.success__text-title[data-astro-cid-xvv32rzd]{font-size:1.5rem}}.success__text-description[data-astro-cid-xvv32rzd]{font-size:2em;text-align:justify}@media (max-width: 1024px){.success__text[data-astro-cid-xvv32rzd]{width:100%}}.success-btn[data-astro-cid-xvv32rzd]{width:100%;display:flex;justify-content:center}.success-btn[data-astro-cid-xvv32rzd] a[data-astro-cid-xvv32rzd]{margin:0 auto;font-size:1.2em;text-transform:upperCase;text-decoration:auto;font-style:italic;background-color:#f40f0f;color:#fff;padding:1em;border-radius:7em;border:none;cursor:pointer}\n.astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}.footer[data-astro-cid-mtxgg6pp]{display:flex;align-items:center;flex-direction:column;margin-top:2em}.footer[data-astro-cid-mtxgg6pp] img[data-astro-cid-mtxgg6pp]{width:10em;margin:1.2em auto}.footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{text-align:center;color:#ffffff8c;padding:1em}.footer[data-astro-cid-mtxgg6pp] .icons-list[data-astro-cid-mtxgg6pp]{padding:2em 1.5em;gap:1em;display:grid;grid-template-columns:repeat(auto-fit,minmax(12em,auto));width:100%}.footer__bottom[data-astro-cid-mtxgg6pp]{background:#000;width:100%;padding:1em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp]{text-align:center;font-size:.9em}.footer__bottom[data-astro-cid-mtxgg6pp] p[data-astro-cid-mtxgg6pp] a[data-astro-cid-mtxgg6pp]{text-decoration:none}@media (min-width: 500px){footer[data-astro-cid-mtxgg6pp] .slogan-description[data-astro-cid-mtxgg6pp]{max-width:50%}}.header-absolute[data-astro-cid-xbstl6g3]{width:100%;height:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:flex;justify-content:space-between;align-items:center}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:10em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:none}@media (min-width: 920px){.header-absolute[data-astro-cid-xbstl6g3]{position:absolute;top:0;z-index:700;display:flex;justify-content:space-between;padding:1em;width:100%;max-width:1530px;margin:auto}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3]{display:initial}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] img[data-astro-cid-xbstl6g3]{width:11em;height:auto;object-fit:contain}.header-absolute[data-astro-cid-xbstl6g3] .img-logo[data-astro-cid-xbstl6g3] .item-menu-button[data-astro-cid-xbstl6g3]{display:none}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3]{display:flex;justify-content:end}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3]{list-style:none;padding:0;display:flex;align-items:center;gap:1em}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] a[data-astro-cid-xbstl6g3]{text-decoration:none;color:#fff}.header-absolute[data-astro-cid-xbstl6g3] .item-menu[data-astro-cid-xbstl6g3] ul[data-astro-cid-xbstl6g3] li[data-astro-cid-xbstl6g3] .anchor-icon[data-astro-cid-xbstl6g3]{display:flex;place-items:center;gap:.2em;padding:.7em 1.2em;text-align:center;border-radius:7em;border:none;font-weight:600;cursor:pointer;background-color:#f40f0f;color:#fff}}.header-absolute[data-astro-cid-xbstl6g3].header-sticky{position:fixed;z-index:700;background-color:#000000b3;padding:.2em 1em;backdrop-filter:blur(10px);animation:slideDown .35s ease-out}@keyframes slideDown{0%{transform:translateY(-100%)}to{transform:translateY(0)}}*{margin:0;padding:0;box-sizing:border-box}html{font-family:system-ui,sans-serif;background:#050505;color:#fff}body{margin:0;font-size:16px;overflow-x:hidden}.general-wrapper{max-width:1530px;margin:auto;position:relative;background:#13151a}.main{width:100%;height:auto}.color__primary{color:#f40f0f}.color__secondary{color:#0c0c0ccc}.color__white{color:#fff}.color__black{color:#000}\n"},{"type":"external","src":"/_astro/index.tBaSdcAP.css"}],"routeData":{"route":"/success","type":"page","pattern":"^\\/success\\/?$","segments":[[{"content":"success","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/success/index.astro","pathname":"/success","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/AngelG/Desktop/venta-llantas/src/pages/contact/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/AngelG/Desktop/venta-llantas/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/AngelG/Desktop/venta-llantas/src/pages/products/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/AngelG/Desktop/venta-llantas/src/pages/about-us/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/AngelG/Desktop/venta-llantas/src/pages/success/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,s)=>{let n=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),n();break}});for(let e of s.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/about-us/index@_@astro":"pages/about-us.astro.mjs","\u0000@astro-page:src/pages/products/index@_@astro":"pages/products.astro.mjs","\u0000@astro-page:src/pages/contact/index@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/success/index@_@astro":"pages/success.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","\u0000@astrojs-manifest":"manifest_oLdSLFij.mjs","C:/Users/AngelG/Desktop/venta-llantas/node_modules/.pnpm/@astrojs+react@3.0.7_@types+react-dom@18.2.14_@types+react@18.2.31_react-dom@18.2.0_react@18.2.0_vite@5.0.10/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_7a5sIVmK.mjs","C:/Users/AngelG/Desktop/venta-llantas/src/layouts/Drawer":"_astro/Drawer.5xOGefdj.js","/astro/hoisted.js?q=0":"_astro/hoisted.Lf_NhN2y.js","@astrojs/react/client.js":"_astro/client.olTvLX7Y.js","astro:scripts/before-hydration.js":""},"assets":[]});

export { manifest };
