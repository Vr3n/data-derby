"""This script scrapes football player data from FBRef using Playwright.

It defines a list of leagues and seasons to scrape, then iterates through them,
launching a Playwright browser to fetch the HTML content of each league's
player stats pages for various categories (standard, shooting, passing, etc.).

The script is designed to be resilient, with a multi-level retry mechanism to
handle network errors and other intermittent issues. It also includes a delay
between requests to avoid overwhelming the website's servers.
"""

import os
import uuid
import time
from typing import TypedDict
import pandas as pd
from bs4 import BeautifulSoup, Comment
from patchright.sync_api import (
    sync_playwright,
    Page,
    TimeoutError as PlaywrightTimeoutError,
)

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

user_data_dir = "./playwright_user_data"


class LeagueData(TypedDict):
    """A dictionary representing a league to be scraped."""

    league_name: str
    fbref_id: int
    season_year: list[str]


LeagueList = list[LeagueData]


scrapes: LeagueList = [
    {
        "league_name": "Premier-League",
        "fbref_id": 9,
        "season_year": [
            "2024-2025",
            # "2023-2024",
        ],
    },
]


class FBRefPlayerScraper:
    """A class to scrape football player data from FBRef."""

    def __init__(self, league_name: str, fbref_id: int, season_year: str):
        """Initializes the FBRefPlayerScraper."""
        self.league_name = league_name
        self.fbref_id = fbref_id
        self.season_year = season_year
        self.dataset: dict[str, pd.DataFrame] = {}
        self.urls = {
            "standard": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/stats/{self.season_year}-{self.league_name}-Stats",
            "keeper": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/keepers/{self.season_year}-{self.league_name}-Stats",
            "keeper_adv": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/keepersadv/{self.season_year}-{self.league_name}-Stats",
            "shooting": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/shooting/{self.season_year}-{self.league_name}-Stats",
            "passing": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/passing/{self.season_year}-{self.league_name}-Stats",
            "passing_types": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/passing_types/{self.season_year}-{self.league_name}-Stats",
            "gca": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/gca/{self.season_year}-{self.league_name}-Stats",
            "defense": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/defense/{self.season_year}-{self.league_name}-Stats",
            "possession": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/possession/{self.season_year}-{self.league_name}-Stats",
            "playing_time": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/playingtime/{self.season_year}-{self.league_name}-Stats",
            "misc": f"https://fbref.com/en/comps/{self.fbref_id}/{self.season_year}/misc/{self.season_year}-{self.league_name}-Stats",
        }

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((PlaywrightTimeoutError, Exception)),
        reraise=True,
    )
    def _fetch_page_html(self, page: Page, url: str) -> str:
        """Fetches the HTML content of a given URL."""
        print(f"🔁 Navigating to {url}")
        _ = page.goto(url, timeout=60_000, wait_until="domcontentloaded")

        try:
            _ = page.wait_for_selector("table", timeout=10_000)
            print("✅ Page loaded and table found.")

            return page.content()
        except PlaywrightTimeoutError:
            print("❌ No table found on the page. Checking Cloudflare")

        try:
            print("Checking Cloudflare status.")
            page.wait_for_timeout(1000)
            iframe_locator = page.frame_locator("iframe[id*='cf-chl-widget-']")

            if iframe_locator.locator('body').count() != 0:
                print("Cloudflare iframe Found!")
                checkbox = iframe_locator.locator("input[type='checkbox']")
                if checkbox.all() == []:
                    page.wait_for_timeout(20_000)
                    checkbox = iframe_locator.locator("input[type='checkbox']")
                if checkbox is not None:
                    if checkbox.all() != []:
                        checkbox = iframe_locator.locator("input[type='checkbox']")
                        print("Clicking the checkbox.")
                        checkbox.first.click(force=True, timeout=60_000)
                        print("Cloudflare checkbox cliked,")
                        print("Cloudflare Bypass successfully.")
                    else:
                        raise PlaywrightTimeoutError("Checkbox not found")
            else:
                print("Iframe Doesn't Exist, Extracting the tables.")
        except PlaywrightTimeoutError:
            print("Checkbox not found.")

        try:
            _ = page.wait_for_selector("table", timeout=15_000)
            print("✅ Page loaded and table found.")
        except PlaywrightTimeoutError:
            print("❌ No table found on the page.")
            raise

        return page.content()

    def _extract_player_data(self, table_rows) -> pd.DataFrame:
        """Extracts player data from a list of table row elements."""
        lst = []
        for player in table_rows:
            tmp = {}
            for tag in player:
                data_stat = tag.get("data-stat")

                if data_stat == "player":
                    a_tag = tag.find("a")
                    if a_tag:
                        tmp["player_link"] = a_tag.get("href")
                        tmp["player_id"] = a_tag.get("href").split("/")[-2]
                        tmp["player_name"] = a_tag.get_text(strip=True)
                elif data_stat == "team":
                    a_tag = tag.find("a")
                    if a_tag:
                        tmp["team_id"] = a_tag.get("href").split("/")[-2]
                        tmp["team_name"] = a_tag.get_text(strip=True)
                        tmp["team_link"] = a_tag.get("href")
                elif data_stat == "nationality":
                    span_tag = tag.find("span")
                    if span_tag:
                        nationality = span_tag.get_text(strip=True)
                        tmp["nationality"] = (
                            nationality.split(" ")[-1]
                            if " " in nationality
                            else nationality
                        )
                elif data_stat == "matches":
                    a_tag = tag.find("a")
                    if a_tag:
                        tmp["matches_link"] = a_tag.get("href")
                else:
                    value = tag.get_text(strip=True)
                    if data_stat:
                        tmp[data_stat] = value

            if "ranker" in tmp:
                del tmp["ranker"]

            if tmp:  # Only append if data was extracted
                lst.append(tmp)

        return pd.DataFrame(lst)

    def _parse_commented_table(self, html: str, category: str):
        """Parses a table that is commented out in the HTML."""
        print(f"📦 Parsing commented table for category: {category}")
        soup = BeautifulSoup(html, "html.parser")
        player_stats_table = soup.find("table", attrs={"id": f"stats_{category}"})
        # player_stats_table = table_soup.select_one("table")
        if not player_stats_table:
            print(f"No table found for {category}")
            return

        player_table_data = player_stats_table.select("tbody tr:has(td)")
        df = self._extract_player_data(player_table_data)
        if not df.empty:
            df["competition_id"] = self.fbref_id
            df["season_id"] = self.season_year
            df["id"] = [str(uuid.uuid4()) for _ in range(len(df))]
            self.dataset[f"player_stats_{category}"] = df
            print(f"data: player_stats_{category}")
            print(df.head())

    def scrape(self):
        """Launches Playwright and scrapes player data for all categories."""
        with sync_playwright() as pw:
            browser = pw.chromium.launch_persistent_context(
                user_data_dir=user_data_dir,
                channel="chrome",
                headless=True,
                no_viewport=True,
            )
            page = browser.new_page()

            try:
                for category, url in self.urls.items():
                    try:
                        html = self._fetch_page_html(page, url)
                        self._parse_commented_table(html, category)
                        time.sleep(5)  # Delay between requests
                    except Exception as e:
                        print(f"❌ Failed to scrape {category} from {url}: {e}")
            finally:
                browser.close()

    def save_to_csv(self):
        """Saves the scraped data to CSV files."""
        base_dir = os.path.join("scraped_data", self.league_name, "player_data")
        os.makedirs(base_dir, exist_ok=True)

        for name, df in self.dataset.items():
            file_path = os.path.join(
                base_dir, f"{name}-{self.league_name}-{self.season_year}.csv"
            )
            df.to_csv(file_path, index=False)
            print(f"💾 Saved data to {file_path}")


if __name__ == "__main__":

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((PlaywrightTimeoutError, Exception)),
        reraise=True,
    )
    def run_scraper_with_retries(scraper: FBRefPlayerScraper):
        """Runs a scraper with a retry mechanism."""
        scraper.scrape()
        scraper.save_to_csv()

    def main():
        """The main function of the script."""
        scraper_instances = [
            FBRefPlayerScraper(
                league_name=scrape["league_name"],
                fbref_id=scrape["fbref_id"],
                season_year=year,
            )
            for scrape in scrapes
            for year in scrape["season_year"]
        ]

        for scraper in scraper_instances:
            try:
                print(
                    f"--- Starting scraper for {scraper.league_name} {scraper.season_year} ---"
                )
                run_scraper_with_retries(scraper)
                print(
                    f"--- Finished scraper for {scraper.league_name} {scraper.season_year} ---"
                )
            except Exception as e:
                print(
                    f"❌ Failed to scrape {scraper.league_name} {scraper.season_year} after multiple retries: {e}"
                )
            time.sleep(10)

    main()
