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
    throw e;
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
    throw err
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

// ============= PAYMENTS =============

export const createOrder = async (cart) => {
  try {
    const response = await api.post("payments/orders/create/", cart)
    console.log(response)
    return response.data;
  } catch(err) {
    console.error("something went wrong", err);
    throw err;
  }
}

export const payForOrder = async (orderId) => {
  try {
    const response = await api.post(`payments/create-intent/`, {
      order_id: orderId,
    });
    return response.data 
  } catch (err) {
    console.log("Error paying for order.");
    throw err;
  }
};


export const reserveTickets = async (orderId) => {
  const response = await api.patch('payments/reserve/', {order_id: orderId});
  return response.data
}

// ============= WEATHER =============

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

export const fetchEvent = async (setEvent, eventId) => {
  try {
    const response = await api.get(`event/${eventId}/`)
    setEvent(response.data)
  } catch (e) {
    console.error(e)
  }
}

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
    throw e
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

// ============= USER PROFILE =============

export const fetchUserProfile = async () => {
  try {
    const response = await api.get("user/account/");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    throw err;
  }
};

export const fetchUserTickets = async () => {
  try {
    const response = await api.get("user/tickets/");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user tickets:", err);
    throw err;
  }
};

export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profile_pic', file);

    const response = await api.patch("user/account/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to upload profile picture:", err);
    throw err;
  }
};

// ============= COMMENTS =============

export const fetchCommentThread = async (commentId) => {
  try {
    const response = await api.get(`comment/single/${commentId}/`)
    return response.data 
  } 
  catch (e) {
    console.error(e)
  }
}

export const fetchComments = async (setComments, event) => {
  try {
    const response = await api.get(`comment/events/${event}/`)
    setComments(response.data)
  }
  catch (e) {
    console.error(e)
  }
}

export const createComments = async (eventId, data) => {
  try {
    const response = await api.post(`comment/events/${eventId}/`, data);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};


export const deleteRecursive = (comments, id) => {
  return comments
    .filter(c => c.id !== id)
    .map(c => ({
      ...c,
      replies: deleteRecursive(c.replies || [], id),
    }));
};


export const deleteComment = async (_setComments, id) => {
  try {
    await api.delete(`comment/${id}/`);
  } catch (e) {
    console.error(e);
  }
}
export const updateComment = async (_setComments, _event, id, data) => {
  try {
    const response = await api.put(`comment/${id}/`, data);
    return response.data; 
  } catch (e) {
    console.error(e);
  }
};