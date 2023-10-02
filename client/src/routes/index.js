import Page404 from "~/pages/ErrorPage/page_404"
import Login from "~/pages/login"
import Home from "~/pages/staff/home"
import getRole from "~/service/RoleService"

function getRoutes(isLoggedIn){
    const AppRoutes = [
        { path: '/', component: Login, layout: null },
        { path: '/*', component: Page404, layout: null }
      ];
      
      if (isLoggedIn) {
        const role =getRole()
        if(role.role==='STAFF')
        {
            AppRoutes.push({ path: '/checkin', component: Home, layout: null });
        }
      }
    return AppRoutes
}

export default getRoutes