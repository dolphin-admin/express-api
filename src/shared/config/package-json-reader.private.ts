import fs from 'fs'

const readPackageJSONSync = () => JSON.parse(fs.readFileSync('package.json', 'utf8'))

export const getAppName = () => {
  const packageJSONData = readPackageJSONSync()
  return packageJSONData.name
}

export const getAppVersion = () => {
  const packageJSONData = readPackageJSONSync()
  return packageJSONData.version
}

export const getAppDescription = () => {
  const packageJSONData = readPackageJSONSync()
  return packageJSONData.description
}

// TODO: Unit Test
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
