import { test, expect } from "@playwright/test";

// tests interacting with the portfolio with drop downs and modals
test.describe("Portfolio Interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should expand and collapse portfolio sections", async ({ page }) => {
    // mock data
    await page.addInitScript(() => {
      const mockItems = [
        {
          id: "1",
          filename: "photo1.jpg",
          media_type: "image",
          title: "Photo 1",
          description: "First photo",
          category: "Photography",
          url: "http://localhost:3000/photo1.jpg",
        },
        {
          id: "2",
          filename: "photo2.jpg",
          media_type: "image",
          title: "Photo 2",
          description: "Second photo",
          category: "Photography",
          url: "http://localhost:3000/photo2.jpg",
        },
      ];

      (window as any).fetch = async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.includes("/load-portfolio")) {
          return new Response(JSON.stringify({ items: mockItems }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response("Not found", { status: 404 });
      };
    });

    await page.goto("http://localhost:3000");

    // make sure section is expanded by default
    await expect(page.getByText("Photo 1")).toBeVisible();
    await expect(page.getByText("Photo 2")).toBeVisible();

    // collapse the section
    await page.getByRole("heading", { name: /photography/i }).click();

    // make sure items are hidden
    await expect(page.getByText("Photo 1")).not.toBeVisible();
    await expect(page.getByText("Photo 2")).not.toBeVisible();

    // expand again
    await page.getByRole("heading", { name: /photography/i }).click();

    // make sure items are visible again
    await expect(page.getByText("Photo 1")).toBeVisible();
    await expect(page.getByText("Photo 2")).toBeVisible();
  });

  test("should open full media modal when clicking on media card", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const mockItems = [
        {
          id: "1",
          filename: "test-image.jpg",
          media_type: "image",
          title: "Test Image",
          description: "A test image description",
          category: "Photography",
          url: "http://localhost:3000/test-image.jpg",
        },
      ];

      (window as any).fetch = async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.includes("/load-portfolio")) {
          return new Response(JSON.stringify({ items: mockItems }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response("Not found", { status: 404 });
      };
    });

    await page.goto("http://localhost:3000");

    // make sure media card is visible
    await expect(
      page.getByRole("heading", { name: /test image/i }),
    ).toBeVisible();

    // click on media card
    await page.getByRole("heading", { name: /test image/i }).click();

    // make sure modal is open by checking for the backdrop
    await expect(page.locator(".fixed.inset-0")).toBeVisible();
  });

  test("should close full media modal when clicking close button", async ({
    page,
  }) => {
    // mock portfolio data
    await page.route("**/load-portfolio/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "1",
              filename: "test-image.jpg",
              media_type: "image",
              title: "Test Image",
              description: "A test image description",
              category: "Photography",
              url: "http://localhost:3000/test-image.jpg",
            },
          ],
        }),
      });
    });

    await page.goto("http://localhost:3000");

    // wait for the card to appear
    const card = page.getByRole("heading", { name: /test image/i });
    await expect(card).toBeVisible();

    // click the card to open modal
    await card.click();

    // wait for modal to appear
    const modal = page.locator(".fixed.inset-0");
    await expect(modal).toBeVisible();

    // close modal
    await page.locator('button[data-testid="close-modal"]').click();

    // wait for modal to disappear (allow for animation)
    await expect(modal).toHaveCount(0, { timeout: 2000 }); // or .not.toBeVisible() if modal stays mounted
  });
});

