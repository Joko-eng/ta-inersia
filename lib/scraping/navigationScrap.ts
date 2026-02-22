import { Page } from "playwright";
import { SCRAPING_CONFIG } from "./configScrap";
import { SendFn } from "./interfaceScrap";
import { randomDelay, wait } from "./utilityScrap";

const FEED_SELECTOR = 'div[role="feed"]';

export async function navigateToSearch(page: Page, query: string): Promise<void> {
  await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, {
    waitUntil: "domcontentloaded",
  });
  await randomDelay(3000, 5000);
}

export async function scrollResultsPanel(
  page:       Page,
  maxScrolls: number,
  target:     number,
  send:       SendFn
): Promise<void> {
  await page.waitForSelector(FEED_SELECTOR, { timeout: 10000 });

  let previousHeight    = 0;
  let scrollCount       = 0;
  let unchangedStreak   = 0;

  while (scrollCount < maxScrolls) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollTo(0, el.scrollHeight);
    }, FEED_SELECTOR);

    await randomDelay(SCRAPING_CONFIG.SCROLL_DELAY_MIN_MS, SCRAPING_CONFIG.SCROLL_DELAY_MAX_MS);

    const currentHeight = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? el.scrollHeight : 0;
    }, FEED_SELECTOR);

    if (currentHeight === previousHeight) {
      unchangedStreak++;
      if (unchangedStreak >= 3) {
        send("info", "Telah mencapai akhir hasil pencarian.");
        break;
      }
    } else {
      unchangedStreak = 0;
    }

    previousHeight = currentHeight;
    scrollCount++;

    const visible = await page.locator('a[href*="/maps/place/"]').count();
    send("loading", `Scroll ke-${scrollCount} dari ${maxScrolls} — item terlihat: ${visible}`);

    if (visible >= target + 10) {
      send("info", `Item yang dimuat sudah cukup untuk target ${target} data. Scroll dihentikan.`);
      break;
    }
  }
}

export async function goBackToList(page: Page): Promise<void> {
  try {
    const backButton = page.locator('button[aria-label*="Kembali"], button[aria-label*="Back"]').first();
    if (await backButton.count() > 0) {
      await backButton.click();
      await wait(500);
      return;
    }
  } catch {}

  try {
    const feed = page.locator(FEED_SELECTOR).first();
    if (await feed.count() > 0) {
      await feed.click();
      await wait(500);
      return;
    }
  } catch {}

  try {
    await page.keyboard.press("Escape");
    await wait(500);
  } catch {}
}