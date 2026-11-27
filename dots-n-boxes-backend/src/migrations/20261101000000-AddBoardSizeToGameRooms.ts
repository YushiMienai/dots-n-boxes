import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddBoardSizeToGameRooms20261101000000 implements MigrationInterface {
  name = 'AddBoardSizeToGameRooms20261101000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE game_rooms
      ADD COLUMN board_size INTEGER NOT NULL DEFAULT 10
    `)

    await queryRunner.query(`
      ALTER TABLE game_rooms
      ADD CONSTRAINT game_rooms_board_size_valid
      CHECK (board_size IN (5, 10))
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE game_rooms
      DROP CONSTRAINT game_rooms_board_size_valid
    `)

    await queryRunner.query(`
      ALTER TABLE game_rooms
      DROP COLUMN board_size
    `)
  }
}
