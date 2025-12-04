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

/* ================================
   ORGANIZER APIs
================================ */

// Get ALL organizers
export const getAllOrganizersApi = async () => {
  return await handleApi(api.get("/org"));
};

// Get event list of a SINGLE organizer
export const getOrganizerEventsApi = async (orgId) => {
  return await handleApi(api.get(`/org/${orgId}/eve`));
};


/* ================================
   EVENT APIs
================================ */

// Get ALL events (GLOBAL events)
export const getAllEventsApi = async () => {
  return await handleApi(api.get("/org/eve"));
};

// Get SINGLE event (inside specific organizer)
export const getSingleEventApi = async (orgId, eventId) => {
  return await handleApi(api.get(`/org/${orgId}/eve/${eventId}`));
};


/* ================================
   USER APIs
================================ */

// Get ALL users
export const getAllUsersApi = async () => {
  return await handleApi(api.get("/user"));
};
