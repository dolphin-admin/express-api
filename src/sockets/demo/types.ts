export interface UserInfo {
  id: number
  username: string
}

export interface UserInfoWithMessage extends UserInfo {
  message: string
}
