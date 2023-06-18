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

export type UserUpdateInputBaseModel = Pick<
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

export type UserUpdateModel = UserUpdateInputBaseModel & { updateAt?: Date; updateBy?: string }

export type UserInputBaseModel = Pick<User, 'username' | 'password'>
export type UserLoginInputModel = UserInputBaseModel
export type UserSignupInputModel = UserInputBaseModel & { confirmPassword: string }

export type UserLoginResponse = UserSignupResponse
export type UserSignupResponse = BaseResponse<{
  user: UserSafeModel
  accessToken: string
}>
