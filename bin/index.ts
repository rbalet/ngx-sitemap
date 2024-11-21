#!/usr/bin/env node

import { SitemapGenerator } from "./sitemap-generator";

const sitemapGenerator = new SitemapGenerator(
  process.argv[2],
  process.argv[3],
  process.argv[4],
  process.argv[5],
  process.argv[6]
);

sitemapGenerator.process();
