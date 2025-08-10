"""This script scrapes football competition schedule data from FBRef using Playwright."""

import os
from datetime import datetime
from typing import TypedDict, List
import pandas as pd
from bs4 import BeautifulSoup
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
            # "2022-2023",
            # "2021-2022",
        ],
    },
    # {
    #     "league_name": "La-Liga",
    #     "fbref_id": 12,
    #     "season_year": [
    #         "2024-2025",
    #         "2023-2024",
    #         "2022-2023",
    #         "2021-2022",
    #     ],
    # },
    # {
    #     "league_name": "Serie-A",
    #     "fbref_id": 11,
    #     "season_year": [
    #         "2024-2025",
    #         "2023-2024",
    #         "2022-2023",
    #         "2021-2022",
    #     ],
    # },
    # {
    #     "league_name": "Bundesliga",
    #     "fbref_id": 20,
    #     "season_year": [
    #         "2024-2025",
    #         "2023-2024",
    #         "2022-2023",
    #         "2021-2022",
    #     ],
    # },
    # {
    #     "league_name": "Ligue-1",
    #     "fbref_id": 13,
    #     "season_year": [
    #         "2024-2025",
    #         "2023-2024",
    #         "2022-2023",
    #         "2021-2022",
    #     ],
    # },
    # {
    #     "league_name": "Eredivisie",
    #     "fbref_id": 23,
    #     "season_year": [
    #         "2024-2025",
    #         "2023-2024",
    #         "2022-2023",
    #         "2021-2022",
    #     ],
    # },
]


class FBRefCompetitionScheduleScraper:
    """A class to scrape football competition schedule data from FBRef."""

    def __init__(self, league_name: str, fbref_id: int, season_year: str):
        """Initializes the FBRefCompetitionScheduleScraper."""
        self.league_name = league_name
        self.fbref_id = fbref_id
        self.season_year = season_year
        self.base_url = f"https://fbref.com/en/comps/{fbref_id}/{season_year}/schedule/{season_year}-{league_name}-Scores-and-Fixtures"
        self.dataset: List[dict] = []

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((PlaywrightTimeoutError, Exception)),
        reraise=True,
    )
    def fetch_page_html(self, page: Page) -> str:
        """Fetches the HTML content of the league's schedule page."""
        print(f"🔁 Navigating to {self.base_url}")

        _ = page.goto(self.base_url, timeout=60_000, wait_until="domcontentloaded")

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

            if iframe_locator.locator("body").count() != 0:
                print("Cloudflare iframe Found!")
                checkbox = iframe_locator.locator("input[type='checkbox']")
                if not checkbox.all():
                    page.wait_for_timeout(20_000)
                    checkbox = iframe_locator.locator("input[type='checkbox']")
                if checkbox.all():
                    print("Clicking the checkbox.")
                    checkbox.first.click(force=True, timeout=60_000)
                    print("Cloudflare checkbox clicked.")
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

    def parse_schedule(self, html: str):
        """Parses the HTML to extract the competition schedule."""
        soup = BeautifulSoup(html, "html.parser")
        tables = soup.select("table")

        matches = []

        for table in tables:
            for row in table.select("tbody tr:has(td)"):
                try:
                    home_team_cell = row.find("td", {"data-stat": "home_team"})
                    away_team_cell = row.find("td", {"data-stat": "away_team"})
                    match_report_cell = row.find("td", {"data-stat": "match_report"})
                    match_link = (
                        match_report_cell.a["href"]
                        if match_report_cell and match_report_cell.a
                        else None
                    )
                    home_team_link = home_team_cell.a["href"]
                    away_team_link = away_team_cell.a["href"]
                    schedule_epoch = row.find("td", {"data-stat": "start_time"}).find(
                        "span", {"data-venue-epoch": True}
                    )["data-venue-epoch"]

                    matches.append(
                        {
                            "fbref_id": match_link.split("/")[3]
                            if match_link
                            else None,
                            "match_week": row.find(
                                "th", {"data-stat": "gameweek"}
                            ).get_text(strip=True),
                            "day": row.find("td", {"data-stat": "dayofweek"}).get_text(
                                strip=True
                            ),
                            "date": datetime.fromtimestamp(
                                int(schedule_epoch)
                            ).strftime("%Y-%m-%d"),
                            "schedule_epoch": schedule_epoch,
                            "home_team": {
                                "name": home_team_cell.get_text(strip=True),
                                "fbref_id": home_team_link.split("/")[3],
                                "link": home_team_link,
                            },
                            "away_team": {
                                "name": away_team_cell.get_text(strip=True),
                                "fbref_id": away_team_link.split("/")[3],
                                "link": away_team_link,
                            },
                            "score": row.find("td", {"data-stat": "score"}).get_text(
                                strip=True
                            ),
                            "attendance": row.find("td", {"data-stat": "attendance"})[
                                "csk"
                            ],
                            "venue": row.find("td", {"data-stat": "venue"}).get_text(
                                strip=True
                            ),
                            "referee": row.find(
                                "td", {"data-stat": "referee"}
                            ).get_text(strip=True),
                            "match_link": match_link,
                            "competition_id": self.fbref_id,
                            "season": self.season_year,
                        }
                    )
                except (AttributeError, TypeError, KeyError):
                    # skip incomplete rows like headers or rows without match data
                    continue

        self.dataset = matches
        print(f"📦 Parsed {len(self.dataset)} matches.")

    def scrape(self):
        """Launches a Playwright browser and scrapes the data."""
        with sync_playwright() as pw:
            browser = pw.chromium.launch_persistent_context(
                user_data_dir=user_data_dir,
                channel="chrome",
                headless=False,
                no_viewport=True,
            )
            page = browser.new_page()

            try:
                html = self.fetch_page_html(page)
                self.parse_schedule(html)
            finally:
                browser.close()

    def save_to_csv(self):
        """Saves the scraped data to a CSV file."""
        if not self.dataset:
            print("No data to save.")
            return

        output_dir = os.path.join("scraped_data", self.league_name)
        os.makedirs(output_dir, exist_ok=True)
        file_path = os.path.join(
            output_dir, f"schedule-{self.league_name}-{self.season_year}.csv"
        )
        df = pd.json_normalize(self.dataset)
        df.columns = df.columns.str.replace("home_team.", "home_team_", regex=False)
        df.columns = df.columns.str.replace("away_team.", "away_team_", regex=False)
        df.to_csv(file_path, index=False)
        print(f"💾 Saved data to {file_path}")


if __name__ == "__main__":
    import time

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((PlaywrightTimeoutError, Exception)),
        reraise=True,
    )
    def run_scraper_with_retries(scraper: FBRefCompetitionScheduleScraper):
        """Runs a scraper with a retry mechanism."""
        scraper.scrape()
        scraper.save_to_csv()

    def main():
        """The main function of the script."""
        scraper_instances = [
            FBRefCompetitionScheduleScraper(
                league_name=scrape["league_name"],
                fbref_id=scrape["fbref_id"],
                season_year=year,
            )
            for scrape in scrapes
            for year in scrape["season_year"]
        ]

        for scraper in scraper_instances:
            try:
                run_scraper_with_retries(scraper)
            except Exception as e:
                print(
                    f"Failed to scrape {scraper.base_url} after multiple retries: {e}"
                )
            time.sleep(5)

    main()
