import asyncio
import os
from playwright.async_api import async_playwright

async def function_run():
    os.makedirs('/tmp/verification', exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        print("Navigating to http://localhost:5173...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")

        # Scroll to About section to find InteractiveCard elements
        about_card = page.locator("#about [data-interactive='true']").first
        await about_card.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)

        # Hover over the card to trigger MouseEnter and MouseMove
        box = await about_card.bounding_box()
        print(f"About Card bounding box: {box}")

        if box:
            # Move mouse across the card
            start_x = box['x'] + 20
            start_y = box['y'] + 20
            await page.mouse.move(start_x, start_y)
            await page.wait_for_timeout(200)

            # Move across card to test quickTo mouse tracking
            for i in range(10):
                await page.mouse.move(start_x + i * 15, start_y + i * 10)
                await page.wait_for_timeout(30)

            await page.screenshot(path="/tmp/verification/interactive_card_hover.png")
            print("Captured /tmp/verification/interactive_card_hover.png")

        # Scroll down to Skills section
        skills_card = page.locator("#skills [data-interactive='true']").first
        await skills_card.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)

        skills_box = await skills_card.bounding_box()
        print(f"Skills Card bounding box: {skills_box}")

        if skills_box:
            await page.mouse.move(skills_box['x'] + skills_box['width'] / 2, skills_box['y'] + skills_box['height'] / 2)
            await page.wait_for_timeout(300)
            await page.screenshot(path="/tmp/verification/skills_card_hover.png")
            print("Captured /tmp/verification/skills_card_hover.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(function_run())
