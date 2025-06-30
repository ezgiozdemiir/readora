/* eslint-env node */
const { Builder, By, until } = require('selenium-webdriver');

async function testOn(browserName) {
  let driver = await new Builder().forBrowser(browserName).build();

  try {
    await driver.get('http://localhost:5173');

    const title = await driver.getTitle();
    console.log(`[${browserName}] Page title:`, title);

    if (title.includes('Readora')) {
      console.log(`[${browserName}] Title doğru!`);
    } else {
      console.log(`[${browserName}] Title YANLIŞ veya bulunamadı!`);
    }

    await driver.wait(until.elementLocated(By.css('body')), 5000);

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    if (bodyText.includes('Profile')) {
      console.log(`[${browserName}] Sayfada Profile yazısı bulundu!`);
    } else {
      console.log(`[${browserName}] Profile yazısı YOK!`);
    }
  } finally {
    await driver.quit();
  }
}

(async () => {
  await testOn('chrome');
  await testOn('firefox');
  await testOn('MicrosoftEdge');
})();
