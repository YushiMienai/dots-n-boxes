import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddIsPrivateToGameRooms20251119005912 implements MigrationInterface {
  name = 'AddIsPrivateToGameRooms20251119005912'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE game_rooms 
            ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT false
        `)

    await queryRunner.query(`
            CREATE INDEX idx_game_rooms_is_private ON game_rooms(is_private)
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX idx_game_rooms_is_private`)

    await queryRunner.query(`
            ALTER TABLE game_rooms 
            DROP COLUMN is_private
        `)
  }
}