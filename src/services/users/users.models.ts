import type { User } from '@prisma/client'

import type { BaseResponse, PageResponseModel } from '@/types'

export type UserSafeModel = Omit<User, 'password'>

export type UsersModel = {
  users: User[]
} & PageResponseModel

export type UserExistModel = {
  isExist: boolean
  user: User | null
}

export type UserUpdateInputModel = Pick<
  User,
  | 'email'
  | 'name'
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'phoneNumber'
  | 'birthDate'
  | 'address'
  | 'avatarUrl'
  | 'biography'
>

export type UserUpdateModel = UserUpdateInputModel & { updateAt?: Date; updateBy?: string }

export type UserSignupModel = Pick<User, 'username' | 'password'>
export type UserSignupInputModel = UserSignupModel & { confirmPassword: string }

export type UserSignupResponse = BaseResponse<{
  user: UserSafeModel
  accessToken: string
}>

export type UserLoginInputModel = UserSignupModel
export type UserLoginResponse = UserSignupResponse
