CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO public.country (
    id, created_at, updated_at, name, abbr, fbref_url
) VALUES 
    (gen_random_uuid(), NOW(), NOW(), 'England', 'ENG', 'https://fbref.com/en/country/ENG/England-Football'),
    (gen_random_uuid(), NOW(), NOW(), 'Spain', 'ESP', 'https://fbref.com/en/country/ESP/Spain-Football'),
    (gen_random_uuid(), NOW(), NOW(), 'Italy', 'ITA', 'https://fbref.com/en/country/ITA/Italy-Football'),
    (gen_random_uuid(), NOW(), NOW(), 'Germany', 'GER', 'https://fbref.com/en/country/GER/Germany-Football'),
    (gen_random_uuid(), NOW(), NOW(), 'France', 'FRA', 'https://fbref.com/en/country/FRA/France-Football'),
    (gen_random_uuid(), NOW(), NOW(), 'Netherlands', 'NED', 'https://fbref.com/en/country/NED/Netherlands-Football');
