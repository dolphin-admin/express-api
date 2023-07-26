import type { UserTrafficRecordVO } from './userTrafficRecordVO'

export class UserTrafficVO {
  public id: number

  public app: string

  public version: string

  public env: string

  public source: string

  public userAgent: string

  public ip: string

  public area: string

  public longitude: number

  public latitude: number

  public altitude: number

  public enterAt: string

  public leaveAt: string

  public duration: number

  public userId: number

  public username: string

  public records: UserTrafficRecordVO[]

  public recordsCount: number

  constructor(data: any) {
    this.id = data.id
    this.app = data.app
    this.version = data.version
    this.env = data.env
    this.source = data.source
    this.userAgent = data.userAgent
    this.ip = data.ip
    this.area = data.area
    this.longitude = data.longitude
    this.latitude = data.latitude
    this.altitude = data.altitude
    this.enterAt = data.enterAt
    this.leaveAt = data.leaveAt
    this.duration = data.duration
    this.userId = data.userId
    this.username = data.username
    this.records = data.records
    this.recordsCount = data.recordsCount
  }
}
