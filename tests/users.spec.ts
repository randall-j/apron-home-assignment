import { test, expect, Page } from '@playwright/test';

const createNewUser = async (page: Page) => {
  await page.getByRole('button', { name: 'Create user' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByText('Create User')).toBeVisible();
  await page.getByLabel('First name').fill('Frodo');
  await page.getByLabel('Last name').fill('Baggins');
  await page.getByLabel('Gender').selectOption('MALE');
  await page.getByLabel('Age').fill('50');
  await modal.getByRole('button', { name: 'Submit' }).click();
  await expect(modal).toBeHidden();
  await expect(page.getByText('User created successfully')).toBeVisible();
  await expect(page.getByText('Frodo')).toBeVisible();
  await expect(page.getByText('Baggins')).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/users');
});

test('load the page', async ({ page }) => {
  await expect(page.getByText('Create user')).toBeVisible();
  await expect(page.getByText('First name')).toBeVisible();
  await expect(page.getByText('Last name')).toBeVisible();
  await expect(page.getByText('Gender')).toBeVisible();
  await expect(page.getByText('Age')).toBeVisible();
  await expect(page.getByText('Actions')).toBeVisible();
});

test('create a user', async ({ page }) => {
  await createNewUser(page);
});

test('edit a user', async ({ page }) => {
  await createNewUser(page);
  await page.getByRole('button', { name: 'Edit' }).last().click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByText('Edit User')).toBeVisible();
  await page.getByLabel('First name').fill('Elaine');
  await page.getByLabel('Last name').fill('Benes');
  await page.getByLabel('Gender').selectOption('FEMALE');
  await page.getByLabel('Age').fill('27');
  await modal.getByRole('button', { name: 'Submit' }).click();
  await expect(modal).toBeHidden();
  await expect(page.getByText('User updated successfully')).toBeVisible();
  await expect(page.getByText('Elaine')).toBeVisible();
  await expect(page.getByText('Benes')).toBeVisible();
});

test('delete a user', async ({ page }) => {
  await createNewUser(page);
  await page.getByRole('button', { name: 'Delete' }).last().click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog.getByText('Delete User')).toBeVisible();
  await dialog.getByRole('button', { name: 'Delete' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('User deleted successfully')).toBeVisible();
  await expect(page.getByText('Frodo')).toBeHidden();
  await expect(page.getByText('Baggins')).toBeHidden();
});

test('submit the user form with empty fields', async ({ page }) => {
  await page.getByRole('button', { name: 'Create user' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByText('Create User')).toBeVisible();
  await modal.getByRole('button', { name: 'Submit' }).click();
  await expect(modal).toBeVisible();
  await expect(page.getByText('Please enter a first name')).toBeVisible();
  await expect(page.getByText('Please enter a last name')).toBeVisible();
  await expect(page.getByText('Please select a gender')).toBeVisible();
  await expect(page.getByText('Please enter a valid age')).toBeVisible();
});

test('submit the user form with invalid fields', async ({ page }) => {
  await page.getByRole('button', { name: 'Create user' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByText('Create User')).toBeVisible();
  await page.getByLabel('First name').fill('Four');
  await page
    .getByLabel('Last name')
    .fill('This name is longer than twenty characters');
  await page.getByLabel('Gender').selectOption('');
  await page.getByLabel('Age').fill('1');
  await modal.getByRole('button', { name: 'Submit' }).click();
  await expect(modal).toBeVisible();
  await expect(
    page.getByText('First name must be at least 5 characters')
  ).toBeVisible();
  await expect(
    page.getByText('Last name must be 20 characters or less')
  ).toBeVisible();
  await expect(page.getByText('Please select a gender')).toBeVisible();
  await expect(page.getByText('Age must be 18 or more')).toBeVisible();

  await page.getByLabel('First name').fill('12345');
  await expect(
    page.getByText('Please remove any special characters or numbers')
  ).toBeVisible();
});

test('submit the user form with invalid male age', async ({ page }) => {
  await page.getByRole('button', { name: 'Create user' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByText('Create User')).toBeVisible();
  await page.getByLabel('Gender').selectOption('MALE');
  await page.getByLabel('Age').fill('113');
  await modal.getByRole('button', { name: 'Submit' }).click();
  await expect(modal).toBeVisible();
  await expect(page.getByText('Age must be 112 or less')).toBeVisible();
});

test('submit the user form with invalid female age', async ({ page }) => {
  await page.getByRole('button', { name: 'Create user' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByText('Create User')).toBeVisible();
  await page.getByLabel('Gender').selectOption('FEMALE');
  await page.getByLabel('Age').fill('118');
  await modal.getByRole('button', { name: 'Submit' }).click();
  await expect(modal).toBeVisible();
  await expect(page.getByText('Age must be 117 or less')).toBeVisible();
});
