import os
import time
from patchright.sync_api import sync_playwright, Playwright

# with sync_playwright() as p:
#     browser = p.chromium.launch()
#     page = browser.new_page()
#     page.goto('https://fbref.com/en/comps/9/Premier-League-Stats')
#     browser.close()

user_data_dir = "./playwright_user_data"
os.makedirs(user_data_dir, exist_ok=True)

def scrape_fbref(playwright: Playwright):
    browser = playwright.chromium.launch_persistent_context(
        user_data_dir=user_data_dir,
        channel='chrome',
        headless=False,
        no_viewport=True,
    )

    page = browser.new_page()

    _ = page.goto("https://fbref.com/en/comps/9/Premier-League-Stats")

    # Wait for the checkbox to appear (use a suitable selector)
    # _ = page.wait_for_selector('div.cb-c input[type="checkbox"]')

    # Click the checkbox
    # page.check('div.cb-c input[type="checkbox"]')


    browser.close()


with sync_playwright() as sp:
    scrape_fbref(sp)
