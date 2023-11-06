import getRole from "./RoleService";

const uri = "https://check-in-website.onrender.com/location";

const GetAllLocation = async (page) => {
  try {
    const role = getRole();
    const response = await fetch(`${uri}/${page}`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return {
        success: true,
        data: data.data,
        size:data.size

      };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const AddLocation = async (location) => {
  try {
    const role = getRole();
    const response = await fetch(`${uri}`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      body: JSON.stringify({
        location,
      }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const UpdateLocation = async (id, location) => {
  try {
    const role = getRole();
    const response = await fetch(`${uri}`, {
      method: "put",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      body: JSON.stringify({
        id,
        location,
      }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const DeleteLocation = async (id) => {
  try {
    const role = getRole();
    const response = await fetch(`${uri}/${id}`, {
      method: "delete",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const SearchLocation = async (key,page) => {
  try {
    const role = getRole();
    const response = await fetch(`${uri}/search/${key}/${page}`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    const data = await response.json();
    return data.result;
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const GetLocationByID = async (id) => {
  try {
    const role = getRole();
    const response = await fetch(`${uri}/by_id/${id}`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

export {
  GetAllLocation,
  AddLocation,
  UpdateLocation,
  DeleteLocation,
  SearchLocation,
  GetLocationByID,
};
