import api from "./axios";

// Standard API Handler
async function handleApi(promise) {
  try {
    const res = await promise;
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
      status: err.response?.status || 500,
    };
  }
}


// =================================== organisation api ==============================================

// Get ALL organizers list Api
export const getAllOrganizersApi = async () => {
  return await handleApi(api.get("/org"));
};

// Get organizer all event list
export const getOrganizerEventsApi = async (orgId) => {
  return await handleApi(api.get(`/org/${orgId}/eve`));
};


// =================================== event api ==============================================

// create Event Api
export const createEventApi = async (data) => {
  return await handleApi(
    api.post("/org/eve/create", data) 
  );
};

// Get ALL events (GLOBAL events)
export const getAllEventsApi = async () => {
  return await handleApi(api.get("/org/eve"));
};

//  Get SINGLE event (inside specific organizer)
export const getSingleEventApi = async (orgId, eventId) => {
  return await handleApi(api.get(`/org/${orgId}/eve/${eventId}`));
};

// update singel event
export const updateEventApi = async (orgId, eventId, data) => {
  return await handleApi(
    api.put(`/org/${orgId}/eve/${eventId}`, data)
  );
};

// delete singel event 
export const deleteEventApi = async (orgId, eventId) => {
  return await handleApi(
    api.delete(`/org/${orgId}/eve/${eventId}`)
  );
};

// =================================== user api ==============================================

// CREATE NEW USER
export const createUserApi = async (data) => {
  return await handleApi(
    api.post("/acc/signup", data)
  );
};

//  Get ALL users 
export const getAllUsersApi = async () => {
  return await handleApi(api.get("/user"));
};

//  Get SINGLE user details 
export const getUserByIdApi = async (id) => {
  return await handleApi(api.get(`/user/${id}`));
};

//  Update user (name, email, status, etc.) 
export const updateUserApi = async (id, data) => {
  return await handleApi(
    api.put(`/user/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    })
  );
};

//  Delete user 
export const deleteUserApi = async (id) => {
  return await handleApi(api.delete(`/user/${id}`));
};
