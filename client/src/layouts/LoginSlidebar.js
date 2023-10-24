import img from "~/Assets/images/official-login.jpg";

function LoginSlidebar({children}) {
  return (
    <div className="h-[100vh] bg-gradient-to-tl to-[#75EEFF] from-[#1E3E3C] flex relative">
      <div className="container m-auto lg:h-[700px] xl:w-[1140px] items-center bg-white xl:rounded-2xl shadow-md sm:rounded-none">
        <div className="lg:grid grid-cols-2 gap-5 items-center">
          <div className="hidden lg:block h-[80vh] p-4">
            <div className="h-full rounded-sm flex justify-center items-center">
              <img className="w-full " src={img} alt="login" />
            </div>
          </div>
          <div className="">{children }</div>
        </div>
      </div>
    </div>
  );
}

export default LoginSlidebar;