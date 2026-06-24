import * as bcrypt from 'bcrypt'
import {Repository} from 'typeorm'
import {PlayerEntity} from '@entities'
import {AuthRequestDTO, RegisterRequestDTO} from '@dto'
import {UserExistsError, InvalidCredentialsError} from '@errors'


export class AuthService {
  constructor(private playerRepo: Repository<PlayerEntity>) {}

  async register(registerDto: RegisterRequestDTO): Promise<PlayerEntity> {
    const player = await this.playerRepo.findOne({
      where: [{name: registerDto.name}]
    })

    if (player) {
      throw new UserExistsError(player.name)
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12)

    return await this.playerRepo.save({
      name: registerDto.name,
      password: hashedPassword
    })
  }

  async login(authDto: AuthRequestDTO): Promise<PlayerEntity> {
    const player = await this.playerRepo.findOne({
      where: {name: authDto.name},
      select: ['id', 'name', 'password']
    })
    const isPasswordValid = player ? await bcrypt.compare(authDto.password, player.password) : false

    if (!player || !isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    return player
  }

  async getPlayer(id: string | undefined): Promise<PlayerEntity | null> {
    return await this.playerRepo.findOne({where: {id}})
  }
}