const { test, expect } = require('@playwright/test');


test('List Countrys', async ({ page }) => {
  await page.goto('http://localhost:10000/food-production');

  //await page.getByRole('navigation').getByRole('link', { name: 'food-production' }).click();

  await page.waitForTimeout(300);

  let EntityCount = (await page.locator('.list-item').all()).length;
  expect(EntityCount).toBeGreaterThan(0);

});
/*
test('Create new Country-Year', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { Entity: 'food-production' }).click();

  await page.getByRole('button', { name: 'Crear'}).click();
  let messageNewEntity = (await page.getByText('Persona creada con éxito'));
  expect(messageNewEntity).toBeVisible();

});

test('Delete a Country-Year', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'food-production' }).click();

  await page.locator('div').filter({ hasText: /^Louis Armstrong- Male Borrar$/ }).getByRole('button').click();

  let messageDeletedCountry = (await page.getByText('Persona borrada con éxito'));
  expect(messageDeletedCountry).toBeVisible();

});

test('Delete all', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'food-production' }).click();
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Borrar todo'}).click();

  let messageDeletedCountry = (await page.getByText('Países borrados con éxito'));
  expect(messageDeletedCountry).toBeVisible();

});
*/
