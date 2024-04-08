// @ts-check
const { test, expect } = require('@playwright/test');

test("Header", async ({ page }) => {
  await page.goto("http://localhost:10000/pharmaceutical-drugs-spending");

  let header = await page.locator(".header");
  expect(header).toBeDefined();
});

test("Charge Data", async ({ page }) => {
  await page.goto("http://localhost:10000/pharmaceutical-drugs-spending");
  // Espera a que el botón esté presente en la página
  await page.getByText('Crear Dato').click();
  await page.waitForTimeout(100);
  let CountryCount = (await page.locator('.list-item').all()).length;
  expect(CountryCount).toBe(1);
});



test("List Countries", async ({ page }) => {
  await page.goto("http://localhost:10000/pharmaceutical-drugs-spending");
  await page.getByText("Borrar lista").click();
  await page.getByText('Cargar datos iniciales').click();
  await page.waitForTimeout(100);
  let CountryCount = (await page.locator(".list-item").all()).length;
  expect(CountryCount).toBeGreaterThan(0);
});


test("pharmaceutical-drugs-spending delete all data works", async ({ page }) => {
  await page.goto("http://localhost:10000/pharmaceutical-drugs-spending");
  await page.getByText("Cargar datos iniciales").click();
  await page.getByText("Borrar lista").click();
  await page.getByText("Borrar lista").click();
  await page.waitForTimeout(100);
  let CountryCount = (await page.locator(".list-item").all()).length;
  expect(CountryCount).toBe(0);
});