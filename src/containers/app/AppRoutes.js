import { customerRouteList } from './feature/Customer/route'
import { staticRouteList } from './feature/StaticPages/route'

export const AppRouteList = [...customerRouteList, ...staticRouteList]
