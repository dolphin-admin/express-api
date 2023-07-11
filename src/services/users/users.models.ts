import type { User } from '@prisma/client'

import type { BaseResponse, PageResponseModel } from '@/types'

export type OmitPassword<T> = Omit<T, 'password'>

export interface PageUserModel extends OmitPassword<User> {
  genderLabel: string
  roles: string[]
  authTypes: string[]
}

export type PageUsersModel = {
  users: PageUserModel[]
} & PageResponseModel

export type UserExistModel = {
  isExist: boolean
  user: User | null
}

export type UserUpdateModel = Partial<
  Pick<
    User,
    | 'username'
    | 'password'
    | 'email'
    | 'phoneNumber'
    | 'name'
    | 'firstName'
    | 'lastName'
    | 'nickName'
    | 'avatarUrl'
    | 'gender'
    | 'country'
    | 'province'
    | 'city'
    | 'address'
    | 'biography'
    | 'birthDate'
    | 'verified'
    | 'enabled'
  >
>

export type UserUpdateKeys = keyof UserUpdateModel

export type UserInputBaseModel = Pick<User, 'username' | 'password'>
export type UserLoginInputModel = UserInputBaseModel
export type UserSignupInputModel = UserInputBaseModel & { confirmPassword: string }

export type UserLoginResponse = UserSignupResponse
export type UserSignupResponse = BaseResponse<{
  user: OmitPassword<User>
  accessToken: string
}>

export type UserCreateInputModel = UserInputBaseModel
export type UserCreateResponse = BaseResponse<OmitPassword<User>>

export type UserChangePasswordModel = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export type UserResetPasswordModel = {
  password: string
}

export enum Gender {
  'FEMALE' = 0,
  'MALE' = 1
}

type GenderLabelKey = 'Gender.Male' | 'Gender.Female'

export const genderLabelKeyMap = new Map<number, GenderLabelKey>([
  [0, 'Gender.Male'],
  [1, 'Gender.Female']
])
