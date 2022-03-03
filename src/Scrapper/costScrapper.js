const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());

const pageURL = 'https://www.amazon.in/';
const width = 1024;
const height = 1600;

const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

const costScrapper = async name => {
  const browser = await puppeteer.launch({
    defaultViewport: { 'width': width, 'height': height },
    args: minimal_args,
    headless: true
  });

  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")

  await page.goto(pageURL);

  await page.waitForSelector('#twotabsearchtextbox');

  await page.click('#twotabsearchtextbox');

  await page.type('#twotabsearchtextbox', name);

  await page.click('#nav-search-submit-button');


  await page.waitForNavigation()
  
  var dataObj = [];
  try {
    var title, img, cash, bookNow;

    await page.waitForSelector(' div[data-component-type="s-search-result"]');

    const productsArray = await page.$$('div[data-component-type="s-search-result"]');

    for (const producthandle of productsArray) {
      try {
        title = await page.evaluate(
          (el) => el.querySelector(' span[class="a-size-medium a-color-base a-text-normal"]').textContent,
          producthandle);

      } catch (error) {
        try {

          title = await page.evaluate(
            (el) => el.querySelector("div.a-section.a-spacing-none.s-title-instructions-style > h2 > a > span").textContent, producthandle);

        } catch (error) { title = null }

      }

      try {

        img = await page.evaluate(
          (el) => el.querySelector('div [class="a-section aok-relative s-image-square-aspect"]> img').getAttribute('src'),
          producthandle);

      } catch (error) {
        try {

          img = await page.evaluate(
            (el) => el.querySelector('img[class="s-image"]').getAttribute('src'),
            producthandle);

        } catch (error) {
          img = null
        }
      }

      try {

        cash = await page.evaluate(
          (el) => el.querySelector(' span.a-price-whole').textContent.replace(',', ''),
          producthandle);


      } catch (error) {
        cash = null
      }
      try {

        bookNow = await page.evaluate(
          (el) => "https://www.amazon.in/" + el.querySelector('span[class="rush-component"] > a[class="a-link-normal s-no-outline"]').getAttribute("href"),
          producthandle);


      } catch (error) {
        cash = null
      }
      if (cash && name && img) {
        dataObj.push({ title, img, cash, bookNow });
      }

    }

  } catch (e) {
    console.log(e);
  }

  browser.close()

  dataObj.sort(function (a, b) {

    if (isNaN(a.cash) || isNaN(b.cash)) {
      return a.cash > b.cash ? 1 : -1;
    }

    return a.cash - b.cash;
  });

  var minMax = [];
  minMax.push(dataObj[0])
  minMax.push(dataObj[dataObj.length - 1])

  return minMax;

}

module.exports = costScrapper;

