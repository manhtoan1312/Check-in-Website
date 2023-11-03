import getRole from "./RoleService";

const url = "http://192.168.114.211:9000/auth";

const login = async (email, password) => {
  try {
    const response = await fetch(`${url}/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      return { success: true, message: data.message, token: data.token };
    } else {
      const data = await response.json();
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const getInfor = async () => {
  try {
    const role = getRole();
    const response = await fetch(`${url}/get-infor`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      return { success: data.success, data: data.message };
    } else {
      const data = await response.json();
      return { success: data.success, message: data.message };
    }
  } catch (err) {
    return { success: false, message: "Client Error" };
  }
};

const updateInfor = async (name, phone, gender, address) => {
  try {
    const role = getRole();
    const response = await fetch(`${url}/update-infor`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        gender: gender,
        address: address,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      return { success: data.success, message: data.message };
    } else {
      const data = await response.json();
      return { success: data.success, message: data.message };
    }
  } catch (err) {
    return { success: false, message: "Client Error" };
  }
};

async function ForgotgetOTP(email) {
  try {
    const response = await fetch(`${url}/forgot-password`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function ForgotChangePassword(email, password, otp) {
  try {
    const response = await fetch(`${url}/forgot-password/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        otp: otp,
      }),
    });
    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (err) {
    return { success: false, message: "Client Error" };
  }
}

async function GetOTP() {
  try {
    const role = getRole();
    const response = await fetch(`${url}/update-infor/get-OTP`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}
async function ChangePassword(password, otp) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/update-password`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      body: JSON.stringify({
        password: password,
        otp: otp,
      }),
    });
    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (err) {
    return { success: false, message: "Client Error" };
  }
}

async function checkmail(email) {
  try {
    const response = await fetch(`${url}/checkmail`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (err) {
    return { success: false, message: "Client Error" };
  }
}

async function getAllActiveUser(page) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/all-user/${page}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.data, size:data.size };
    } else {
      return { success: false, message: data.data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function createEmployee(
  name,
  gender,
  phone,
  address,
  email,
  password,
  role
) {
  try {
    const user = getRole();
    const response = await fetch(`${url}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        name,
        gender,
        phone,
        address,
        email,
        password,
        role,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function updateEmployee(employee, changepassword) {
  try {
    const user = getRole();
    const response = await fetch(`${url}/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        _id: employee._id,
        email: employee.email,
        password: employee.password,
        role: employee.role,
        name: employee.name,
        gender: employee.gender,
        address: employee.address,
        phone: employee.phone,
        changepassword: changepassword,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function searchActiveEmployees(key,page) {
  try {
    const newkey = key.replace(" ", "+");
    const user = getRole();
    const response = await fetch(`${url}/search-active/${newkey}/${page}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.data, size:data.size };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function deleteEmployee(id) {
  try {
    const user = getRole();
    const response = await fetch(`${url}/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function FindAccountbyID(id) {
  try {
    const user = getRole();
    const response = await fetch(`${url}/find/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function GetOldEmployee(page) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/old-user/${page}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.data, size:data.size };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function SearchUnactiveEmployees(key, page) {
  try {
    const newkey = key.replace(" ", "+");
    const user = getRole();
    const response = await fetch(`${url}/search-unactive/${newkey}/${page}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    
    if (response.status === 200) {
      return { success: true, data: data.data, size:data.size };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function PermanentlydeleteEmployee(id) {
  try {
    const user = getRole();
    const response = await fetch(`${url}/permanently-delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

async function RestoreEmployee(id) {
  try {
    const user = getRole();
    const response = await fetch(`${url}/restore/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}


export {
  login,
  getInfor,
  updateInfor,
  ForgotgetOTP,
  ForgotChangePassword,
  checkmail,
  GetOTP,
  ChangePassword,
  getAllActiveUser,
  createEmployee,
  updateEmployee,
  searchActiveEmployees,
  deleteEmployee,
  FindAccountbyID,
  GetOldEmployee,
  SearchUnactiveEmployees,
  PermanentlydeleteEmployee,
  RestoreEmployee
};
