import { test, expect } from "@playwright/test";

// tests portfolio viewing features like empty state, overview, and category grouping
test.describe("Portfolio Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should display empty state when no portfolio items exist", async ({
    page,
  }) => {
    await page.route("**/load-portfolio/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [] }), // empty portfolio
      });
    });

    await page.goto("http://localhost:3000/");

    // wait for empty state to be visible
    await expect(page.getByText("Your portfolio is empty")).toBeVisible();
    await expect(
      page.getByText(
        "Start building your portfolio by uploading your first image or video",
      ),
    ).toBeVisible();
  });

  test("should display portfolio overview when items exist", async ({
    page,
  }) => {
    // mock some portfolio data
    await page.addInitScript(() => {
      const mockItems = [
        {
          id: "1",
          filename: "test-image.jpg",
          media_type: "image",
          title: "Test Image",
          description: "A test image",
          category: "Photography",
          url: "http://localhost:3000/test-image.jpg",
        },
        {
          id: "2",
          filename: "test-video.mp4",
          media_type: "video",
          title: "Test Video",
          description: "A test video",
          category: "Videos",
          url: "http://localhost:3000/test-video.mp4",
        },
      ];

      // mock api response
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

    await page.reload();

    await page.waitForSelector('[data-testid="portfolio-overview"]', {
      timeout: 5000,
    });

    // make sure overview is displayed with correct numbers
    await expect(page.getByText("Portfolio Overview")).toBeVisible();
    await expect(
      page.getByText("2 total pieces across 2 categories"),
    ).toBeVisible();
  });

  test("should group items by category correctly", async ({ page }) => {
    // mock data across different categories
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
        {
          id: "3",
          filename: "video1.mp4",
          media_type: "video",
          title: "Video 1",
          description: "First video",
          category: "Videos",
          url: "http://localhost:3000/video1.mp4",
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

    await page.reload();

    await page.waitForSelector("text=Photography", { timeout: 5000 });

    // make sure category headers exist
    await expect(
      page.getByRole("heading", { name: /photography/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /videos/i })).toBeVisible();

    // correct items are in each category
    await expect(page.getByText("2 items")).toBeVisible();
    await expect(page.getByText("1 item")).toBeVisible();
  });

  test("should handle portfolio loading errors gracefully", async ({
    page,
  }) => {
    // mock api error
    await page.addInitScript(() => {
      (window as any).fetch = async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.includes("/load-portfolio")) {
          return new Response("Server Error", { status: 500 });
        }
        return new Response("Not found", { status: 404 });
      };
    });

    await page.reload();

    // still show empty state on error
    await expect(page.getByText("Your portfolio is empty")).toBeVisible();
  });
});

test("should display media cards with correct information", async ({
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

  await expect(
    page.getByRole("heading", { name: /test image/i }),
  ).toBeVisible();

  // check card content
  await expect(
    page.getByRole("heading", { name: /test image/i }),
  ).toBeVisible();
  await expect(page.getByText("A test image description")).toBeVisible();
});
