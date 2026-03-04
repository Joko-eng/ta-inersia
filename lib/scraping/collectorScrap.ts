import { Page } from "playwright";
import { SCRAPING_CONFIG } from "./configScrap";
import { BusinessData, SendFn } from "./interfaceScrap";
import { randomDelay } from "./utilityScrap";
import { scrollResultsPanel, goBackToList } from "./navigationScrap";
import { extractBusinessDetails } from "./extractorScrap";

const PLACE_LINK_SELECTOR = 'a[href*="/maps/place/"]';
const FEED_SELECTOR       = 'div[role="feed"]';

export async function collectAllBusinesses(
  page:            Page,
  target:          number,
  send:            SendFn,
  onExtracted:     (item: BusinessData) => Promise<void>
): Promise<BusinessData[]> {
  const results:       BusinessData[] = [];
  const seenNames:     Set<string>    = new Set();
  const failedIndices: Set<number>    = new Set();

  let currentIndex      = 0;
  let consecutiveFails  = 0;

  while (results.length < target) {
    try {
      await page.waitForSelector(FEED_SELECTOR, { timeout: 5000 });

      let links      = await page.locator(PLACE_LINK_SELECTOR).all();
      let totalLinks = links.length;

      if (totalLinks === 0) {
        send("info", "Tidak ada daftar bisnis yang ditemukan.");
        break;
      }

      if (currentIndex >= totalLinks) {
        send("loading", `Memuat lebih banyak hasil (indeks saat ini: ${currentIndex})...`);
        await scrollResultsPanel(page, 10, target === Infinity ? 9999 : target, send);

        links      = await page.locator(PLACE_LINK_SELECTOR).all();
        totalLinks = links.length;

        if (currentIndex >= totalLinks) {
          send("info", "Tidak ada data lagi yang tersedia.");
          break;
        }
      }

      if (failedIndices.has(currentIndex)) {
        currentIndex++;
        continue;
      }

      send("info", `Memproses item ke-${currentIndex + 1} dari ${totalLinks} — terkumpul: ${results.length}${target === Infinity ? "" : ` dari ${target}`}`);

      links = await page.locator(PLACE_LINK_SELECTOR).all();
      if (currentIndex >= links.length) {
        currentIndex++;
        continue;
      }

      await links[currentIndex].click();
      await randomDelay(SCRAPING_CONFIG.CLICK_DELAY_MIN_MS, SCRAPING_CONFIG.CLICK_DELAY_MAX_MS);

      const business = await extractBusinessDetails(page);

      if (!business.business_name) {
        send("info", `Melewati item pada indeks ${currentIndex} — nama bisnis tidak ditemukan.`);
        consecutiveFails++;
        failedIndices.add(currentIndex);
        await goBackToList(page);
        currentIndex++;
        continue;
      }

      if (seenNames.has(business.business_name)) {
        send("info", `Melewati data duplikat: ${business.business_name}`);
        failedIndices.add(currentIndex);
        await goBackToList(page);
        currentIndex++;
        continue;
      }

      seenNames.add(business.business_name);
      results.push(business);
      consecutiveFails = 0;

      send("success", `[${results.length}/${target}] ${business.business_name} — rating: ${business.rating} (${business.review_count} ulasan)`);

      await onExtracted(business);
      await goBackToList(page);
      await randomDelay(500, 1000);

      currentIndex++;

    } catch (err) {
      send("error", `Gagal memproses indeks ${currentIndex}: ${String(err)}`);
      consecutiveFails++;
      failedIndices.add(currentIndex);

      try { await goBackToList(page); } catch {}
      currentIndex++;

      if (consecutiveFails >= SCRAPING_CONFIG.MAX_CONSECUTIVE_FAILS) {
        send("info", `Proses dihentikan — ${consecutiveFails} kegagalan berturutan. Kemungkinan data telah habis.`);
        break;
      }
    }
  }

  return results;
}