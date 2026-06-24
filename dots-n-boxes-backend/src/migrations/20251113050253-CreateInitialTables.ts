import {MigrationInterface, QueryRunner} from 'typeorm'

export class CreateInitialTables20251113050253 implements MigrationInterface {
  name = 'CreateInitialTables20251113050253'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаем таблицу game_rooms
    await queryRunner.query(`
            CREATE TABLE game_rooms (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(50) NOT NULL,
                password VARCHAR(100) NOT NULL,
                max_players INTEGER NOT NULL DEFAULT 2,
                is_game_started BOOLEAN NOT NULL DEFAULT false,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `)

    // Создаем таблицу players
    await queryRunner.query(`
            CREATE TABLE players (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(50) NOT NULL,
                is_online BOOLEAN NOT NULL DEFAULT true,
                game_room_id UUID NOT NULL,
                joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_player_game_room 
                    FOREIGN KEY (game_room_id) 
                    REFERENCES game_rooms(id) 
                    ON DELETE CASCADE
            )
        `)

    // Создаем таблицу game_states (если нужна)
    await queryRunner.query(`
            CREATE TABLE game_states (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                game_room_id UUID NOT NULL UNIQUE,
                current_player_id UUID,
                board_state JSONB NOT NULL DEFAULT '[]',
                game_status VARCHAR(20) NOT NULL DEFAULT 'waiting',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_game_state_game_room 
                    FOREIGN KEY (game_room_id) 
                    REFERENCES game_rooms(id) 
                    ON DELETE CASCADE
            )
        `)

    // Создаем индексы для улучшения производительности
    await queryRunner.query(`CREATE INDEX idx_players_game_room_id ON players(game_room_id)`)
    await queryRunner.query(`CREATE INDEX idx_players_is_online ON players(is_online)`)
    await queryRunner.query(`CREATE INDEX idx_game_rooms_is_game_started ON game_rooms(is_game_started)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем в обратном порядке (из-за foreign keys)
    await queryRunner.query(`DROP TABLE game_states`)
    await queryRunner.query(`DROP TABLE players`)
    await queryRunner.query(`DROP TABLE game_rooms`)
  }
}