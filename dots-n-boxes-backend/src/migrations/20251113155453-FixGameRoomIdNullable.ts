import {MigrationInterface, QueryRunner} from 'typeorm'

export class FixGameRoomIdNullable20251113155453 implements MigrationInterface {
  name = 'FixGameRoomIdNullable20251113155453'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Делаем game_room_id nullable
    await queryRunner.query(`
            ALTER TABLE players 
            ALTER COLUMN game_room_id DROP NOT NULL
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Возвращаем NOT NULL (осторожно - только если все игроки имеют комнату)
    await queryRunner.query(`
            ALTER TABLE players 
            ALTER COLUMN game_room_id SET NOT NULL
        `)
  }
}
