"""This script scrapes football league data from FBRef using Playwright.

It defines a list of leagues and seasons to scrape, then iterates through them,
launching a Playwright browser to fetch the HTML content of each league's stats
page. The script then parses the HTML to extract tables of data, which are
saved to CSV files.

The script is designed to be resilient, with a multi-level retry mechanism to
handle network errors and other intermittent issues. It also includes a delay
between requests to avoid overwhelming the website's servers.
"""

import os
import uuid
from typing import TypedDict
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
            "2023-2024",
            "2022-2023",
            "2021-2022",
            # "2019-2020",
            # "2018-2019",
            # "2017-2018",
            # "2016-2017",
            # "2015-2016",
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
    #         "2019-2020",
    #         "2018-2019",
    #         "2017-2018",
    #         "2016-2017",
    #         "2015-2016",
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
    #         "2019-2020",
    #         "2018-2019",
    #         "2017-2018",
    #         "2016-2017",
    #         "2015-2016",
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
    #         "2019-2020",
    #         "2018-2019",
    #         "2017-2018",
    #         "2016-2017",
    #         "2015-2016",
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
    #         "2019-2020",
    #         "2018-2019",
    #         "2017-2018",
    #         "2016-2017",
    #         "2015-2016",
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
    #         "2019-2020",
    #         "2018-2019",
    #         "2017-2018",
    #         "2016-2017",
    #         "2015-2016",
    #     ],
    # },
    # {
    #     'league_name': 'Europa-League',
    #     'fbref_id': 19,
    #     'season_year': ['2024-2025', '2023-2024', '2022-2023', '2021-2022', '2019-2020', '2018-2019', '2017-2018', '2016-2017', '2015-2016'],
    # },
    # {
    #     'league_name': 'Champions-League',
    #     'fbref_id': 8,
    #     'season_year': ['2024-2025', '2023-2024', '2022-2023', '2021-2022', '2019-2020', '2018-2019', '2017-2018', '2016-2017', '2015-2016'],
    # }
]


class FBRefPlaywrightScraper:
    """A class to scrape football league data from FBRef.

    Attributes:
        league_name: The name of the league to scrape.
        fbref_id: The FBRef ID of the league.
        season_year: The season to scrape.
        base_url: The base URL for the league's stats page.
        dataset: A dictionary to store the scraped data.
    """

    def __init__(self, league_name: str, fbref_id: int, season_year: str):
        """Initializes the FBRefPlaywrightScraper.

        Args:
            league_name: The name of the league to scrape.
            fbref_id: The FBRef ID of the league.
            season_year: The season to scrape.
        """
        self.league_name: str = league_name
        self.fbref_id: int = fbref_id
        self.season_year: str = season_year
        self.base_url: str = f"https://fbref.com/en/comps/{fbref_id}/{season_year}/{season_year}-{league_name}-Stats"
        self.dataset: dict[str, pd.DataFrame] = {}

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((PlaywrightTimeoutError, Exception)),
        reraise=True,
    )
    def fetch_page_html(self, page: Page) -> str:
        """Fetches the HTML content of the league's stats page.

        Args:
            page: The Playwright page object.

        Returns:
            The HTML content of the page.
        """
        print(f"🔁 Navigating to {self.base_url}")

        _ = page.goto(self.base_url, timeout=60_000, wait_until="domcontentloaded")
        # page.wait_for_load_state("networkidle", timeout=60_000)

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

    def parse_tables(self, html: str):
        """Parses the HTML to extract tables of data.

        Args:
            html: The HTML content of the page.
        """
        soup = BeautifulSoup(html, "html.parser")
        tables = soup.select("table")
        table_names = [table.get("id") for table in tables]

        for table, name in zip(tables, table_names):
            if not name:
                continue
            print(f"📦 Parsing table: {name}")
            _, data = self._get_table_stats_and_header(table)
            data["competition_id"] = self.fbref_id
            data["season_id"] = self.season_year
            data["id"] = str(uuid.uuid4())
            self.dataset[name] = data

    def _get_table_stats_and_header(self, table):
        """Extracts the stats and headers from a table.

        Args:
            table: The BeautifulSoup table object.

        Returns:
            A tuple containing the table headers and data.
        """
        stat_tags, headers_info = [], []

        for th in table.find_all("th", attrs={"aria-label": True}):
            stat_tag = th.get("data-stat")
            label = th["aria-label"]
            abbr = th.get_text(strip=True)
            tooltip = th.get("data-tip")

            if stat_tag:
                stat_tags.append(stat_tag)
                headers_info.append(
                    {
                        "stat": label,
                        "stat_abbr": abbr,
                        "data-stat": stat_tag,
                        "description": tooltip,
                    }
                )

        league_table_headers = pd.DataFrame(headers_info)

        rows = []
        is_away = "against" in (table.get("id") or "")
        for row in table.select("tbody tr:has(td)"):
            data = {}
            for stat in stat_tags:
                cell = row.find(attrs={"data-stat": stat})
                if not cell:
                    continue

                text = cell.get_text(strip=True)

                if stat == "team":
                    anchor = cell.find("a")
                    if anchor:
                        href = anchor.get("href", "")
                        team_id = (
                            href.split("/")[-3]
                            if "squads" in href
                            else href.split("/")[-2]
                        )
                        data["team_id"] = team_id
                        data["team_url"] = href
                        data["team"] = anchor.get_text(strip=True)

                    img = cell.find("img")
                    if img:
                        data["logo_url"] = img.get("src")
                else:
                    colname = f"{stat}_away" if is_away else stat
                    data[colname] = text
            rows.append(data)

        league_table_data = pd.DataFrame(rows)
        return league_table_headers, league_table_data

    def scrape(self):
        """Launches a Playwright browser and scrapes the data."""
        with sync_playwright() as pw:
            browser = pw.chromium.launch_persistent_context(
                user_data_dir=user_data_dir,
                channel="chrome",
                headless=True,
                no_viewport=True,
            )
            page = browser.new_page()

            try:
                html = self.fetch_page_html(page)
                self.parse_tables(html)
            finally:
                browser.close()

    def save_to_csv(self):
        """Saves the scraped data to CSV files."""
        output_dir = os.path.join("scraped_data", self.league_name)
        os.makedirs(output_dir, exist_ok=True)
        for name, df in self.dataset.items():
            file_path = os.path.join(
                output_dir, f"{name}-{self.league_name}-{self.season_year}.csv"
            )
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
    def run_scraper_with_retries(scraper: FBRefPlaywrightScraper):
        """Runs a scraper with a retry mechanism.

        Args:
            scraper: The scraper to run.
        """
        scraper.scrape()
        # scraper.save_to_csv()

    def main():
        """The main function of the script."""
        scraper_instances = [
            FBRefPlaywrightScraper(
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
