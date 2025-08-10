# Scraper Update Tasks for fbref_competition_schedule_scrape.py

This document outlines the tasks to be completed to update the scraper based on the instructions in `fbref_competiton_schedule_scrape_instructions.md`.

## Task List

- [x] **Restructure Output Data:**
  - **Summary:** Modify the data structure of the scraped match information to match the specified nested JSON format. This includes creating `home_team` and `away_team` objects within the main match dictionary.

- [x] **Extract Additional IDs:**
  - **Summary:** Enhance the scraping logic to extract unique `fbref_id`s for matches and teams.
  - **Details:**
    - Extract the match `fbref_id` from the `match_link` URL.
    - Extract the team `fbref_id` from the `home_team_link` and `away_team_link` URLs.

- [x] **Field Naming and Consistency:**
  - **Summary:** Update field names for clarity and consistency with the new data structure.
  - **Details:**
    - Rename `refree` to `referee`.
    - The `competition_id` will be `competition_fbref_id`.
    - The `season_id` will be `season`.

- [x] **Add Date and Day fields:**
  - **Summary:** Add new fields for date and day of the match.
  - **Details:**
    - The `day` field will be populated from the existing `week_day` data.
    - The `date` field will be derived from the `schedule_epoch` timestamp.

- [x] **Add team links to output:**
  - **Summary:** Add the `link` field to the `home_team` and `away_team` dictionaries in the scraped data.

- [x] **Flatten CSV Output:**
  - **Summary:** Modify the `save_to_csv` method to flatten the nested `home_team` and `away_team` data into separate columns in the final CSV file.
  - **Details:**
    - The CSV should have columns like `home_team_name`, `home_team_link`, `home_team_fbref_id`, etc.
