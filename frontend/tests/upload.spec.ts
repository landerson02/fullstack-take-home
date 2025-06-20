import { test, expect } from "@playwright/test";
import path from "path";

// tests uploading new media to the portfolio
test.describe("Upload Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should open and close upload modal when pressing the buttons", async ({
    page,
  }) => {
    await page.getByText("Upload New").click();

    // make sure modal is open
    await expect(page.getByText("Upload New Media")).toBeVisible();

    // close modal
    await page.locator('button[data-testid="close-modal"]').click();

    // make sure modal is closed
    await expect(page.getByText("Upload New Media")).not.toBeVisible();
  });

  test("should close upload modal when clicking outside", async ({ page }) => {
    await page.getByText("Upload New").click();

    // check is open
    await expect(page.getByText("Upload New Media")).toBeVisible();

    // close by clicking on backdrop
    await page.locator(".fixed.inset-0").click({ position: { x: 10, y: 10 } });

    // check is closed
    await expect(page.getByText("Upload New Media")).not.toBeVisible();
  });

  test("should show file name when file is selected", async ({ page }) => {
    await page.getByText("Upload New").click();

    // create a test file
    const testFilePath = path.join(__dirname, "test-image.jpg");

    // mock input
    await page.setInputFiles('input[type="file"]', testFilePath);

    // check file name displayed
    await expect(page.getByText("test-image.jpg")).toBeVisible();
  });

  test("should show custom category input when Other is selected", async ({
    page,
  }) => {
    await page.getByText("Upload New").click();

    // select "other" category
    await page.getByLabel("Category").selectOption("Other");

    // check custom category input is visible
    await expect(page.getByLabel("Custom Category *")).toBeVisible();
  });

  test("should validate form fields", async ({ page }) => {
    await page.getByText("Upload New").click();

    const uploadButton = page.getByRole("button", { name: "Upload Media" });

    // check that the upload button is disabled
    await expect(uploadButton).toBeDisabled();
  });

  test("should enable upload button when form is valid", async ({ page }) => {
    await page.getByText("Upload New").click();

    // fill in fields
    await page.getByLabel("Title").fill("Test Title");
    await page.getByLabel("Description").fill("Test Description");
    await page.getByLabel("Category").selectOption("Photography");

    const testFilePath = path.join(__dirname, "test-image.jpg");
    await page.setInputFiles('input[type="file"]', testFilePath);

    // check upload button is enabled
    await expect(
      page.getByRole("button", { name: "Upload Media" }),
    ).toBeEnabled();
  });

  test("should handle file upload successfully", async ({ page }) => {
    // mock successful upload
    await page.addInitScript(() => {
      (window as any).fetch = async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.includes("/upload")) {
          return new Response(
            JSON.stringify({
              filename: "test-image.jpg",
              media_type: "image",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        if (url.includes("/save-portfolio")) {
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response("Not found", { status: 404 });
      };
    });

    await page.getByText("Upload New").click();

    // fill in fields
    await page.getByLabel("Title").fill("Test Title");
    await page.getByLabel("Description").fill("Test Description");
    await page.getByLabel("Category").selectOption("Photography");

    const testFilePath = path.join(__dirname, "test-image.jpg");
    await page.setInputFiles('input[type="file"]', testFilePath);

    // upload
    await page.getByRole("button", { name: "Upload Media" }).click();

    // close after a successful upload
    await expect(page.getByText("Upload New Media")).not.toBeVisible();
  });

  test("should handle upload errors", async ({ page }) => {
    // mock upload error
    await page.addInitScript(() => {
      (window as any).fetch = async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.includes("/upload")) {
          return new Response("Upload failed", { status: 500 });
        }
        return new Response("Not found", { status: 404 });
      };
    });

    await page.getByText("Upload New").click();

    // fill form
    await page.getByLabel("Title").fill("Test Title");
    await page.getByLabel("Description").fill("Test Description");
    await page.getByLabel("Category").selectOption("Photography");

    const testFilePath = path.join(__dirname, "test-image.jpg");
    await page.setInputFiles('input[type="file"]', testFilePath);

    // upload
    await page.getByRole("button", { name: "Upload Media" }).click();

    // check modal is still open
    await expect(page.getByText("Upload New Media")).toBeVisible();
  });

  test("should show loading state during upload", async ({ page }) => {
    // mock loading
    await page.route('**/load-portfolio/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [] }),
      });
    });
  
    await page.route('**/upload', async (route) => {
      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          filename: "test-image.jpg",
          media_type: "image",
        }),
      });
    });
  
    await page.goto("http://localhost:3000");
  
    // open and fill form
    await page.getByText("Upload New").click();
    await page.getByLabel("Title").fill("Test Title");
    await page.getByLabel("Description").fill("Test Description");
    await page.getByLabel("Category").selectOption("Photography");
  
    const testFilePath = path.join(__dirname, "test-image.jpg");
    await page.setInputFiles('input[type="file"]', testFilePath);
  
    // upload
    await page.getByRole("button", { name: "Upload Media" }).click();
  
    // check loading state
    await expect(page.getByText("Uploading...")).toBeVisible();
  });
  
});

