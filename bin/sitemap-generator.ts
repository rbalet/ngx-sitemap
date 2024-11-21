import * as fs from "fs";
import * as path from "path";

export type NgxSitemapChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export class SitemapGenerator {
  private readonly SITEMAP_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  private readonly SITEMAP_FOOTER = `
</urlset>`;

  private readonly srcDirectory: string;
  private readonly baseUrl: string;
  private readonly lastMod: string;
  private readonly changeFreq: NgxSitemapChangeFreq;
  private readonly priority: number;

  private sitemapContent = "";

  constructor(
    srcDirectory: string,
    baseUrl: string,
    lastMod?: string,
    changeFreq?: string,
    priority?: string
  ) {
    this.srcDirectory = this.withTrailingSlash(srcDirectory);
    this.baseUrl = this.withTrailingSlash(baseUrl);
    this.lastMod = lastMod === "today" ? this._getToday() : lastMod;
    this.changeFreq = changeFreq as NgxSitemapChangeFreq;
    this.priority = Number(priority);
  }

  private _getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  private withTrailingSlash(text: string) {
    if (!text.endsWith("/")) {
      return text + "/";
    }
    return text;
  }

  async process(): Promise<void> {
    try {
      const files = await this.findFiles(this.srcDirectory, "index.html");
      this.filesCallback(null, files);
    } catch (err) {
      this.filesCallback(err as Error, []);
    }
  }

  private async findFiles(dir: string, fileName: string): Promise<string[]> {
    const results: string[] = [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subDirFiles = await this.findFiles(fullPath, fileName);
        results.push(...subDirFiles);
      } else if (entry.isFile() && entry.name === fileName) {
        results.push(fullPath);
      }
    }

    return results;
  }

  private addToSitemap(file: string): void {
    let url = file.replace(this.srcDirectory, this.baseUrl);
    url = url.replace("/index.html", "");

    const entries: string[] = [`<loc>${url}</loc>`];

    if (this.lastMod) {
      entries.push(`          <lastmod>${this.lastMod}</lastmod>`);
    }
    if (this.changeFreq) {
      entries.push(`          <changefreq>${this.changeFreq}</changefreq>`);
    }
    if (this.priority) {
      entries.push(`          <priority>${this.priority}</priority>`);
    }

    this.sitemapContent += `
      <url>
          ${entries.join("\n")}
      </url>`;
  }

  private writeSitemapToFile(): void {
    fs.writeFile(
      path.join(this.srcDirectory + "sitemap.xml"),
      this.SITEMAP_HEADER + this.sitemapContent + this.SITEMAP_FOOTER,
      (err: NodeJS.ErrnoException | null) => {
        if (err) {
          console.log(err.message);
          return;
        }

        console.log(
          `sitemap.xml successfully created in '${this.srcDirectory}'`
        );
      }
    );
  }

  private filesCallback(err: Error, files: string[]): void {
    if (err) {
      console.log("Error", err);
      return;
    }

    files.sort((a, b) => {
      return a.length - b.length || a.localeCompare(b);
    });

    files.forEach((route) => this.addToSitemap(route));

    this.writeSitemapToFile();
  }
}
