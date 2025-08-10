"""This script scrapes football match data from FBRef using Playwright."""

import os
import re
import json
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


class MatchData(TypedDict):
    """A dictionary representing a match to be scraped."""

    league_name: str
    fbref_id: str
    home_team: str
    away_team: str
    date: str


MatchList = list[MatchData]

scrapes: MatchList = [
    {
        "league_name": "Premier-League",
        "fbref_id": "cc5b4244",
        "home_team": "Manchester-United",
        "away_team": "Fulham",
        "date": "August-16-2024",
    }
]


class FBRefMatchScraper:
    """A class to scrape football match data from FBRef."""

    def __init__(self, match_data: MatchData):
        """Initializes the FBRefMatchScraper."""
        self.base_url = f"https://fbref.com/en/matches/{match_data['fbref_id']}/{match_data['home_team']}-{match_data['away_team']}-{match_data['date']}-{match_data['league_name']}"
        self.match_id = match_data['fbref_id']
        self.dataset = {}

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((PlaywrightTimeoutError, Exception)),
        reraise=True,
    )
    def fetch_page_html(self, page: Page) -> str:
        """Fetches the HTML content of the league's stats page."""
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

    def parse_match_page(self, html: str):
        """Parses the HTML to extract all match data."""
        soup = BeautifulSoup(html, "html.parser")

        match_info = self._parse_match_info(soup)
        home_team, away_team = self._parse_score_box(soup)

        home_team["formation"] = self._extract_formation(soup, "a")
        away_team["formation"] = self._extract_formation(soup, "b")

        home_team["lineup"] = self._extract_lineup(soup, "a")
        away_team["lineup"] = self._extract_lineup(soup, "b")

        home_team["events"] = self._extract_match_events(soup, "a")
        away_team["events"] = self._extract_match_events(soup, "b")

        team_stats = self._extract_team_stats(soup)
        extra_team_stats = self._extract_extra_team_stats(soup)

        home_team_name = home_team["team_name"]
        away_team_name = away_team["team_name"]

        home_team["team_stats"] = {
            **team_stats.get(home_team_name, {}),
            **extra_team_stats.get(home_team_name, {}),
        }
        away_team["team_stats"] = {
            **team_stats.get(away_team_name, {}),
            **extra_team_stats.get(away_team_name, {}),
        }

        player_stats_types = [
            x.get("data-show").split("_")[-1]
            if "passing_type" not in x.get("data-show")
            else "_".join(x.get("data-show").split("_")[-2:])
            for x in soup.find("div", class_="filter switcher").find_all("a")
        ]

        home_team["player_stats"] = self._extract_all_player_stats_grouped(
            soup, home_team["team_id"], player_stats_types
        )
        away_team["player_stats"] = self._extract_all_player_stats_grouped(
            soup, away_team["team_id"], player_stats_types
        )

        self.dataset = {
            "fbref_id": self.match_id,
            **match_info,
            "home_team": home_team,
            "away_team": away_team,
        }

    def _parse_match_info(self, soup: BeautifulSoup):
        header = soup.select_one("div#content > h1")
        header_split = header.text.split("–")
        match_name = header_split[0].split("Match")[0].strip()
        match_date = header_split[1].strip()

        scorebox_meta = soup.find("div", class_="scorebox_meta").find_all("div")[-3:-1]
        attendance = scorebox_meta[0].text.split(": ")[-1].strip()
        venue = scorebox_meta[1].text.split(": ")[-1].strip()

        return {
            "match_name": match_name,
            "match_date": match_date,
            "match_attendance": attendance,
            "venue": venue,
        }

    def _parse_score_box(self, soup: BeautifulSoup):
        scorebox = soup.find("div", class_="scorebox")
        teams = scorebox.find_all("div", recursive=False)

        home_team = self._parse_team_score_box(teams[0])
        away_team = self._parse_team_score_box(teams[1])

        home_team["team_id"] = home_team["logo_url"].split("/")[-1].split(".")[0]
        away_team["team_id"] = away_team["logo_url"].split("/")[-1].split(".")[0]

        return home_team, away_team

    def _parse_team_score_box(self, team_div):
        name = team_div.find("strong").find("a").text
        logo = team_div.find("img")["src"]
        score = team_div.find("div", class_="score").text.strip()
        xg = team_div.find("div", class_="score_xg").text.strip()
        record = team_div.find_all("div")[5].text.strip()

        datapoints = team_div.find_all("div", class_="datapoint")
        info = {}
        for div in datapoints:
            try:
                label = div.find("strong").text.strip().replace("\xa0", " ")
                if div.find("a"):
                    value = div.find("a").text.strip().replace("\xa0", " ")
                else:
                    value = (
                        div.get_text(strip=True)
                        .split(":", 1)[1]
                        .strip()
                        .replace("\xa0", " ")
                    )
                info[label] = value
            except Exception as e:
                print(f"Warning: Failed to parse datapoint: {div} | Error: {e}")

        manager = info.get("Manager")
        captain_name = info.get("Captain")
        captain_link = team_div.find(
            lambda tag: tag.name == "a" and captain_name in tag.text
        )
        captain_fbref_id = captain_link["href"].split("/")[-2] if captain_link else None

        return {
            "team_name": name,
            "logo_url": logo,
            "score": score,
            "xg": xg,
            "record": record,
            "manager": manager,
            "captain": {"name": captain_name, "fbref_id": captain_fbref_id},
        }

    def _extract_formation(self, soup: BeautifulSoup, team_id: str):
        lineup_soup = soup.find("div", id=team_id, class_="lineup")
        try:
            text = lineup_soup.find("th").text
            match = re.search(r"\(([-\d]+)\)", text)
            return match.group(1) if match else None
        except Exception as e:
            print(f"Error extracting formation: {e}")
            return None

    def _extract_lineup(self, soup: BeautifulSoup, team_id: str):
        lineup_soup = soup.find("div", id=team_id, class_="lineup")
        players = lineup_soup.find_all("tr")[1:]

        lineup = []
        benched = False
        for player in players:
            if player.text == "Bench":
                benched = True
                continue
            if benched:
                continue

            lineup.append(
                {
                    "number": player.find("td").text,
                    "name": player.find("a").text,
                    "fbref_id": player.find("a").get("href").split("/")[-2],
                }
            )
        return lineup

    def _extract_match_events(self, soup: BeautifulSoup, team_id: str):
        events_html = soup.find_all("div", class_=f"event {team_id}")
        events = []
        for event_div in events_html:
            icon_div = event_div.find("div", class_="event_icon")
            if not icon_div or not icon_div.has_attr("class"):
                continue

            event_type = icon_div["class"][1]
            event_block = icon_div.find_next_sibling("div")

            time_and_score = event_div.find_next("div").text
            timing, score = (
                time_and_score.split(";")[0].strip(),
                time_and_score.rsplit(";")[-1].strip(),
            )

            event_data = []
            if event_type == "goal":
                if event_block.find("small") and event_block.find("small").find("a"):
                    event_data = self._extract_goal_with_assist(event_block)
                else:
                    event_data = self._extract_goal(event_block)
            elif event_type == "substitute_in":
                event_data = self._extract_substitution(event_block)
            elif event_type == "yellow_card":
                event_data = self._extract_card(event_block, "yellow card")
            elif event_type == "red_card":
                event_data = self._extract_card(event_block, "red card")

            if event_data:
                events.append(
                    {
                        "time": timing,
                        "score": score,
                        "event_type": event_type,
                        "event": event_data,
                    }
                )
        return events

    def _extract_goal(self, event_block):
        player = event_block.find("a")
        return (
            [{"event": "goal", "name": player.text.strip(), "link": player["href"]}]
            if player
            else []
        )

    def _extract_goal_with_assist(self, event_block):
        players = []
        scorer = event_block.find("a")
        if scorer:
            players.append(
                {"event": "goal", "name": scorer.text.strip(), "link": scorer["href"]}
            )
        assist = event_block.find("small")
        if assist:
            assist_player = assist.find("a")
            if assist_player:
                players.append(
                    {
                        "event": "assist",
                        "name": assist_player.text.strip(),
                        "link": assist_player["href"],
                    }
                )
        return players

    def _extract_substitution(self, event_block):
        players = event_block.find_all("a")
        if len(players) == 2:
            return [
                {
                    "event": "sub in",
                    "name": players[1].text.strip(),
                    "link": players[1]["href"],
                },
                {
                    "event": "sub out",
                    "name": players[0].text.strip(),
                    "link": players[0]["href"],
                },
            ]
        return []

    def _extract_card(self, event_block, card_type: str):
        player = event_block.find("a")
        return (
            [{"event": card_type, "name": player.text.strip(), "link": player["href"]}]
            if player
            else []
        )

    def _extract_team_stats(self, soup: BeautifulSoup):
        team_stats_table = soup.find("div", id="team_stats")
        if not team_stats_table:
            return {}
        rows = team_stats_table.find_all("tr")

        team1, team2 = [th.get_text(strip=True) for th in rows[0].find_all("th")]
        stats = {team1: {}, team2: {}}

        def to_int(text: str) -> int:
            return (
                int(re.search(r"\d+", text).group())
                if text and re.search(r"\d+", text)
                else 0
            )

        def parse_generic(text: str) -> dict:
            nums = list(map(int, re.findall(r"\d+", text)))
            if len(nums) == 3:
                return {"completed": nums[0], "total": nums[1], "accuracy": nums[2]}
            elif len(nums) == 2:
                return {
                    "completed": nums[0],
                    "total": nums[1],
                    "accuracy": to_int(text),
                }
            return {"completed": 0, "total": 0, "accuracy": 0}

        def parse_shots(text: str) -> dict:
            nums = list(map(int, re.findall(r"\d+", text)))
            if len(nums) >= 3:
                return {
                    "on_target": nums[0],
                    "total_shots": nums[1],
                    "percentage": nums[2],
                }
            return {"on_target": 0, "total_shots": 0, "percentage": 0}

        def parse_saves(text: str) -> dict:
            nums = list(map(int, re.findall(r"\d+", text)))
            if len(nums) >= 3:
                return {
                    "shots_saved": nums[0],
                    "shots_faced": nums[1],
                    "percentage": nums[2],
                }
            return {"shots_saved": 0, "shots_faced": 0, "percentage": 0}

        label_map = {
            "possession": lambda td: to_int(td.get_text()),
            "passing accuracy": lambda td: parse_generic(td.get_text()),
            "shots on target": lambda td: parse_shots(td.get_text()),
            "saves": lambda td: parse_saves(td.get_text()),
        }

        i = 1
        while i < len(rows):
            header = rows[i].find("th")
            if not header:
                i += 1
                continue

            label = header.get_text(strip=True).lower()
            i += 1
            if i >= len(rows):
                break

            cells = rows[i].find_all("td")
            if len(cells) != 2 or label not in label_map:
                i += 1
                continue

            parser = label_map[label]
            stat_key = label.replace(" ", "_")

            stats[team1][stat_key] = parser(cells[0])
            stats[team2][stat_key] = parser(cells[1])

            i += 1
        return stats

    def _extract_extra_team_stats(self, soup: BeautifulSoup):
        container = soup.find("div", id="team_stats_extra")
        if not container:
            return {}

        stats = {}
        for block in container.find_all("div", recursive=False):
            divs = block.find_all("div")
            if len(divs) < 3:
                continue

            team1 = divs[0].get_text(strip=True)
            team2 = divs[2].get_text(strip=True)

            stats.setdefault(team1, {})
            stats.setdefault(team2, {})

            for i in range(3, len(divs), 3):
                val1 = divs[i].get_text(strip=True)
                label = divs[i + 1].get_text(strip=True).lower().replace(" ", "_")
                val2 = divs[i + 2].get_text(strip=True)

                if val1.isdigit():
                    stats[team1][label] = int(val1)
                if val2.isdigit():
                    stats[team2][label] = int(val2)
        return stats

    def _try_parse_number(self, text: str):
        try:
            return int(text)
        except (ValueError, TypeError):
            try:
                return float(text)
            except (ValueError, TypeError):
                return text if text else None

    def _parse_player_stats_table(self, table, stat_type=None, team_id=None):
        players = []
        rows = table.find_all("tr")
        headers = [cell.get("data-stat") for cell in rows[0].find_all(["th", "td"])]

        for i, row in enumerate(rows):
            if not row.find("th", {"data-stat": "player"}):
                continue

            player_data = {}
            try:
                for cell in row.find_all(["th", "td"]):
                    key = cell.get("data-stat")
                    if not key:
                        continue

                    text = cell.get_text(strip=True)
                    value = self._try_parse_number(text)

                    if key == "player":
                        player_data["name"] = text
                        player_data["link"] = (
                            cell.find("a")["href"] if cell.find("a") else None
                        )
                        player_data["fbref_id"] = (
                            cell.find("a")["href"].split("/")[-2]
                            if cell.find("a")
                            else None
                        )
                    elif key == "age":
                        player_data["age"] = text.split("-")[0]
                    else:
                        player_data[key] = value
                players.append(player_data)
            except Exception as e:
                print(
                    f"❗️ Error parsing row {i} for stat_type '{stat_type}' (team_id: {team_id})"
                )
        return players

    def _extract_player_stats_type(self, soup, team_id, stat_type):
        table_id = f"stats_{team_id}_{stat_type}"
        table = soup.find("table", id=table_id)
        if not table:
            return []
        return self._parse_player_stats_table(table, stat_type, team_id)

    def _extract_all_player_stats_grouped(self, soup, team_id, player_stats_types):
        from collections import defaultdict

        grouped_stats = defaultdict(
            lambda: {"name": None, "link": None, "fbref_id": None}
        )

        for stat_type in player_stats_types:
            try:
                player_rows = self._extract_player_stats_type(
                    soup, team_id=team_id, stat_type=stat_type
                )[1:-1]
            except Exception as e:
                continue

            for idx, row in enumerate(player_rows):
                try:
                    player_id = row["fbref_id"]
                    if grouped_stats[player_id]["fbref_id"] is None:
                        grouped_stats[player_id]["fbref_id"] = player_id
                    grouped_stats[player_id]["name"] = row.pop("name")
                    grouped_stats[player_id]["link"] = row.pop("link")
                    grouped_stats[player_id][f"{stat_type}_stats"] = row
                except KeyError as ke:
                    pass
                except Exception as e:
                    pass

        gk_stat_table = soup.find("table", id=f"keeper_stats_{team_id}")
        if gk_stat_table:
            gk_rows = self._parse_player_stats_table(gk_stat_table)
            if len(gk_rows) > 2:
                gk_rows = gk_rows[1:-1]

            for idx, row in enumerate(gk_rows):
                try:
                    player_id = row["fbref_id"]
                    if grouped_stats[player_id]["fbref_id"] is None:
                        grouped_stats[player_id]["fbref_id"] = player_id
                    grouped_stats[player_id]["name"] = row.pop("name")
                    grouped_stats[player_id]["link"] = row.pop("link")
                    grouped_stats[player_id]["keeper_stats"] = row
                except KeyError as ke:
                    pass
                except Exception as e:
                    pass
        return list(grouped_stats.values())

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
                self.parse_match_page(html)
            finally:
                browser.close()

    def save_to_json(self):
        """Saves the scraped data to a JSON file."""
        if not self.dataset:
            print("No data to save.")
            return

        output_dir = os.path.join("scraped_data", "matches")
        os.makedirs(output_dir, exist_ok=True)
        file_path = os.path.join(output_dir, f"{self.match_id}.json")
        with open(file_path, "w") as f:
            json.dump(self.dataset, f, indent=2)
        print(f"💾 Saved data to {file_path}")


if __name__ == "__main__":
    import time

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((PlaywrightTimeoutError, Exception)),
        reraise=True,
    )
    def run_scraper_with_retries(scraper: FBRefMatchScraper):
        """Runs a scraper with a retry mechanism."""
        scraper.scrape()
        scraper.save_to_json()

    def main():
        """The main function of the script."""
        scraper_instances = [FBRefMatchScraper(scrape) for scrape in scrapes]

        for scraper in scraper_instances:
            try:
                run_scraper_with_retries(scraper)
            except Exception as e:
                print(
                    f"Failed to scrape {scraper.base_url} after multiple retries: {e}"
                )
            time.sleep(5)

    main()
