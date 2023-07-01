import { adminRouteList } from './feature/Admin/route'
import { chatRouteList } from './feature/Chat/route'
import { customerRouteList } from './feature/Customer/route'
import { staticRouteList } from './feature/StaticPages/route'

export const AppRouteList = [...adminRouteList, ...customerRouteList, ...staticRouteList, ...chatRouteList]
