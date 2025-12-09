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

/* ============================================================
   ORGANIZATION API
   ============================================================ */

export const getAllOrganizersApi = async () => {
  try {
    return await handleApi(api.get("/v1/organizations/"));
  } catch (err) {
    return { success: false, message: "Failed to load organizers" };
  }
};

export const getOrganizerEventsApi = async (orgId) => {
  try {
    return await handleApi(api.get(`/v1/organizations/${orgId}/events`));
  } catch (err) {
    return { success: false, message: "Failed to load events" };
  }
};

/* ============================================================
   EVENT API
   ============================================================ */

export const createEventApi = async (orgId, data) => {
  try {
    return await handleApi(
      api.post(`/v1/organizations/${orgId}/events`, data)
    );
  } catch (err) {
    return { success: false, message: "Event creation failed" };
  }
};

export const getAllEventsApi = async () => {
  try {
    return await handleApi(api.get("/v1/events"));
  } catch (err) {
    return { success: false, message: "Failed to load events" };
  }
};

export const getSingleEventApi = async (eventId) => {
  try {
    return await handleApi(api.get(`/v1/events/${eventId}`));
  } catch (err) {
    return { success: false, message: "Failed to load event" };
  }
};

export const updateEventApi = async (orgId, eventId, data) => {
  try {
    return await handleApi(
      api.put(`/v1/organizations/${orgId}/events/${eventId}`, data)
    );
  } catch (err) {
    return { success: false, message: "Event update failed" };
  }
};

export const deleteEventApi = async (orgId, eventId) => {
  try {
    return await handleApi(
      api.delete(`/v1/organizations/${orgId}/events/${eventId}`)
    );
  } catch (err) {
    return { success: false, message: "Event delete failed" };
  }
};

/* ============================================================
   USER API
   ============================================================ */

export const createUserApi = async (data) => {
  try {
    return await handleApi(api.post("/v1/admin/user", data));
  } catch (err) {
    return { success: false, message: "User creation failed" };
  }
};

export const getAllUsersApi = async () => {
  try {
    return await handleApi(api.get("/v1/admin/users"));
  } catch (err) {
    return { success: false, message: "Failed to fetch users" };
  }
};

export const getUserByIdApi = async (id) => {
  try {
    return await handleApi(api.get(`/v1/admin/users/${id}`));
  } catch (err) {
    return { success: false, message: "Failed to load user" };
  }
};

export const updateUserApi = async (id, data) => {
  try {
    return await handleApi(api.put(`/v1/admin/user/${id}`, data));
  } catch (err) {
    return { success: false, message: "User update failed" };
  }
};

export const deleteUserApi = async (id) => {
  try {
    return await handleApi(api.delete(`/v1/admin/user/${id}`));
  } catch (err) {
    return { success: false, message: "User delete failed" };
  }
};
