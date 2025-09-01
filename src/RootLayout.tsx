import { Outlet } from "react-router-dom";
import NavBar from "./components/navigation/NavBar";
//Outlet child elementin nerede render edileceğinin belirteçi
function RootLayout(){
    return <>
    <NavBar/>
    <Outlet/>
    </>
}

export default RootLayout