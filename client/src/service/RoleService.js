import jwt_decode from "jwt-decode";
function getRole() {
  const role = {
    isLogin: sessionStorage.getItem("isLogin") || false,
    rememberme: JSON.parse(localStorage.getItem("rememberme")) || false,
    token: JSON.parse(localStorage.getItem("token")) || null,
    role: null,
    name: null,
    email: null,
  };

  if ((!role.isLogin && !role.rememberme) || !role.token) {
    role.token = "";
    role.role = null;
    role.isLogin = false;
    role.rememberme = false;
    role.name = null;
    role.email = null;
  }
  if (role.token) {
    function getCurrentUser() {
      const token = localStorage.getItem("token") || "";
    //   const secret = "adfghsdfywertdfg451g2dsfg";
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
