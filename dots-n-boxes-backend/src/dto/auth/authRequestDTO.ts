import {IsString} from 'class-validator'

export class AuthRequestDTO {
  @IsString()
  name: string

  @IsString()
  password: string
}