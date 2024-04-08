const { test, expect } = require("@playwright/test");

test("Header", async ({ page }) => {
  await page.goto("http://localhost:10000/life-expectancy");

  let header = await page.locator(".header");
  expect(header).toBeDefined();
});


test("List Countries", async ({ page }) => {
  await page.goto("http://localhost:10000/life-expectancy");
  await page.getByText("Borrar lista").click();
  await page.getByText('Cargar datos iniciales').click();
  await page.waitForTimeout(100);
  let CountryCount = (await page.locator(".list-item").all()).length;
  expect(CountryCount).toBeGreaterThan(0);
});


test("life-expectancy delete all data works", async ({ page }) => {
  await page.goto("http://localhost:10000/life-expectancy");
  await page.getByText("Borrar lista").click();
  await page.waitForTimeout(100);
  let CountryCount = (await page.locator(".list-item").all()).length;
  expect(CountryCount).toBe(0);
});






