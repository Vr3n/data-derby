from typing import TypedDict
from patchright.sync_api import (
    TimeoutError as PlaywrightTimeoutError,
)

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

from pipeline.fbref_schemas import ResultsOverallSchema
from scraper.fbref_league_data_scrape import FBRefPlaywrightScraper


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
            "2025-2026",
        ],
    }
]

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
        return scraper.get_dataset()

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
                dataset = run_scraper_with_retries(scraper)
                print("-----\n")
                print("Transforming and Validating the data.")
                records = dataset["results_overall"].to_dict(orient="records")
                validated = [ResultsOverallSchema(**record) for record in records]
                print("\n")
                print(validated)

            except Exception as e:
                print(
                    f"Failed to scrape {scraper.base_url} after multiple retries: {e}"
                )
            time.sleep(5)

    main()
