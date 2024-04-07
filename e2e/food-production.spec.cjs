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
  await page.goto('http://localhost:10000/food-production');

  // Espera a que el botón esté presente en la página
  await page.getByText('Crear Dato').click();
  let messageNewEntity = (await page.getByText('País creado exitosamente'));
  expect(messageNewEntity).toBeVisible();
});

test('Delete a Country-Year', async ({ page }) => {
  await page.goto('http://localhost:10000');

  await page.getByRole('navigation').getByRole('link', { name: 'food-production' }).click();

  await page.locator('div').filter({ hasText: /^Louis Armstrong- Male Borrar$/ }).getByRole('button').click();

  let messageDeletedCountry = (await page.getByText('Persona borrada con éxito'));
  expect(messageDeletedCountry).toBeVisible();

});
*/
test('food-production delete all data works', async ({ page }) => {
    await page.goto('http://localhost:10000/food-production');
    await page.waitForTimeout(100);

    await page.getByText('Borrar lista').click();
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();
    });
    let EntityCount = (await page.locator('.list-item').all()).length;
    await page.waitForTimeout(100);
    expect(EntityCount).toBeLessThan(1);


});

