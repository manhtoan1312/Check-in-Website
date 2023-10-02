const url='http://localhost:8080/auth'

const login = async (email, password) => {
    try {
        const response = await fetch(`${url}/login`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password
          }),
        });
        if(response.status===200){
            const data = await response.json();
            return { success: true, message: data.message, token:data.token };
            
        }
        else {
            const data = await response.json();
            return { success: false, message: data.message };
        }
      } catch (err) {
        return { success: false, message: "Client Error" };
      }
}

export {login}