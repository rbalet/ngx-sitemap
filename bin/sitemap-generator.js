"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapGenerator = void 0;
var fs = require("fs");
var path = require("path");
var SitemapGenerator = /** @class */ (function () {
  function SitemapGenerator(
    srcDirectory,
    baseUrl,
    lastMod,
    changeFreq,
    priority
  ) {
    this.SITEMAP_HEADER =
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    this.SITEMAP_FOOTER = "\n</urlset>";
    this.sitemapContent = "";
    this.srcDirectory = this.withTrailingSlash(srcDirectory);
    this.baseUrl = this.withTrailingSlash(baseUrl);
    this.lastMod = lastMod === "today" ? this._getToday() : lastMod;
    this.changeFreq = changeFreq;
    this.priority = Number(priority);
  }
  SitemapGenerator.prototype._getToday = function () {
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    var day = today.getDate().toString().padStart(2, "0");
    return "".concat(year, "-").concat(month, "-").concat(day);
  };
  SitemapGenerator.prototype.withTrailingSlash = function (text) {
    if (!text.endsWith("/")) {
      return text + "/";
    }
    return text;
  };
  SitemapGenerator.prototype.process = function () {
    return __awaiter(this, void 0, void 0, function () {
      var files, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4 /*yield*/,
              this.findFiles(this.srcDirectory, "index.html"),
            ];
          case 1:
            files = _a.sent();
            this.filesCallback(null, files);
            return [3 /*break*/, 3];
          case 2:
            err_1 = _a.sent();
            this.filesCallback(err_1, []);
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  SitemapGenerator.prototype.findFiles = function (dir, fileName) {
    return __awaiter(this, void 0, void 0, function () {
      var results, entries, _i, entries_1, entry, fullPath, subDirFiles;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            results = [];
            return [
              4 /*yield*/,
              fs.promises.readdir(dir, { withFileTypes: true }),
            ];
          case 1:
            entries = _a.sent();
            (_i = 0), (entries_1 = entries);
            _a.label = 2;
          case 2:
            if (!(_i < entries_1.length)) return [3 /*break*/, 6];
            entry = entries_1[_i];
            fullPath = path.join(dir, entry.name);
            if (!entry.isDirectory()) return [3 /*break*/, 4];
            return [4 /*yield*/, this.findFiles(fullPath, fileName)];
          case 3:
            subDirFiles = _a.sent();
            results.push.apply(results, subDirFiles);
            return [3 /*break*/, 5];
          case 4:
            if (entry.isFile() && entry.name === fileName) {
              results.push(fullPath);
            }
            _a.label = 5;
          case 5:
            _i++;
            return [3 /*break*/, 2];
          case 6:
            return [2 /*return*/, results];
        }
      });
    });
  };
  SitemapGenerator.prototype.addToSitemap = function (file) {
    var url = file.replace(this.srcDirectory, this.baseUrl);
    url = url.replace("/index.html", "");
    var entries = ["<loc>".concat(url, "</loc>")];
    if (this.lastMod) {
      entries.push("          <lastmod>".concat(this.lastMod, "</lastmod>"));
    }
    if (this.changeFreq) {
      entries.push(
        "          <changefreq>".concat(this.changeFreq, "</changefreq>")
      );
    }
    if (this.priority) {
      entries.push("          <priority>".concat(this.priority, "</priority>"));
    }
    this.sitemapContent += "\n      <url>\n          ".concat(
      entries.join("\n"),
      "\n      </url>"
    );
  };
  SitemapGenerator.prototype.writeSitemapToFile = function () {
    var _this = this;
    fs.writeFile(
      path.join(this.srcDirectory + "sitemap.xml"),
      this.SITEMAP_HEADER + this.sitemapContent + this.SITEMAP_FOOTER,
      function (err) {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log(
          "sitemap.xml successfully created in '".concat(
            _this.srcDirectory,
            "'"
          )
        );
      }
    );
  };
  SitemapGenerator.prototype.filesCallback = function (err, files) {
    var _this = this;
    if (err) {
      console.log("Error", err);
      return;
    }
    files.sort(function (a, b) {
      return a.length - b.length || a.localeCompare(b);
    });
    files.forEach(function (route) {
      return _this.addToSitemap(route);
    });
    this.writeSitemapToFile();
  };
  return SitemapGenerator;
})();
exports.SitemapGenerator = SitemapGenerator;
