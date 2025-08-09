# Match Table Extraction

## Fields to Extract

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

## The Output Structure.

```json
{
  "match_week": "",
  "week_day": "",
  "schedule_epoch": "",
  "home_team": { "name": "", "link": "" },
  "away_team": { "name": "", "link": "" },
  "score": "",
  "attendance": "",
  "venue": "",
  "refree": "",
  "match_link": ""
}
```
