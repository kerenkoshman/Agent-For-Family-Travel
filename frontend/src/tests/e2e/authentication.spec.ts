import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page when not authenticated', async ({ page }) => {
    // Navigate to protected route
    await page.goto('/dashboard');
    
    // Should redirect to login page
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in with Google")')).toBeVisible();
  });

  test('should handle Google OAuth flow', async ({ page }) => {
    // Mock Google OAuth response
    await page.route('**/api/auth/google/callback*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            avatar: 'https://example.com/avatar.jpg',
          },
          token: 'mock-jwt-token',
        }),
      });
    });

    // Click sign in button
    await page.click('button:has-text("Sign in with Google")');
    
    // Should redirect to Google OAuth
    await expect(page).toHaveURL(/accounts\.google\.com/);
    
    // Mock successful OAuth callback
    await page.goto('/auth/callback?code=valid_code');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome, Test')).toBeVisible();
  });

  test('should handle OAuth errors gracefully', async ({ page }) => {
    // Mock OAuth error
    await page.route('**/api/auth/google/callback*', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid authorization code',
        }),
      });
    });

    // Navigate to callback with invalid code
    await page.goto('/auth/callback?code=invalid_code');
    
    // Should show error message
    await expect(page.locator('text=Authentication failed')).toBeVisible();
    await expect(page.locator('text=Please try again')).toBeVisible();
    
    // Should have option to retry
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });

  test('should persist authentication state', async ({ page }) => {
    // Mock successful authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }));
    });

    // Navigate to protected route
    await page.goto('/dashboard');
    
    // Should be authenticated
    await expect(page.locator('text=Welcome, Test')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should handle logout', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }));
    });

    await page.goto('/dashboard');
    
    // Click logout button
    await page.click('button:has-text("Logout")');
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Plan Your Family Trip')).toBeVisible();
    
    // Should clear authentication state
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });

  test('should protect routes when not authenticated', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/profile',
      '/trips/new',
      '/trips/123',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
      await expect(page.locator('text=Sign in to your account')).toBeVisible();
    }
  });

  test('should show user profile information', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'https://example.com/avatar.jpg',
      }));
    });

    await page.goto('/profile');
    
    // Should display user information
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();
    
    // Should show profile picture
    const avatar = page.locator('img[alt="Profile picture"]');
    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('should handle token expiration', async ({ page }) => {
    // Mock expired token
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'expired-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }));
    });

    // Mock API call that returns 401
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Token expired',
        }),
      });
    });

    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    await expect(page.locator('text=Session expired')).toBeVisible();
    await expect(page.locator('text=Please sign in again')).toBeVisible();
  });

  test('should handle network errors during authentication', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/**', route => {
      route.abort('failed');
    });

    await page.click('button:has-text("Sign in with Google")');
    
    // Should show error message
    await expect(page.locator('text=Network error')).toBeVisible();
    await expect(page.locator('text=Please check your connection')).toBeVisible();
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Sign in with Google")')).toBeFocused();
    
    // Press Enter to activate button
    await page.keyboard.press('Enter');
    
    // Should attempt OAuth flow
    await expect(page).toHaveURL(/accounts\.google\.com/);
  });

  test('should work with screen readers', async ({ page }) => {
    await page.goto('/login');
    
    // Check for proper ARIA labels
    const signInButton = page.locator('button:has-text("Sign in with Google")');
    await expect(signInButton).toHaveAttribute('aria-label', 'Sign in with Google');
    
    // Check for proper heading structure
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Sign in to your account');
  });
});
