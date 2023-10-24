import getRole from "./RoleService";

const url = "http://192.168.114.211:9000";

const checkin = async (latitude, longitude) => {
  try {
    const role = getRole();
    const response = await fetch(`${url}/checkin`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      return {
        success: true,
        message: data.message,
        time: data.time,
        fine: data.fine,
      };
    } else {
      const data = await response.json();
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

export { checkin };
