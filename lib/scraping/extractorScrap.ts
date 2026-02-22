import { Page } from "playwright";
import { BusinessData } from "./interfaceScrap";
import { cleanText, parseRating, parseReviewCount, formatPhoneNumber } from "./utilityScrap";

export async function extractBusinessDetails(page: Page): Promise<BusinessData> {
  const data: BusinessData = {
    business_name: "",
    category:      "",
    rating:        0,
    review_count:  0,
    phone:         "",
    website:       "",
    address:       "",
  };

  try {
    await page.waitForSelector("h1.DUwDvf", { timeout: 5000 });

    try {
      const text = await page.locator("h1.DUwDvf").first().innerText({ timeout: 3000 });
      if (text) data.business_name = cleanText(text);
    } catch {
      try {
        const text = await page.locator('h1[class*="fontHeadline"]').first().innerText({ timeout: 2000 });
        if (text) data.business_name = cleanText(text);
      } catch {}
    }

    try {
      const text = await page.locator('button[jsaction*="category"]').first().innerText({ timeout: 2000 });
      if (text) data.category = cleanText(text);
    } catch {
      try {
        const text = await page.locator('button[class*="DkEaL"]').first().innerText({ timeout: 1000 });
        if (text) data.category = cleanText(text);
      } catch {}
    }

    try {
      const ratingText = await page.locator('div.F7nice span[aria-hidden="true"]').first().innerText({ timeout: 2000 });
      if (ratingText) data.rating = parseRating(ratingText);

      const reviewText = await page.locator('div.F7nice span[aria-label*="ulasan"]').first().innerText({ timeout: 2000 });
      if (reviewText) data.review_count = parseReviewCount(reviewText);
    } catch {
      try {
        const ratingText = await page.locator('span.ceNzKf[aria-hidden="true"]').first().innerText({ timeout: 1000 });
        if (ratingText) data.rating = parseRating(ratingText);
      } catch {}
    }

    try {
      const text = await page.locator('button[data-item-id="address"]').first().innerText({ timeout: 2000 });
      if (text) data.address = cleanText(text);
    } catch {
      try {
        const text = await page.locator('button[data-item-id*="address"]').first().getAttribute("aria-label", { timeout: 1000 });
        if (text) data.address = cleanText(text);
      } catch {}
    }

    try {
      const phoneButton = page.locator('button[data-item-id*="phone"]').first();
      if (await phoneButton.count() > 0) {
        const dataId = await phoneButton.getAttribute("data-item-id", { timeout: 2000 });
        if (dataId?.includes(":")) {
          data.phone = formatPhoneNumber(dataId.split(":").pop() ?? "");
        }
      }
    } catch {
      try {
        const phoneButton = page.locator('button[aria-label*="Telepon"]').first();
        if (await phoneButton.count() > 0) {
          const ariaLabel = await phoneButton.getAttribute("aria-label", { timeout: 1000 });
          if (ariaLabel) {
            const match = ariaLabel.match(/[\d\s+\-()]+/);
            if (match) data.phone = formatPhoneNumber(match[0]);
          }
        }
      } catch {}
    }

    try {
      const href = await page.locator('a[data-item-id="authority"]').first().getAttribute("href", { timeout: 2000 });
      data.website = href ? cleanText(href) : "";
    } catch {
      try {
        const href = await page.locator('a[aria-label*="Situs"]').first().getAttribute("href", { timeout: 1000 });
        data.website = href ? cleanText(href) : "";
      } catch {
        data.website = "";
      }
    }
  } catch {}

  return data;
}