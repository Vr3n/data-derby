"""Player Competition Matches.

Revision ID: 8b4a51bbd2e6
Revises: 58d0646733b1
Create Date: 2025-04-05 10:53:04.189746

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '8b4a51bbd2e6'
down_revision: Union[str, None] = '58d0646733b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('competitionplayerstats', sa.Column(
        'matches', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('competitionplayerstats', 'matches')
    # ### end Alembic commands ###
