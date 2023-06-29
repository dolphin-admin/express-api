import type { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import type { IncomingHttpHeaders } from 'http'
import path from 'path'

import { LangList } from '@/shared'
import type { Lang, MessageSchema } from '@/types'

interface Headers extends IncomingHttpHeaders {
  language?: string
}

interface Translation {
  [key: string]: string | Translation
}

const translations: Record<Lang, Translation> = {
  en_US: {},
  zh_CN: {}
}

const loadTranslations = (lang: Lang) => {
  const filePath = path.join(__dirname, `../../locales/${lang}.json`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  translations[lang] = JSON.parse(fileContents)
}

LangList.forEach((lang) => {
  loadTranslations(lang)
})

const getTranslation = (translation: Translation, key: string): string | undefined => {
  const parts = key.split('.')
  let current: string | Translation | undefined = translation

  parts.forEach((part) => {
    if (typeof current === 'object' && current !== null) {
      current = current[part]
    } else {
      current = undefined
    }
  })
  return typeof current === 'string' ? current : undefined
}

export const processLang = (req: Request, res: Response, next: NextFunction) => {
  let currentLang: Lang
  const { language } = req.headers as Headers

  if (language) {
    currentLang = language as Lang
  } else {
    currentLang = 'zh_CN'
  }

  req.t = (key: MessageSchema, lang: Lang = currentLang) => {
    if (!LangList.includes(lang)) {
      console.error(`Invalid lang type: ${lang}`)
      return "Support lang type: 'en_US' or 'zh_CN'!"
    }
    const translation = translations[lang]
    const value = getTranslation(translation, key)

    if (value) {
      return value
    }
    console.error(`Translation missing: key = ${key} , lang = ${lang} `)
    return key
  }

  next()
}
