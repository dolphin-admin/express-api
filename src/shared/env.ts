import dotenv from 'dotenv'
import fs from 'fs'

// TODO: dotenv config not working
dotenv.config()

/**
 * 获取环境变量
 * @description 字符串类型
 */
export const getEnvStr = (key: string, defaultValue: string): string => process.env[String(key)] || defaultValue

/**
 * 获取环境变量
 * @description 数字类型
 */
export const getEnvNumber = (key: string, defaultValue: number): number =>
  Number(process.env[String(key)]) || defaultValue

/**
 * 获取 Package.json 文件
 */
const readPackageJSONSync = () => JSON.parse(fs.readFileSync('package.json', 'utf8'))

/**
 * 获取应用名称
 */
export const getAppName = () => {
  const packageJSONData = readPackageJSONSync()
  return packageJSONData.name
}

/**
 * 获取应用版本号
 */
export const getAppVersion = () => {
  const packageJSONData = readPackageJSONSync()
  return packageJSONData.version
}

/**
 * 获取应用描述
 */
export const getAppDescription = () => {
  const packageJSONData = readPackageJSONSync()
  return packageJSONData.description
}

// TODO: Unit Test
/**
 * 获取应用作者信息
 */
export const getAuthorInfo = (): { name: string; email: string; url: string } => {
  const packageJSONData = readPackageJSONSync()
  const authorValue = packageJSONData.author
  if (authorValue?.name) {
    return {
      name: authorValue.name,
      email: authorValue.email,
      url: authorValue.url
    }
  }
  const splitByLeftArrow = packageJSONData.author.split('<')
  const name = splitByLeftArrow[0].trim()
  const email = splitByLeftArrow[1].split('>')[0].trim()
  const url = splitByLeftArrow[1].split('>')[1].replace('(', '').replace(')', '').trim()
  return {
    name,
    email,
    url
  }
}

// TODO: Unit Test
/**
 * 根据 Key 获取 Package.json 中的值
 */
export const getPackageJSONByKey = (key: string) => {
  try {
    const packageJSONData = readPackageJSONSync()
    if (key.includes('.')) {
      const keys = key.split('.')
      let result = packageJSONData
      keys.forEach((k) => {
        result = result[k]
      })
      return result
    }
    return packageJSONData[key]
  } catch (error) {
    console.log(error)
    return ''
  }
}
