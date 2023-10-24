import Page404 from "~/pages/ErrorPage/page_404"
import Login from "~/pages/login/login"
import Checkin from "~/pages/staff/checkin"
import getRole from "~/service/RoleService"
import SDefaultLayout from "~/layouts/SDefaultLayout"
import Statistic from "~/pages/staff/statistic"
import Information from "~/pages/staff/information"
import ForgotPassword from "~/pages/login/forgotPassword"
import MDefaultLayout from "~/layouts/MDefaultLayout"
import MStatisitc from "~/pages/manager/MStatistic"
import Employees from "~/pages/manager/Employees"
import InsertEmployee from "~/pages/manager/InsertEmployee"
import UpdateEmployee from "~/pages/manager/UpdateEmployee"
import OldEmployee from "~/pages/manager/OldEmployee"
import Location from "~/pages/manager/Location"
import InsertBranch from "~/pages/manager/InsertBranch"
import UpdateBranch from "~/pages/manager/UpdateBranch"
function getRoutes(isLoggedIn){
    const AppRoutes = [
        { path: '/', component: Login, layout: null },
        { path: '/forgot', component: ForgotPassword, layout: null },
        { path: '/*', component: Page404, layout: null }
      ];
      
      if (isLoggedIn) {
        const role =getRole()
        if(role.role==='STAFF')
        {
            AppRoutes.push({ path: '/checkin', component: Checkin, layout: SDefaultLayout });
            AppRoutes.push({ path: '/statistic', component: Statistic, layout: SDefaultLayout });
            AppRoutes.push({ path: '/information', component: Information, layout: SDefaultLayout });
            AppRoutes.push({ path: '/change-password', component: ForgotPassword, layout: null });
        }
        if(role.role==='MANAGER')
        {
            AppRoutes.push({ path: '/checkin', component: Checkin, layout: MDefaultLayout });
            AppRoutes.push({ path: '/statistic', component: Statistic, layout: MDefaultLayout });
            AppRoutes.push({ path: '/information', component: Information, layout: MDefaultLayout });
            AppRoutes.push({ path: '/change-password', component: ForgotPassword, layout: null });
            AppRoutes.push({ path: '/m-statistic', component: MStatisitc, layout: MDefaultLayout });
            AppRoutes.push({ path: '/m-employees', component: Employees, layout: MDefaultLayout });
            AppRoutes.push({ path: '/insert-employee', component: InsertEmployee, layout: MDefaultLayout });
            AppRoutes.push({ path: '/update/:id', component: UpdateEmployee, layout: MDefaultLayout });
            AppRoutes.push({ path: '/old', component: OldEmployee, layout: MDefaultLayout });
            AppRoutes.push({ path: '/branch', component: Location, layout: MDefaultLayout });
            AppRoutes.push({ path: '/insert-branch', component: InsertBranch, layout: MDefaultLayout });
            AppRoutes.push({ path: '/update-branch/:id', component: UpdateBranch, layout: MDefaultLayout });
        }
      }
    return AppRoutes
}

export default getRoutes