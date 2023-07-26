import type { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import type { IncomingHttpHeaders } from 'http'
import path from 'path'

import type { Lang, MessageSchema } from '@/types'
import { LangList } from '@/utils'

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

/**
 * 加载语言翻译文件
 */
const loadTranslations = (lang: Lang) => {
  const filePath = path.join(__dirname, `../../locales/${lang}.json`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  translations[lang] = JSON.parse(fileContents)
}

/**
 * 加载所有语言翻译文件
 */
LangList.forEach((lang) => {
  loadTranslations(lang)
})

/**
 * 获取翻译
 */
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

/**
 * 处理语言中间件
 */
export const processLang = (req: Request, _: Response, next: NextFunction) => {
  let currentLang: Lang
  const { language } = req.headers as Headers

  if (language) {
    currentLang = language as Lang
  } else {
    currentLang = 'zh_CN'
  }

  req.lang = currentLang

  // 将翻译 t 方法挂载到 req 上
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
