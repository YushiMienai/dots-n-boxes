import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveGameStartFinishFromGameRooms20261127112959 implements MigrationInterface {
  name = 'RemoveGameStartFinishFromGameRooms20261127112959'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE game_rooms
      DROP COLUMN is_game_started,
      DROP COLUMN is_game_finished
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE game_rooms
      ADD is_game_started boolean NOT NULL DEFAULT false,
      ADD is_game_finished boolean NOT NULL DEFAULT false
    `)
  }
}
