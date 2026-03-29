/**
 * Standalone test for the GSC scraper.
 * Runs directly with Node.js (ESM) without requiring TypeScript compilation.
 *
 * Usage:
 *   /Users/stephen/.nvm/versions/node/v24.14.1/bin/node src/lib/scrapers/test-gsc.mjs
 */

import * as cheerio from 'cheerio';

const GSC_REGISTER_URL =
  'https://www.isleofmangsc.com/gambling/supervision/online-gambling-licensee-register/';
const USER_AGENT =
  'Mozilla/5.0 (compatible; DootechLicensingBot/1.0; +https://licensing.dootech.im)';

function parseStatus(raw) {
  const lower = raw.toLowerCase().trim();
  if (lower === 'active') return 'active';
  if (lower.includes('suspend')) return 'suspended';
  return 'unknown';
}

function extractDomains($cell, $) {
  const domains = [];

  $cell.find('a').each((_, a) => {
    const href = $(a).attr('href')?.trim() ?? '';
    const text = $(a).text().trim().replace(/\u00a0/g, '').trim();

    if (text && text.includes('.') && !text.startsWith('http')) {
      const clean = text.replace(/^-+\s*/, '').trim();
      if (clean && !domains.includes(clean)) domains.push(clean);
    } else if (href.startsWith('http')) {
      try {
        const hostname = new URL(href).hostname.replace(/^www\./, '');
        if (hostname && !domains.includes(hostname)) domains.push(hostname);
      } catch {
        // ignore
      }
    }
  });

  if (domains.length === 0) {
    const raw = $cell.text().replace(/\u00a0/g, ' ').trim();
    if (raw && raw !== '-' && raw !== '–') {
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

async function scrapeGscRegister() {
  const result = {
    scrapedAt: new Date(),
    url: GSC_REGISTER_URL,
    totalCount: 0,
    licensees: [],
    errors: [],
  };

  const response = await fetch(GSC_REGISTER_URL, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
  });

  if (!response.ok) {
    result.errors.push(`HTTP ${response.status}`);
    return result;
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $('ul.accordion > li').each((index, li) => {
    try {
      const $li = $(li);
      const operatorName = $li.find('a.faq_title span.container').text().trim();
      if (!operatorName) return;

      const rawData = {};
      $li.find('.faq_text table tr').each((_, tr) => {
        const $tds = $(tr).find('td');
        if ($tds.length >= 2) {
          const key = $($tds[0]).text().replace(/\u00a0/g, ' ').trim().replace(/\s+/g, ' ');
          const value = $($tds[1]).text().replace(/\u00a0/g, ' ').trim().replace(/\s+/g, ' ');
          if (key) rawData[key] = value;
        }
      });

      const status = parseStatus(rawData['Licence Status'] ?? '');
      const licenceType = rawData['OGRA Licence type'] ?? rawData['OGRA Licence Type'] ?? undefined;
      const licenceValidFrom =
        rawData['Licence valid From'] ?? rawData['Licence Valid From'] ?? undefined;
      const licenceValidTo =
        rawData['Licence Valid to'] ?? rawData['Licence Valid To'] ?? undefined;

      let authorisedDomains = [];
      $li.find('.faq_text table tr').each((_, tr) => {
        const $tds = $(tr).find('td');
        if ($tds.length >= 2) {
          const key = $($tds[0]).text().replace(/\u00a0/g, ' ').trim().toLowerCase();
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
  return result;
}

// --- Run ---
const result = await scrapeGscRegister();
console.log('Scraped at:      ', result.scrapedAt.toISOString());
console.log('Total licensees: ', result.totalCount);
console.log('Errors:          ', result.errors.length > 0 ? result.errors : 'none');

if (result.licensees.length > 0) {
  console.log('\nFirst 5 licensees:');
  result.licensees.slice(0, 5).forEach((l, i) => {
    console.log(`\n${i + 1}. ${l.operatorName}`);
    if (l.licenceType) console.log(`   Type:      ${l.licenceType}`);
    if (l.licenceValidFrom) console.log(`   Valid from: ${l.licenceValidFrom}`);
    if (l.licenceValidTo) console.log(`   Valid to:   ${l.licenceValidTo}`);
    console.log(`   Status:    ${l.status}`);
    if (l.authorisedDomains.length) console.log(`   Domains:   ${l.authorisedDomains.join(', ')}`);
  });

  // Summary stats
  const withDomains = result.licensees.filter((l) => l.authorisedDomains.length > 0).length;
  const types = {};
  result.licensees.forEach((l) => {
    const t = l.licenceType ?? 'unknown';
    types[t] = (types[t] ?? 0) + 1;
  });
  console.log(`\nLicensees with domains: ${withDomains}/${result.totalCount}`);
  console.log('Licence types:', types);
}
