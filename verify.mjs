import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(err.message));
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
const title = await page.title();
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
const bodyText = await page.locator('body').innerText();
await page.getByRole('button', { name: /join the waitlist/i }).first().click();
await page.getByLabel(/first name/i).fill('Mobile');
await page.getByLabel(/email/i).fill('mobile@example.com');
await page.getByLabel(/phone/i).fill('555-555-1212');
await page.getByRole('button', { name: /save my spot/i }).click();
await page.getByRole('heading', { name: /you’re on the waitlist/i }).waitFor();
await page.screenshot({ path: '/tmp/robyn-mobile.png', fullPage: true });
const hrefs = await page.$$eval('a', (links) => links.map((a) => ({ text: a.textContent.trim(), href: a.href, target: a.target, rel: a.rel })));
const fields = await page.$$eval('#waitlist-form input', (inputs) => inputs.map((input) => ({ id: input.id, name: input.name, type: input.type, required: input.required })));
const waitlistHeadline = await page.locator('#waitlist-title').evaluate((heading) => {
  const gold = heading.querySelector('.headline-gold');
  return {
    text: heading.innerText.trim(),
    headingColor: getComputedStyle(heading).color,
    goldText: gold?.innerText.trim(),
    goldColor: gold ? getComputedStyle(gold).color : null
  };
});
await browser.close();

const required = [
  'https://www.amazon.com/MIND-over-MONEY-MANAGEMENT-Strategies/dp/1511421223/ref=cm_cr_arp_d_product_top?ie=UTF8',
  'https://go.makemoremoneyhelpmorepeople.com/free',
  'https://1hour6figures.com/'
];
for (const url of required) {
  const link = hrefs.find((item) => item.href === url);
  if (!link) throw new Error(`Missing required link: ${url}`);
  if (link.target !== '_blank' || !link.rel.includes('noopener')) throw new Error(`Required link missing target/rel: ${url}`);
}
if (overflow) throw new Error('Mobile viewport has horizontal overflow');
if (errors.length) throw new Error(`Console/page errors: ${errors.join('; ')}`);
if (!bodyText.includes('Don’t Miss The Greatest Wealth Transformation In History.')) throw new Error('Missing required waitlist headline copy');
if (waitlistHeadline.goldText !== 'Transformation') throw new Error('Transformation is not wrapped for gold styling');
if (waitlistHeadline.headingColor === waitlistHeadline.goldColor) throw new Error('Transformation color does not differ from the rest of the headline');
for (const field of ['first_name', 'email', 'phone']) {
  if (!fields.some((item) => item.name === field && item.required)) throw new Error(`Missing required waitlist field: ${field}`);
}
console.log(JSON.stringify({ ok: true, title, viewport: '390x844', horizontalOverflow: overflow, consoleErrors: errors.length, screenshot: '/tmp/robyn-mobile.png', requiredLinks: required.length, waitlistHeadline, waitlistFields: fields }, null, 2));
