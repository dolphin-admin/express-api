import type zh_CN from '@/locales/zh_CN.json'
import type { LangList } from '@/shared'

export type Lang = (typeof LangList)[number]

type JSONSchema = typeof zh_CN

type Concat<K extends string, V extends string> = `${K}.${V}`

type Flatten<T, K extends string = ''> = T extends Record<string, any>
  ? { [P in keyof T]: Flatten<T[P], K extends '' ? P : Concat<K, P & string>> }[keyof T]
  : K

export type MessageSchema = Flatten<JSONSchema>
