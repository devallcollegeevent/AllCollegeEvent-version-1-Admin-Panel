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
  return await handleApi(api.get("/v1/organizations/"));
};

// Get organizer all event list
export const getOrganizerEventsApi = async (orgId) => {
  return await handleApi(api.get(`/v1/organizations/${orgId}/events`));
};


// =================================== event api ==============================================

// create Event Api
export const createEventApi = async (orgId , data) => {
  return await handleApi(
    api.post(`/v1/organizations/${orgId}/events`, data)
  );
};

// Get ALL events (GLOBAL events)
export const getAllEventsApi = async () => {
    return await handleApi(api.get("/v1/organizations/eve"));
};

//  Get SINGLE event (inside specific organizer)
export const getSingleEventApi = async (orgId, eventId) => {
  return await handleApi(api.get(`/v1/organizations${orgId}/events/${eventId}`));
};

// update singel event
export const updateEventApi = async (orgId, eventId, data) => {
  return await handleApi(
    api.put(`/v1/organizations/${orgId}/events/${eventId}`, data)
  );
};

// delete singel event 
export const deleteEventApi = async (orgId, eventId) => {
  return await handleApi(
    api.delete(`/v1/organizations/${orgId}/events/${eventId}`)
  );
};

// =================================== user api ==============================================

// CREATE NEW USER
export const createUserApi = async (data) => {
  return await handleApi(
    api.post("/v1/auth/signup", data)
  );
};

//  Get ALL users 
export const getAllUsersApi = async () => {
  return await handleApi(api.get("/v1/users"));
};

//  Get SINGLE user details 
export const getUserByIdApi = async (id) => {
  return await handleApi(api.get(`/v1/users/${id}`));
};

//  Update user (name, email, status, etc.) 
export const updateUserApi = async (id, data) => {
  return await handleApi(
    api.put(`/v1/user/${id}`, data)
  );
};

//  Delete user 
export const deleteUserApi = async (id) => {
  console.log("...../",id)
  return await handleApi(api.delete(`/v1/user/${id}`));
};
