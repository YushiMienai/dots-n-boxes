import {MigrationInterface, QueryRunner} from 'typeorm'

export class ReplaceIsPrivateWithAccessLevel20261003070539 implements MigrationInterface {
  name = 'ReplaceIsPrivateWithAccessLevel20261003070539'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE game_rooms
            DROP COLUMN is_private;
        `)

    await queryRunner.query(`
      ALTER TABLE game_rooms
        ADD COLUMN access_level TEXT NOT NULL DEFAULT 'public';
      `)

    await queryRunner.query(`
            ALTER TABLE game_rooms
                ADD CONSTRAINT game_rooms_access_level_valid
                    CHECK (access_level IN ('invite_only', 'friends_only', 'password', 'public'));
        `)

    await queryRunner.query(`
            ALTER TABLE game_rooms
                ADD CONSTRAINT game_rooms_password_matches_access_level
                    CHECK (
                        (access_level = 'password' AND password IS NOT NULL)
                            OR (access_level <> 'password' AND password IS NULL)
                        );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE game_rooms
                DROP CONSTRAINT game_rooms_password_matches_access_level;
        `)

    await queryRunner.query(`
            ALTER TABLE game_rooms
                DROP CONSTRAINT game_rooms_access_level_valid;
        `)

    await queryRunner.query(`
            ALTER TABLE game_rooms
                DROP COLUMN access_level;
        `)

    await queryRunner.query(`
            ALTER TABLE game_rooms
                ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT false;
        `)
  }
}
