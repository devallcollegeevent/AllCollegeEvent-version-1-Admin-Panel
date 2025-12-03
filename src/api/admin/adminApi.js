import api from "../axios";

// Generic handler
async function handleApi(promise) {
  try {
    const res = await promise;
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
      status: err.response?.status || 500,
    };
  }
}

/* ================================
      ADMIN LOGIN
================================ */
export const adminLoginApi = async (data) => {
  return await handleApi(api.post("/admin/login", data));
};

/* ================================
      ADMIN — ORGANIZER APIs
================================ */

// Get all organizers
export const adminOrganizersApi = async () => {
  return await handleApi(api.get("/admin/organizers"));
};

// Get organizer events
export const adminGetOrganizerEventsApi = async (id) => {
  return await handleApi(api.get(`/admin/organizers/${id}/events`));
};

// Update organizer status
export const updateOrganizerStatusApi = async (id, status) => {
  return await handleApi(api.patch(`/admin/organizers/${id}/status`, { status }));
};

/* ================================
      ADMIN — EVENT APIs
================================ */

export const adminEventsApi = async () => {
  return await handleApi(api.get("/admin/events"));
};

export const updateEventStatusApi = async (id, status) => {
  return await handleApi(
    api.patch(`/admin/event/status/${id}`, { status })
  );
};

export const deleteEventAdminApi = async (id) => {
  return await handleApi(api.delete(`/admin/event/delete/${id}`));
};

/* ================================
      ADMIN — USER APIs
================================ */

export const adminUsersApi = async () => {
  return await handleApi(api.get("/admin/users"));
};

export const updateUserStatusApi = async (id, status) => {
  return await handleApi(
    api.patch(`/admin/users/status/${id}`, { status })
  );
};
