import {MigrationInterface, QueryRunner} from 'typeorm'

export class CreateRefreshTokensTable20251215092013 implements MigrationInterface {
  name = 'CreateRefreshTokensTable20251215092013'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE refresh_tokens (
          id BIGSERIAL PRIMARY KEY,
          player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
          token_hash VARCHAR(64) NOT NULL UNIQUE,
          user_agent VARCHAR(100),
          ip_address INET,
          issued_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL,
          last_used_at TIMESTAMPTZ,
          is_revoked BOOLEAN DEFAULT FALSE
      )
    `)

    await queryRunner.query('CREATE INDEX idx_token_hash ON refresh_tokens USING HASH(token_hash)')
    await queryRunner.query('CREATE INDEX idx_token_player ON refresh_tokens(player_id)')
    await queryRunner.query('CREATE INDEX idx_expires ON refresh_tokens(expires_at)')
    await queryRunner.query('CREATE INDEX idx_active ON refresh_tokens(player_id, expires_at) WHERE NOT is_revoked')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE refresh_tokens')
  }
}
