import ManagerTemplate from "@/components/managerTemplate"
import MenuList from "../menuList"

export const metadata = {
   title: 'Dashboard | Ordering System',
   description: 'Generated by create next app',
}

type PropsLayout = {
   children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
   return (
       <ManagerTemplate title="Dashboard" id="dashboard" menuList={MenuList}>
           {children}
       </ManagerTemplate>
   )
}

export default RootLayout
