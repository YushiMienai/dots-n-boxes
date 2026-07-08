import {MigrationInterface, QueryRunner} from 'typeorm'

export class AlterUserAgentTypeToText20251221040721 implements MigrationInterface {
  name = 'AlterUserAgentTypeToText20251221040721'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE refresh_tokens
      ALTER COLUMN user_agent TYPE TEXT;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE refresh_tokens
      ALTER COLUMN user_agent TYPE VARCHAR(100);
    `)
  }
}
