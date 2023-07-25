import type { UserTraffic } from '@/prisma/generated/mongo'
import type { PageResponseModel } from '@/types'

export type PageUserTrafficsModel = {
  userTraffics: UserTraffic[]
} & PageResponseModel

export type UserTrafficCreateInputModel = Pick<
  UserTraffic,
  | 'userId'
  | 'userName'
  | 'records'
  | 'app'
  | 'version'
  | 'env'
  | 'source'
  | 'userAgent'
  | 'ip'
  | 'area'
  | 'latitude'
  | 'longitude'
  | 'altitude'
  | 'enterAt'
  | 'leaveAt'
  | 'duration'
>
