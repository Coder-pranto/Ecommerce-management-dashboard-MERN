import Navbar from "../components/Navbar.jsx/index.jsx"
import { Outlet } from 'react-router-dom'
import  SideBar  from "../components/Sidebar/index.jsx"
import IdleTimer from "../components/IdleTimeLogout/IdleTimer.jsx"
// const InitialLayout = () => {
//     return (
//         <>
//             <div className="flex">
//                 <div className="lg:w-[22%] ">
//                     <SideBar />
//                 </div>
//                 <div className="lg:w-[78%] w-[100vw] overflow-x-hidden">
//                     <Navbar />
//                     <IdleTimer/>
//                     <Outlet />
//                 </div>
//             </div>
//         </>
//     )
// }

// export default InitialLayout;


const InitialLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="lg:w-[22%] h-full">
                <SideBar />
            </div>
            <div className="lg:w-[78%] w-[100vw] overflow-x-hidden h-full flex flex-col">
                <Navbar />
                <IdleTimer/>
                <div className="overflow-y-auto flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default InitialLayout;
