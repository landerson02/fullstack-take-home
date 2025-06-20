import { test, expect } from "@playwright/test";

// tests switching between different 'users' aka portfolios
test.describe("User Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should display default user ID on page load", async ({ page }) => {
    await expect(page.getByText("Portfolio: default")).toBeVisible();
  });

  test("should allow editing user ID when clicked", async ({ page }) => {
    // click on the user ID to edit it
    await page.getByText("Portfolio: default").click();

    // check that input field appears
    await expect(
      page.locator('input[placeholder="Enter portfolio ID"]'),
    ).toBeVisible();
    await expect(
      page.locator('input[placeholder="Enter portfolio ID"]'),
    ).toHaveValue("default");
  });

  test("should save new user ID when submitted", async ({ page }) => {
    // change user id
    await page.getByText("Portfolio: default").click();
    await page.locator('input[placeholder="Enter portfolio ID"]').clear();
    await page
      .locator('input[placeholder="Enter portfolio ID"]')
      .fill("test-user-123");

    // submit with enter
    await page
      .locator('input[placeholder="Enter portfolio ID"]')
      .press("Enter");

    // check that new user ID is displayed
    await expect(page.getByText("Portfolio: test-user-123")).toBeVisible();
  });

  test("should save new user ID when input loses focus", async ({ page }) => {
    await page.getByText("Portfolio: default").click();

    await page.locator('input[placeholder="Enter portfolio ID"]').clear();
    await page
      .locator('input[placeholder="Enter portfolio ID"]')
      .fill("test-user-456");

    // click outside to lose focus
    await page.locator("body").click();

    // check that new user ID is displayed
    await expect(page.getByText("Portfolio: test-user-456")).toBeVisible();
  });

  test("should not save empty user ID", async ({ page }) => {
    // change user id to empty
    await page.getByText("Portfolio: default").click();
    await page.locator('input[placeholder="Enter portfolio ID"]').clear();

    // submit empty value
    await page
      .locator('input[placeholder="Enter portfolio ID"]')
      .press("Enter");

    // old user id is still displayed
    await expect(page.getByText("Portfolio: default")).toBeVisible();
  });

  test("should trim whitespace from user ID", async ({ page }) => {
    // change user id to id with whitespace
    await page.getByText("Portfolio: default").click();
    await page.locator('input[placeholder="Enter portfolio ID"]').clear();
    await page
      .locator('input[placeholder="Enter portfolio ID"]')
      .fill("  test-user-trimmed  ");
    await page
      .locator('input[placeholder="Enter portfolio ID"]')
      .press("Enter");

    // check that trimmed user ID is displayed
    await expect(page.getByText("Portfolio: test-user-trimmed")).toBeVisible();
  });

  test("should load portfolio for new user ID", async ({ page }) => {
    await page.route("**/load-portfolio/**", (route) => {
      const url = route.request().url();
      const userId = url.split("/").pop();
      let response;

      if (userId === "user1") {
        response = {
          items: [
            {
              id: "1",
              filename: "user1-image.jpg",
              media_type: "image",
              title: "User 1 Image",
              description: "Image for user 1",
              category: "Photography",
              url: "http://localhost:3000/user1-image.jpg",
            },
          ],
        };
      } else if (userId === "user2") {
        response = {
          items: [
            {
              id: "2",
              filename: "user2-image.jpg",
              media_type: "image",
              title: "User 2 Image",
              description: "Image for user 2",
              category: "Design",
              url: "http://localhost:3000/user2-image.jpg",
            },
          ],
        };
      } else {
        response = { items: [] };
      }

      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    });

    await page.goto("http://localhost:3000/");

    // switch to user1
    await page.getByText("Portfolio: default").click();
    await page.locator('input[placeholder="Enter portfolio ID"]').fill("user1");
    await page
      .locator('input[placeholder="Enter portfolio ID"]')
      .press("Enter");
    await expect(page.getByText("User 1 Image")).toBeVisible();

    // switch to user2
    await page.getByText("Portfolio: user1").click();
    await page.locator('input[placeholder="Enter portfolio ID"]').fill("user2");
    await page
      .locator('input[placeholder="Enter portfolio ID"]')
      .press("Enter");
    await expect(page.getByText("User 2 Image")).toBeVisible();
  });
});
