/**
 * GSC (Isle of Man Gambling Supervision Commission) Licence Register Scraper
 * Source: https://www.isleofmangsc.com/gambling/supervision/online-gambling-licensee-register/
 * Runs nightly to detect changes in the licence register.
 *
 * Page structure (as of March 2026):
 *   <ul class="accordion">
 *     <li>
 *       <a class="faq_title"><span class="container">Company Name</span></a>
 *       <div class="container"><div class="faq_text">
 *         <table>
 *           <tr><td>Company Name</td><td>…</td></tr>
 *           <tr><td>Licence Status</td><td>Active|Suspended</td></tr>
 *           <tr><td>Licence valid From</td><td>…</td></tr>
 *           <tr><td>Licence Valid to</td><td>Current|…</td></tr>
 *           <tr><td>OGRA Licence type</td><td>Full|Network Services|Software Supply|…</td></tr>
 *           <tr><td>Website Domain(s)</td><td><a href="…">domain</a></td></tr>
 *         </table>
 *       </div></div>
 *     </li>
 *     …
 *   </ul>
 */

import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

const GSC_REGISTER_URL =
  'https://www.isleofmangsc.com/gambling/supervision/online-gambling-licensee-register/';
const USER_AGENT =
  'Mozilla/5.0 (compatible; DootechLicensingBot/1.0; +https://licensing.dootech.im)';

export interface GscLicensee {
  operatorName: string;
  licenceType?: string;
  licenceValidFrom?: string;
  licenceValidTo?: string;
  status: 'active' | 'suspended' | 'unknown';
  authorisedDomains: string[];
  rawData: Record<string, string>;
}

export interface GscScrapeResult {
  scrapedAt: Date;
  url: string;
  totalCount: number;
  licensees: GscLicensee[];
  errors: string[];
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`);
  }

  return response.text();
}

/**
 * Normalise a status string to one of our known values.
 */
function parseStatus(raw: string): GscLicensee['status'] {
  const lower = raw.toLowerCase().trim();
  if (lower === 'active') return 'active';
  if (lower.includes('suspend')) return 'suspended';
  return 'unknown';
}

/**
 * Extract domain strings from a table cell.
 * The cell may contain:
 *   - plain text like "www.example.com"
 *   - anchor tags with href or link text
 *   - multiple domains separated by whitespace / dashes
 *   - a bare " -" meaning none
 */
function extractDomains($cell: cheerio.Cheerio<Element>, $: cheerio.CheerioAPI): string[] {
  const domains: string[] = [];

  // Prefer link text and hrefs
  $cell.find('a').each((_, a) => {
    const href = $(a).attr('href')?.trim() ?? '';
    const text = $(a).text().trim().replace(/\u00a0/g, '').trim(); // strip &nbsp;

    // Use link text if it looks like a domain
    if (text && text.includes('.') && !text.startsWith('http')) {
      // Strip leading "www." is intentional to keep it as-is (normalisation happens upstream)
      const clean = text.replace(/^-+\s*/, '').trim();
      if (clean && !domains.includes(clean)) domains.push(clean);
    } else if (href.startsWith('http')) {
      try {
        const hostname = new URL(href).hostname.replace(/^www\./, '');
        if (hostname && !domains.includes(hostname)) domains.push(hostname);
      } catch {
        // ignore malformed URLs
      }
    }
  });

  // Fallback: raw text if no anchors produced anything
  if (domains.length === 0) {
    const raw = $cell
      .text()
      .replace(/\u00a0/g, ' ')
      .trim();
    // A bare dash means no domains
    if (raw && raw !== '-' && raw !== '–') {
      // Split on whitespace / commas and filter out noise
      raw
        .split(/[\s,]+/)
        .map((s) => s.replace(/^-+/, '').trim())
        .filter((s) => s.includes('.'))
        .forEach((s) => {
          if (!domains.includes(s)) domains.push(s);
        });
    }
  }

  return domains;
}

export async function scrapeGscRegister(): Promise<GscScrapeResult> {
  const result: GscScrapeResult = {
    scrapedAt: new Date(),
    url: GSC_REGISTER_URL,
    totalCount: 0,
    licensees: [],
    errors: [],
  };

  try {
    const html = await fetchPage(GSC_REGISTER_URL);
    const $ = cheerio.load(html);

    // The register is rendered as an accordion list
    $('ul.accordion > li').each((index, li) => {
      try {
        const $li = $(li);

        // Company name is in the accordion toggle
        const operatorName = $li.find('a.faq_title span.container').text().trim();
        if (!operatorName) return;

        // Key/value pairs live in the details table rows
        const rawData: Record<string, string> = {};

        $li.find('.faq_text table tr').each((_, tr) => {
          const $tds = $(tr).find('td');
          if ($tds.length >= 2) {
            const key = $($tds[0])
              .text()
              .replace(/\u00a0/g, ' ')
              .trim()
              .replace(/\s+/g, ' ');
            const value = $($tds[1])
              .text()
              .replace(/\u00a0/g, ' ')
              .trim()
              .replace(/\s+/g, ' ');
            if (key) rawData[key] = value;
          }
        });

        // Licence status
        const statusRaw =
          rawData['Licence Status'] ?? '';
        const status = parseStatus(statusRaw);

        // Licence type (field label varies slightly)
        const licenceType =
          rawData['OGRA Licence type'] ??
          rawData['OGRA Licence Type'] ??
          undefined;

        // Dates
        const licenceValidFrom =
          rawData['Licence valid From'] ??
          rawData['Licence Valid From'] ??
          undefined;
        const licenceValidTo =
          rawData['Licence Valid to'] ??
          rawData['Licence Valid To'] ??
          undefined;

        // Domains — look for the Website Domain(s) cell and extract links
        let authorisedDomains: string[] = [];
        $li.find('.faq_text table tr').each((_, tr) => {
          const $tds = $(tr).find('td');
          if ($tds.length >= 2) {
            const key = $($tds[0])
              .text()
              .replace(/\u00a0/g, ' ')
              .trim()
              .toLowerCase();
            if (key.startsWith('website domain')) {
              authorisedDomains = extractDomains($($tds[1]), $);
            }
          }
        });

        result.licensees.push({
          operatorName,
          licenceType,
          licenceValidFrom,
          licenceValidTo,
          status,
          authorisedDomains,
          rawData,
        });
      } catch (err) {
        result.errors.push(`Entry ${index}: ${err}`);
      }
    });

    result.totalCount = result.licensees.length;
  } catch (err) {
    result.errors.push(`Fatal: ${err}`);
  }

  return result;
}
