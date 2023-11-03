import getRole from "./RoleService";

const url = "http://192.168.114.211:9000/get-workday";
//personal with month
async function GetPersonalWorkday(month) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/${month}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      return {
        success: true,
        detail: data.data.detail,
        summary: data.data.summary,
      };
    } else {
      const data = await response.json();
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}
//download personal with month
async function DownloadPersonalFile(email, month) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/personal-download/${email}/${month}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      responseType: "blob",
    });
    if (response.status === 200) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statistic_${email}_${month}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const data = await response.json();
      return { success: data.success, message: data.message };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Client Error" };
  }
}
//personal get period
async function getWorkDaybyDate(start, end) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/period/${start}/${end}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return {
        success: true,
        detail: data.detail,
        summary: data.summary,
      };
    } else {
      const data = await response.json();
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

//get personal workday with email, period time
async function MgetWorkDaybyDate(email, start, end) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/e-period/${email}/${start}/${end}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return {
        success: true,
        detail: data.detail,
        summary: data.summary,
      };
    } else {
      const data = await response.json();
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

//download personal workday by date
async function DownloadPersonalbyDate(start, end) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/p-download/period/${start}/${end}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      responseType: "blob",
    });
    if (response.status === 200) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statistic_${role.email}_${start}-${end}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const data = await response.json();
      return { success: data.success, message: data.message };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Client Error" };
  }
}
// get all employees workday
async function getStatisticall(month, page) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/all/${month}/${page}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      return {
        success: true,
        detail: data.data.detail,
        summary: data.data.summary,
        size:data.data.size,
        empSize:data.data.empSize
      };
    } else {
      const data = await response.json();
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

//download statistic of all employees
async function downloadAll(month) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/download/${month}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      responseType: "blob",
    });
    if (response.status === 200) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statistic_all_${month}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const data = await response.json();
      return { success: data.success, message: data.message };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Client Error" };
  }
}

//get personal workday by email
async function getWorkdayByEmail(email, month) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/email/${email}/${month}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      return {
        success: true,
        detail: data.detail,
        summary: data.summary,
      };
    } else {
      const data = await response.json();
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

//get all employee workday with period
async function MgetAllbyDate(page, start, end) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/all-period/${start}/${end}/${page}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return {
        success: true,
        detail: data.detail,
        summary: data.summary,
        size:data.size,
        empSize:data.empSize
      };
    } else {
      const data = await response.json();
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}

//download personal workday by email and period time
async function MDownloadPbyDate(email, start, end) {
  try {
    const role = getRole();
    const response = await fetch(
      `${url}/p-download/e-period/${email}/${start}/${end}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${role.token}`,
        },
        responseType: "blob",
      }
    );
    if (response.status === 200) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statistic_${role.email}_${start}-${end}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const data = await response.json();
      return { success: data.success, message: data.message };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Client Error" };
  }
}

//download all employees statistic with period time
async function DownloadAllbyDate(start, end) {
  try {
    const role = getRole();
    const response = await fetch(`${url}/p-download/all-period/${start}/${end}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${role.token}`,
      },
      responseType: "blob",
    });
    if (response.status === 200) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statisticAll_${start}-${end}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const data = await response.json();
      return { success: data.success, message: data.message };
    }
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Client Error" };
  }
}

export {
  GetPersonalWorkday,
  DownloadPersonalFile,
  getWorkDaybyDate,
  DownloadPersonalbyDate,
  getStatisticall,
  downloadAll,
  getWorkdayByEmail,
  MDownloadPbyDate,
  DownloadAllbyDate,
  MgetWorkDaybyDate,
  MgetAllbyDate,
};
