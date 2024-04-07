const { test, expect } = require("@playwright/test");

test("Header", async ({ page }) => {
  await page.goto("http://localhost:10000/life-expectancy");

  let header = await page.locator(".header");
  expect(header).toBeDefined();
});

test("List Countries", async ({ page }) => {
  await page.goto("http://localhost:10000/life-expectancy");

  await page.waitForTimeout(300);

  let CountryCount = (await page.locator(".ul-container").all()).length;
  expect(CountryCount).toBeGreaterThan(0);
});

test("Charge Data", async ({ page }) => {
  await page.goto("http://localhost:10000/life-expectancy");

  // Espera a que el botón esté presente en la página
  await page.locator(".load-data").click();
  let messageNew = await page.locator(".enlace").first();
  expect(messageNew).toBeDefined();
});

test("life-expectancy delete all data works", async ({ page }) => {
  await page.goto("http://localhost:10000/life-expectancy");
  await page.waitForTimeout(100);

  await page.getByText("Borrar lista").click();
  page.on("dialog", async (dialog) => {
    console.log(dialog.message());
    await dialog.accept();
  });
  let CountryCount = (await page.locator(".list-item").all()).length;
  await page.waitForTimeout(100);
  expect(CountryCount).toBeLessThan(1);
});
