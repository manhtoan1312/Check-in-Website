import Snavbar from "~/Components/SNavbar";

export default function SDefaultLayout({ children }) {
    return(
        <div> 
            <Snavbar/>
                <div className='md:pt-[80px] pt-[60px] relative h-[100vh] w-full'>
                    { children }
                </div>
        </div>
    )
}