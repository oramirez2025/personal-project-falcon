import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

export const userLogIn = async (email, password) => {
  console.log('Login attempt:', email)
  try {
    let response = await api.post("user/login/", {
      email: email,
      password: password,
    });
    
    // FIXED: Backend returns 'user' (singular), not 'users'
    let {user, token} = response.data;
    console.log(`Logged in user: ${user}, token: ${token}`)
    
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
    
    return user;  // Return the user email

  } catch (e) {
    console.error('Login error:', e.response?.data || e.message)
    return null;
  }
};

export const userLogOut = async () => {
  try {
    const response = await api.post("user/logout/");
    
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];

    console.log("Logout successful");
    return null;

  } catch (err) {
    console.error("Logout failed:", err);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

export const userConfirmation = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  api.defaults.headers.common["Authorization"] = `Token ${token}`;

  try {
    const response = await api.get("user/info/");
    console.log('User confirmed:', response.data)
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

// ============= COMMENTS =============

export const fetchComments = async (setComments, event) => {
  try {
    const response = await api.get(`comment/events/${event}`)
    setComments(response.data)
  }
  catch (e) {
    console.error(e)
  }
}

export const createComments = async (setComments,event,data) => {
  try {
    await api.post(`comment/event/${event}`,data)
    fetchComments(setComments)
  }
  catch (e) {
    console.error(e)
  }
}

export const deleteComment = async(setComments, id) => {
  try{
    await api.delete(`comment/${id}/`)
    setComments(prev => prev.filter(c => c.id !== id))
  }
  catch (e) {
    console.error(e)
  }
}

export const updateComment = async(setComments, id, data) => {
  try{
    await api.put(`comment/${id}/`, data)
    fetchComments(setComments)
  }
  catch (e) {
    console.error(e)
  }
}