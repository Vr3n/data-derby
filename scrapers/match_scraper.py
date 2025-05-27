"""
Scraping the Matches of Fbref.

Provides the Detailed statistics of the match.
1. Venue and Overview of the match.
2. Manager, Captain and Referee
3. Match Summary Timeline.
4. Player stats for different categories:
   - Overall summary
   - Passing
   - Shooting
   - Defensive Actions
   - Possession
   - Misc
5. Goalkeeper Statistics
"""


import asyncio
import pandas as pd
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

browser_config = BrowserConfig(
    user_agent="Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
)


async def main():
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url="https://fbref.com/en/matches/a71ce7d1/Barcelona-Mallorca-April-22-2025-La-Liga",
            bypass_cache=True,
            magic=True
        )
        print(result.status_code)
        print(result)

        return result


if __name__ == "__main__":
    asyncio.run(main())
