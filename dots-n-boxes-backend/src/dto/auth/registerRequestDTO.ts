import {IsString, Matches, MaxLength, MinLength} from 'class-validator'

export class RegisterRequestDTO {
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {message: 'Name can only contain letters, numbers and underscores'})
  name: string

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string
}