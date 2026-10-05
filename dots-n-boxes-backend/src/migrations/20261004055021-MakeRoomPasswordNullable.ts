import {MigrationInterface, QueryRunner} from 'typeorm'

export class MakeRoomPasswordNullable20261004055021 implements MigrationInterface {
    name = 'MakeRoomPasswordNullable20261004055021'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          ALTER TABLE game_rooms
          ALTER COLUMN password DROP NOT NULL;
    `)

      await queryRunner.query(`
          ALTER TABLE game_rooms
          ALTER COLUMN password DROP DEFAULT;
    `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          ALTER TABLE game_rooms
          ALTER COLUMN password SET DEFAULT '';
    `)

      await queryRunner.query(`
          ALTER TABLE game_rooms
          ALTER COLUMN password SET NOT NULL;
    `)
    }
}
