import jwt_decode from "jwt-decode";
function getRole() {
  const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")): null;
  const remember=localStorage.getItem("rememberme") ? JSON.parse(localStorage.getItem("rememberme")) :false 
  const role = {
    isLogin: sessionStorage.getItem('isLogin') || false,
    rememberme: remember,
    token: token,
    role: null,
    name: null,
    email: null,
  };

  if ( (!role.isLogin && !role.rememberme) || !role.token) {
    role.token = "";
    role.role = null;
    role.rememberme = false;
    role.name = null;
    role.email = null;
  }
  if (role.token) {
    function getCurrentUser() {
      const token = localStorage.getItem("token") || "";
      try {
        const decode = jwt_decode(token);
        role.role = decode.role;
        role.name = decode.name;
        role.email = decode.email;
      } catch (error) {
        return null;
      }
    }
    getCurrentUser()
  }
  return role;
}

export default getRole;
