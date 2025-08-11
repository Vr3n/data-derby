# Team Stats Scraper Implementation Instructions

## Overview

You need to fix the team stats extraction methods in the existing scraper class. The current implementation has several bugs that prevent it from correctly parsing the HTML structure from sports reference websites.

## Files to Modify

- Locate the class containing the `_extract_team_stats` and `_extract_extra_team_stats` methods
- You'll be replacing these methods and adding one new helper method

## Implementation Steps

### 1. Replace the `_extract_team_stats` method

**Location**: Find the existing `_extract_team_stats` method in your scraper class
**Action**: Replace the entire method with the corrected version

**Key fixes implemented:**

- Correctly extracts team names from `<span class="teamandlogo">` elements instead of simple `<th>` tags
- Handles the HTML structure where stats have header rows (with `colspan="2"`) followed by data rows
- Processes rows in pairs rather than assuming simple row structure
- Uses new helper method `_extract_stat_value` for complex data extraction

### 2. Replace the `_extract_extra_team_stats` method

**Location**: Find the existing `_extract_extra_team_stats` method
**Action**: Replace with the corrected version

**Key fixes:**

- Better error handling for malformed stat blocks
- Improved bounds checking to prevent IndexError exceptions
- More robust parsing of the 3-div groups structure

### 3. Add the new `_extract_stat_value` helper method

**Location**: Add this as a new method in the same class
**Purpose**: Handles the complex HTML structure within table cells

**What it does:**

- Special handling for card statistics (counts yellow/red card spans)
- Parses complex formats like "430 of 524 — 82%" and "82% — 329 of 424"
- Extracts the most relevant value from formatted text

### 4. Add the `_try_parse_number` helper method

**Location**: Add this as a new method in the same class (if it doesn't already exist)
**Purpose**: Safely converts text to numbers with fallback

**What it does:**

- Removes common formatting characters (%, commas)
- Attempts integer conversion first, then float
- Returns original text if parsing fails

## Testing Checklist

After implementation, verify these work correctly:

### Basic Functionality

- [ ] Team names are extracted correctly from both main stats and extra stats
- [ ] No crashes when parsing the provided HTML structure
- [ ] All stat categories are captured (possession, passing accuracy, shots on target, saves, cards)

### Data Format Handling

- [ ] "X of Y" format stats (like "430 of 524") are parsed into structured data with `completed`, `total`, and calculated `accuracy`/`percentage` fields
- [ ] Percentage values are extracted correctly for possession stats
- [ ] Card counts work (should return formatted string like "2Y 0R" for 2 yellow cards)
- [ ] Extra stats (fouls, corners, touches, etc.) are captured as simple numbers
- [ ] Field names match the expected data structure exactly (`on_target` not `completed`, `total_shots` not `total`, etc.)

### Error Handling

- [ ] Method handles missing HTML elements gracefully
- [ ] Logs appropriate warnings for malformed data
- [ ] Doesn't crash on unexpected HTML structure changes

## Additional Implementation Notes

### Data Structure Compliance

Your extraction methods need to return data that matches your exact schema:

**For passing_accuracy, shots_on_target, and saves:**

- Use field names: `completed`, `total`, `accuracy`/`percentage`
- Calculate the percentage when it's not explicitly provided
- For shots_on_target specifically: use `on_target` and `total_shots` instead of `completed` and `total`
- For saves specifically: use `shots_saved` and `shots_faced` instead of `completed` and `total`

**For extra stats:**

- Note the typo in your schema: `tackes` should probably be `tackles` (check your existing codebase)
- Ensure field names match exactly: `aerials_won`, `goal_kicks`, `throw_ins`, `long_balls`

### Modified Helper Method Needed

You'll need to modify the `_extract_stat_value` method to handle your specific field naming:

```python
def _extract_stat_value(self, cell, stat_type=None):
    """Extract stat value, formatting according to data structure requirements."""
    # ... existing card handling code ...

    # Handle different stat types with proper field names
    if stat_type == "shots_on_target":
        # Return dict with on_target, total_shots, percentage
    elif stat_type == "saves":
        # Return dict with shots_saved, shots_faced, percentage
    elif stat_type == "passing_accuracy":
        # Return dict with completed, total, accuracy
    # ... etc
```

1. **Don't modify the method signatures** - Keep the same parameter names and return types
2. **Ensure logging statements work** - The code assumes `self.logger` exists
3. **Handle the BeautifulSoup import** - Make sure `BeautifulSoup` is properly imported in your file
4. **Test with different HTML structures** - The sports reference site may change their format

## Verification

Run your scraper on the provided HTML sample and confirm:

1. No exceptions are thrown
2. Both teams' data is extracted
3. The stat formats match the expected structure above
4. Logging output shows successful extraction messages
