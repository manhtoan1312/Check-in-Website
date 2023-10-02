import Snavbar from "~/Components/SNavbar";

export default function SDefaultLayout({ children }) {
    return(
        <div> 
            <Snavbar/>
                <div className=''>
                    <div>{ children }</div>
                </div>
        </div>
    )
}