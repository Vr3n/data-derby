# Match Table Extraction

## [x] Fields to Extract

| Field          | Source                                                                               |
| -------------- | ------------------------------------------------------------------------------------ |
| match_week     | `th[data-stat="gameweek"]` → text                                                    |
| week_day       | `td[data-stat="dayofweek"]` → text                                                   |
| schedule_epoch | `td[data-stat="start_time"] > span[data-venue-epoch]` → `data-venue-epoch` attribute |
| home_team.name | `td[data-stat="home_team"]` → anchor text                                            |
| home_team.link | `td[data-stat="home_team"] a` → `href` attribute                                     |
| away_team.name | `td[data-stat="away_team"]` → anchor text                                            |
| away_team.link | `td[data-stat="away_team"] a` → `href` attribute                                     |
| score          | `td[data-stat="score"]` → text                                                       |
| attendance     | `td[data-stat="attendance"]` → `csk` attribute                                       |
| venue          | `td[data-stat="venue"]` → text                                                       |
| refree         | `td[data-stat="referee"]` → text                                                     |
| match_link     | `td[data-stat="match_report"] a` → `href` attribute                                  |

## [] The Output Structure.

- The fbref_id should be extracted from match link. The this element is the fbref_id of the match: `/en/matches/cc5b4244/Manchester-United-Fulham-August-16-2024-Premier-League`
  - The `/en/matches/<fbref_id>/<home_team>-<away_team>-<date>-<competition_name>`
  - We need the fbref_id as id for unique matches.
- For home and away team objects:
  - we get name
  - The team fbref_id should be extracted from home_team_link and away_team_link respectively.
  - it is the `/en/squads/<fbref_id>`

```json
{
  "fbref_id": "",
  "match_week": "",
  "week_day": "",
  "schedule_epoch": "",
  "home_team": { "fbref_id": "", "name": "", "link": "" },
  "away_team": { "fbref_id": "", "name": "", "link": "" },
  "score": "",
  "attendance": "",
  "venue": "",
  "refree": "",
  "match_link": "",
  "date": "",
  "day": "",
  "competition_fbref_id": "",
  "season": ""
}
```

## [] CSV Saving changes.

- The `home_team` and `away_team` should not be in json.
  - Nested json fields should be represented as `*_name`, `*_link`, `*_fbref_id`
  - the `*` should be considered as `home_team` or `away_team` accordingly.
