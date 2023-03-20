// import { appDelay } from '~/helpers/timer';
import { useRoutes } from 'react-router-dom'
import PrivateRoute from './PrivateRoutes'
import PublicRoute from './PublicRoutes'

export function getRoutesFromContainer(routeList) {
  const routes = []
  routeList.forEach((route) => {
    routes.push(route)
  })
  return routes
}

export const AppRoutes = () => {
  const routes = [...PrivateRoute(), ...PublicRoute()]
  console.log('all routes: ', [...routes])
  return useRoutes([...routes])
}

// export const initModules = async (modules = [], container = 'app') => {
//      await Promise.all([
//           modules.map(async (item) => {
//                const [reducer, saga] = await Promise.all([
//                     import(`src/containers/${container}/screens/${item.path}/redux/reducer`),
//                     import(`src/containers/${container}/screens/${item.path}/redux/saga`),
//                ]);
//                store.injectReducer(item.key, reducer.default);
//                store.injectSaga(item.key, saga.default);
//           }),
//      ]);
//      // To ensure that modules in injected
//      // await appDelay(100);
// };
