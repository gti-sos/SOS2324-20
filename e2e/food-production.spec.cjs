const { test, expect } = require('@playwright/test');


test('List Countrys', async ({ page }) => {
  await page.goto('http://localhost:10000/food-production');

  await page.getByText('Cargar datos iniciales').click();

  await page.waitForTimeout(100);

  let EntityCount = (await page.locator('.list-item').all()).length;
  expect(EntityCount).toBeGreaterThan(0);

});

test('food-production delete all data works', async ({ page }) => {
  await page.goto('http://localhost:10000/food-production');
  await page.waitForTimeout(100);
  await page.getByText('Cargar datos iniciales').click();

  await page.waitForTimeout(100);
  
  await page.getByText('Borrar lista').click();
  await page.waitForTimeout(100);
  let EntityCount = (await page.locator('.list-item').all()).length;
  expect(EntityCount).toBe(0);

});

test('Create new Country-Year', async ({ page }) => {
  await page.goto('http://localhost:10000/food-production');

  // Espera a que el botón esté presente en la página
  await page.getByText('Crear Dato').click();
  await page.waitForTimeout(100);
  let EntityCount = (await page.locator('.list-item').all()).length;
  expect(EntityCount).toBe(1);
});

test('Delete a Country-Year', async ({ page }) => {
  await page.goto('http://localhost:10000/food-production');

  await page.waitForTimeout(100);
 // await page.getByText('Crear Dato').click();
 // await page.waitForTimeout(100);
  let EntityCount = (await page.locator('.list-item').all()).length;
  await page.locator('.delete-button2').click();

  await page.waitForTimeout(100);
  let EntityCount2 = (await page.locator('.list-item').all()).length;
  expect(EntityCount2).toBeLessThan(EntityCount);

});



