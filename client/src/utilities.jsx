import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

export const userLogIn = async (email, password) => {
  let response = await api.post("signup/login/", {
    email: email,
    password: password,
  });
  if (response.status === 200) {
    console.log('enter if')
    let { user, token } = response.data;
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
    return user;
  }
  alert(response.data);
  return null;
};

export const userLogOut = async () => {
  let response = await api.post("signup/logout/");
  if (response.status === 204) {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    return null;
  }
  alert("Something went wrong and logout failed");
};


export const userConfirmation = async () => {
  let token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
    let response = await api.get("signup/info/");
    if (response.status === 200) {
    //   return response.data.user;
        // window.location.href='/';
    }
  }

  return null;
};