import { PrismaQuery } from '@/shared'

export const getMenuTree = async () => {
  const menuTree = await PrismaQuery.menu.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: { children: true }
      }
    }
  })

  console.log(menuTree)

  return menuTree
}
