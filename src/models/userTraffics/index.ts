import type { UserTraffic, UserTrafficRecord } from '@prisma/pg'

import type { PageResponseModel } from '@/types'

export type PageUserTrafficsModel = {
  userTraffics: UserTraffic[]
} & PageResponseModel

export type UserTrafficCreateInputModel = Pick<
  UserTraffic,
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
> & {
  records: Pick<UserTrafficRecord, 'title' | 'url' | 'path' | 'enterAt' | 'leaveAt' | 'duration'>[]
}
