import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});



export const userLogIn = async (email, password) => {
  console.log(email, password)
  try {
    let response = await api.post("signup/login/", {
      email: email,
      password: password,
    });
    let {users, token} = response.data;
    console.log(`user: ${users}, token: ${token}`)
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
    return users;

  }
  catch (e) {
    console.log(e)
    return null;
  }
};

export const userLogOut = async (onUserUpdate) => {
  try {
    const response = await api.post("signup/logout/");
    
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];

    alert("Logout request completed");
    return null;


  } catch (err) {
    console.error("Logout failed:", err);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];

    alert("Something went wrong during logout.");
  }
};


export const userConfirmation = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  api.defaults.headers.common["Authorization"] = `Token ${token}`;

  try {
    const response = await api.get("signup/info/");
    console.log('user', response.data)
    if (response.status === 200) return response.data;
  } catch (err) {
    console.log("User confirmation failed:", err.response?.status);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    return null;
  }
};


export const stripeCheckout = async (cart) => {
  try {
    const response = await api.post("ticket/purchase/", cart)
    console.log(response)
    return response.data;
  } catch(err) {
    console.error("something went wrong", err);
    return "/tickets"
  }
}

export const grabWeather = async () => {
  try {
    const response = await api.get("weather/")
    console.log(response)
    const {currTemp, feelsLikeTemp, maxTemp, minTemp} = response.data
    console.log(currTemp, feelsLikeTemp, maxTemp, minTemp)
    return {currTemp, feelsLikeTemp, maxTemp, minTemp}
  }
  catch (e) {
    console.error(e)
  }
}


// ============= EVENTS =============

export const fetchEvents = async (setEvents) => {
  try {
    const response = await api.get("event/")
    setEvents(response.data)
  }
  catch (e) {
    console.error(e)
  }
}

export const createEvents = async (setEvents, data) => {
  try {
    await api.post("event/",data)
    fetchEvents(setEvents)
  }
  catch (e) {
    console.error(e)
  }
}

export const deleteEvent = async(setEvents, id) => {
  try{
    await api.delete(`event/${id}/`)
    setEvents(prev => prev.filter(c => c.id !== id))
  }
  catch (e) {
    console.error(e)
  }
}


export const updateEvent = async(setEvents, id, data) => {
  try{
    await api.put(`event/${id}/`, data)
    fetchEvents(setEvents)
  }
  catch (e) {
    console.error(e)
  }
}