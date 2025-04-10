"""Indexing the fields.

Revision ID: 58d0646733b1
Revises: 9f7aa40f3351
Create Date: 2025-04-05 10:49:23.057336

"""
from typing import Sequence, Union

import sqlmodel
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58d0646733b1'
down_revision: Union[str, None] = '9f7aa40f3351'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index(op.f('ix_competitionplayerstats_competition_id'),
                    'competitionplayerstats', ['competition_id'], unique=False)
    op.create_index(op.f('ix_competitionplayerstats_player_id'),
                    'competitionplayerstats', ['player_id'], unique=False)
    op.create_index(op.f('ix_competitionplayerstats_season_id'),
                    'competitionplayerstats', ['season_id'], unique=False)
    op.create_index(op.f('ix_competitionplayerstats_stat_type_id'),
                    'competitionplayerstats', ['stat_type_id'], unique=False)
    op.create_index(op.f('ix_competitionplayerstats_team_id'),
                    'competitionplayerstats', ['team_id'], unique=False)
    op.create_index(op.f('ix_competitionteamstats_competition_id'),
                    'competitionteamstats', ['competition_id'], unique=False)
    op.create_index(op.f('ix_competitionteamstats_season_id'),
                    'competitionteamstats', ['season_id'], unique=False)
    op.create_index(op.f('ix_competitionteamstats_stat_type_id'),
                    'competitionteamstats', ['stat_type_id'], unique=False)
    op.create_index(op.f('ix_competitionteamstats_team_id'),
                    'competitionteamstats', ['team_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_competitionteamstats_team_id'),
                  table_name='competitionteamstats')
    op.drop_index(op.f('ix_competitionteamstats_stat_type_id'),
                  table_name='competitionteamstats')
    op.drop_index(op.f('ix_competitionteamstats_season_id'),
                  table_name='competitionteamstats')
    op.drop_index(op.f('ix_competitionteamstats_competition_id'),
                  table_name='competitionteamstats')
    op.drop_index(op.f('ix_competitionplayerstats_team_id'),
                  table_name='competitionplayerstats')
    op.drop_index(op.f('ix_competitionplayerstats_stat_type_id'),
                  table_name='competitionplayerstats')
    op.drop_index(op.f('ix_competitionplayerstats_season_id'),
                  table_name='competitionplayerstats')
    op.drop_index(op.f('ix_competitionplayerstats_player_id'),
                  table_name='competitionplayerstats')
    op.drop_index(op.f('ix_competitionplayerstats_competition_id'),
                  table_name='competitionplayerstats')
    # ### end Alembic commands ###
