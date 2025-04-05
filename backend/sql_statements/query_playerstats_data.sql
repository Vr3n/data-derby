SELECT
	c.name AS competition_name,
	t.name as team_name,
	cps.season_id,
	cps.stat_type_id,
	p.name AS player_name,
	cps.data
FROM 
	public.competitionplayerstats cps
JOIN
	public.team t ON cps.team_id = t.fbref_id
JOIN
	public.competition c ON cps.competition_id = c.fbref_id
JOIN
	public.player p ON cps.player_id = p.fbref_id;
