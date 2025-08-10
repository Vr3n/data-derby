# Match Scraper Tasks (`fbref_match_scraper.py`)

This document outlines the tasks for creating the FBRef match statistics scraper.

## 1. Scraper Scaffolding

*   **Task:** Create the basic structure for the `FBRefMatchScraper` class in `backend/scraper/fbref_match_scraper.py`.
*   **Details:**
    *   The class will be similar to `FBRefPlaywrightScraper` from the league data scraper.
    *   It will take a match URL or a match ID as input.
    *   It will include methods for fetching, parsing, and saving, along with retry logic.

## 2. Implement Parsing Functions

*   **Task:** Adapt the parsing functions from the Jupyter notebook script (`docs/fbref_match_scaper.py`) into methods of the `FBRefMatchScraper` class.
*   **Details:**
    *   Create a main `parse_match_page` method that calls other private parsing methods.
    *   Implement private methods for each section of the page:
        *   `_parse_match_info`
        *   `_parse_score_box`
        *   `_parse_lineups_and_formations`
        *   `_parse_match_events`
        *   `_parse_team_stats`
        *   `_parse_all_player_stats`

## 3. Structure the Output Data

*   **Task:** Ensure the parsed data is structured exactly as specified in `docs/fbref_match_scraper_instructions.md`.
*   **Details:**
    *   The final output will be a single JSON object for the match.
    *   This involves creating the deeply nested dictionary structure.

## 4. Input Mechanism

*   **Task:** Determine how the scraper will get the matches to scrape.
*   **Details:**
    *   The scraper should be able to take a list of match URLs or IDs.
    *   For initial implementation, the scraper will read the output from the `fbref_competition_schedule_scrape.py` (the CSV files) as a source for match links.
*   **New Task:** Create a `MatchData` TypedDict and a `scrapes` list of matches to be scraped, similar to the `scrapes` list in `fbref_league_data_scrape.py`. The data will be read from the schedule CSV.

## 5. Saving the Data

*   **Task:** Implement a method to save the scraped match data.
*   **Details:**
    *   The data for each match should be saved as a single JSON file.
    *   The filename should be based on the match `fbref_id`.
    *   The files should be saved in a new directory, e.g., `scraped_data/matches/`.

## 6. Main Execution Block

*   **Task:** Create the `if __name__ == "__main__":` block to run the scraper.
*   **Details:**
    *   It will read a schedule CSV to get a list of matches.
    *   It will then iterate through the matches, instantiate the scraper, and run it for each match.
