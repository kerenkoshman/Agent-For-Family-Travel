import { test, expect } from '@playwright/test';

test.describe('Trip Planning Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
  });

  test('should complete full trip planning flow', async ({ page }) => {
    // Start trip planning
    await page.click('text=Plan a Trip');
    
    // Step 1: Family Profile
    await expect(page.locator('text=Family Profile')).toBeVisible();
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();
    
    // Fill family profile form
    await page.fill('input[name="familyName"]', 'Test Family');
    await page.selectOption('select[name="groupSize"]', '4');
    await page.check('input[name="interests"][value="beaches"]');
    await page.check('input[name="interests"][value="culture"]');
    await page.fill('input[name="budgetMin"]', '1000');
    await page.fill('input[name="budgetMax"]', '5000');
    
    // Proceed to next step
    await page.click('button:has-text("Next")');
    
    // Step 2: Destination Selection
    await expect(page.locator('text=Choose Destination')).toBeVisible();
    await expect(page.locator('text=Step 2 of 4')).toBeVisible();
    
    // Search for destination
    await page.fill('input[placeholder*="search"]', 'Paris');
    await page.waitForSelector('text=Paris, France');
    await page.click('text=Paris, France');
    
    // Proceed to next step
    await page.click('button:has-text("Next")');
    
    // Step 3: Dates & Budget
    await expect(page.locator('text=Dates & Budget')).toBeVisible();
    await expect(page.locator('text=Step 3 of 4')).toBeVisible();
    
    // Set travel dates
    await page.fill('input[name="startDate"]', '2024-06-01');
    await page.fill('input[name="endDate"]', '2024-06-08');
    
    // Set budget
    await page.fill('input[name="budget"]', '5000');
    
    // Proceed to final step
    await page.click('button:has-text("Next")');
    
    // Step 4: Review & Create
    await expect(page.locator('text=Review & Create')).toBeVisible();
    await expect(page.locator('text=Step 4 of 4')).toBeVisible();
    
    // Verify trip summary
    await expect(page.locator('text=Test Family')).toBeVisible();
    await expect(page.locator('text=Paris, France')).toBeVisible();
    await expect(page.locator('text=June 1, 2024')).toBeVisible();
    await expect(page.locator('text=June 8, 2024')).toBeVisible();
    await expect(page.locator('text=$5,000')).toBeVisible();
    
    // Create trip
    await page.click('button:has-text("Create Trip")');
    
    // Should redirect to trip detail page
    await expect(page.locator('text=Trip Created Successfully')).toBeVisible();
    await expect(page.locator('text=Test Family')).toBeVisible();
  });

  test('should handle form validation errors', async ({ page }) => {
    // Start trip planning
    await page.click('text=Plan a Trip');
    
    // Try to proceed without filling required fields
    await page.click('button:has-text("Next")');
    
    // Should show validation errors
    await expect(page.locator('text=Family name is required')).toBeVisible();
    
    // Fill required field and try again
    await page.fill('input[name="familyName"]', 'Test Family');
    await page.click('button:has-text("Next")');
    
    // Should proceed to next step
    await expect(page.locator('text=Choose Destination')).toBeVisible();
  });

  test('should allow navigation between steps', async ({ page }) => {
    // Start trip planning
    await page.click('text=Plan a Trip');
    
    // Fill step 1 and proceed
    await page.fill('input[name="familyName"]', 'Test Family');
    await page.click('button:has-text("Next")');
    
    // Should be on step 2
    await expect(page.locator('text=Choose Destination')).toBeVisible();
    
    // Go back to step 1
    await page.click('button:has-text("Back")');
    await expect(page.locator('text=Family Profile')).toBeVisible();
    
    // Verify data is preserved
    await expect(page.locator('input[name="familyName"]')).toHaveValue('Test Family');
  });

  test('should handle destination search and selection', async ({ page }) => {
    // Navigate to destination step
    await page.click('text=Plan a Trip');
    await page.fill('input[name="familyName"]', 'Test Family');
    await page.click('button:has-text("Next")');
    
    // Search for destination
    await page.fill('input[placeholder*="search"]', 'Tokyo');
    await page.waitForSelector('text=Tokyo, Japan');
    
    // Select destination
    await page.click('text=Tokyo, Japan');
    
    // Verify selection
    await expect(page.locator('text=Tokyo, Japan')).toBeVisible();
    
    // Proceed to next step
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=Dates & Budget')).toBeVisible();
  });

  test('should handle date validation', async ({ page }) => {
    // Navigate to dates step
    await page.click('text=Plan a Trip');
    await page.fill('input[name="familyName"]', 'Test Family');
    await page.click('button:has-text("Next")');
    await page.fill('input[placeholder*="search"]', 'Paris');
    await page.waitForSelector('text=Paris, France');
    await page.click('text=Paris, France');
    await page.click('button:has-text("Next")');
    
    // Try to set invalid dates (end date before start date)
    await page.fill('input[name="startDate"]', '2024-06-08');
    await page.fill('input[name="endDate"]', '2024-06-01');
    await page.click('button:has-text("Next")');
    
    // Should show validation error
    await expect(page.locator('text=End date must be after start date')).toBeVisible();
    
    // Fix dates
    await page.fill('input[name="startDate"]', '2024-06-01');
    await page.fill('input[name="endDate"]', '2024-06-08');
    await page.click('button:has-text("Next")');
    
    // Should proceed
    await expect(page.locator('text=Review & Create')).toBeVisible();
  });

  test('should show progress indicator', async ({ page }) => {
    await page.click('text=Plan a Trip');
    
    // Check initial progress
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toHaveAttribute('aria-valuenow', '25');
    
    // Complete step 1
    await page.fill('input[name="familyName"]', 'Test Family');
    await page.click('button:has-text("Next")');
    
    // Check progress after step 1
    await expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    
    // Complete step 2
    await page.fill('input[placeholder*="search"]', 'Paris');
    await page.waitForSelector('text=Paris, France');
    await page.click('text=Paris, France');
    await page.click('button:has-text("Next")');
    
    // Check progress after step 2
    await expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    
    // Complete step 3
    await page.fill('input[name="startDate"]', '2024-06-01');
    await page.fill('input[name="endDate"]', '2024-06-08');
    await page.fill('input[name="budget"]', '5000');
    await page.click('button:has-text("Next")');
    
    // Check final progress
    await expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  test('should handle loading states', async ({ page }) => {
    // Navigate to final step
    await page.click('text=Plan a Trip');
    await page.fill('input[name="familyName"]', 'Test Family');
    await page.click('button:has-text("Next")');
    await page.fill('input[placeholder*="search"]', 'Paris');
    await page.waitForSelector('text=Paris, France');
    await page.click('text=Paris, France');
    await page.click('button:has-text("Next")');
    await page.fill('input[name="startDate"]', '2024-06-01');
    await page.fill('input[name="endDate"]', '2024-06-08');
    await page.fill('input[name="budget"]', '5000');
    await page.click('button:has-text("Next")');
    
    // Click create trip
    await page.click('button:has-text("Create Trip")');
    
    // Should show loading state
    await expect(page.locator('text=Creating Trip...')).toBeVisible();
    await expect(page.locator('button:has-text("Create Trip")')).toBeDisabled();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/trips', route => {
      route.abort('failed');
    });
    
    // Complete trip planning flow
    await page.click('text=Plan a Trip');
    await page.fill('input[name="familyName"]', 'Test Family');
    await page.click('button:has-text("Next")');
    await page.fill('input[placeholder*="search"]', 'Paris');
    await page.waitForSelector('text=Paris, France');
    await page.click('text=Paris, France');
    await page.click('button:has-text("Next")');
    await page.fill('input[name="startDate"]', '2024-06-01');
    await page.fill('input[name="endDate"]', '2024-06-08');
    await page.fill('input[name="budget"]', '5000');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Create Trip")');
    
    // Should show error message
    await expect(page.locator('text=Failed to create trip')).toBeVisible();
    await expect(page.locator('text=Please try again')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('text=Plan a Trip');
    
    // Verify mobile-friendly layout
    await expect(page.locator('text=Family Profile')).toBeVisible();
    
    // Check that form elements are properly sized for mobile
    const familyNameInput = page.locator('input[name="familyName"]');
    await expect(familyNameInput).toBeVisible();
    
    // Verify buttons are touch-friendly
    const nextButton = page.locator('button:has-text("Next")');
    const buttonBox = await nextButton.boundingBox();
    expect(buttonBox?.width).toBeGreaterThan(44); // Minimum touch target size
    expect(buttonBox?.height).toBeGreaterThan(44);
  });
});
