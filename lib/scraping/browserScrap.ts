import { chromium, Browser, BrowserContext, Page } from "playwright";
import { SCRAPING_CONFIG } from "./configScrap";

export interface BrowserResult {
  browser: Browser;
  page:    Page;
}

export async function launchBrowser(userAgent: string): Promise<BrowserResult> {
  const browser = await chromium.launch({
    headless: SCRAPING_CONFIG.MODE_HEADLESS,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  const context: BrowserContext = await browser.newContext({
    viewport: {
      width:  SCRAPING_CONFIG.VIEWPORT_WIDTH,
      height: SCRAPING_CONFIG.VIEWPORT_HEIGHT,
    },
    userAgent,
    locale:            "id-ID",
    timezoneId:        "Asia/Jakarta",
    hasTouch:          false,
    isMobile:          false,
    javaScriptEnabled: true,
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    Object.defineProperty(navigator, "plugins",   { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, "languages", { get: () => ["id-ID", "id", "en-US", "en"] });

    (window as any).chrome = { runtime: {} };

    const originalQuery = window.navigator.permissions.query.bind(window.navigator.permissions);
    window.navigator.permissions.query = (parameter: any) =>
      parameter.name === "notifications"
        ? Promise.resolve({ state: Notification.permission } as PermissionStatus)
        : originalQuery(parameter);
  });

  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  return { browser, page };
}