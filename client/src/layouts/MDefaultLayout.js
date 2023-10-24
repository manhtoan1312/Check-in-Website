import Mnavbar from "~/Components/MNavBar"

export default function MDefaultLayout({ children }) {
    return(
        <div> 
            <Mnavbar/>
                <div className='md:pt-[80px] pt-[60px] relative h-[100vh] w-full'>
                    { children }
                </div>
        </div>
    )
}