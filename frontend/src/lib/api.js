const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

/* =========================================================
   AUTH
========================================================= */

export function token() {
  return localStorage.getItem("azentmart_token") || "";
}

export function setAuth(data) {
  if (data?.access_token) {
    localStorage.setItem(
      "azentmart_token",
      data.access_token
    );
  }

  if (data?.user) {
    localStorage.setItem(
      "azentmart_user",
      JSON.stringify(data.user)
    );
  }
}

export function clearAuth() {
  localStorage.removeItem("azentmart_token");
  localStorage.removeItem("azentmart_user");
}

export function storedUser() {
  try {
    return JSON.parse(
      localStorage.getItem("azentmart_user") || "null"
    );
  } catch {
    return null;
  }
}

/* =========================================================
   ERROR MESSAGE NORMALIZER
========================================================= */

function getErrorMessage(data, fallback = "Something went wrong.") {
  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (typeof data.detail === "object" && data.detail !== null) {
    if (typeof data.detail.message === "string") {
      return data.detail.message;
    }

    if (typeof data.detail.error === "string") {
      return data.detail.error;
    }

    try {
      return JSON.stringify(data.detail);
    } catch {
      return fallback;
    }
  }

  if (typeof data.error === "object" && data.error !== null) {
    if (typeof data.error.message === "string") {
      return data.error.message;
    }

    try {
      return JSON.stringify(data.error);
    } catch {
      return fallback;
    }
  }

  try {
    const stringified = JSON.stringify(data);

    if (
      stringified &&
      stringified !== "{}" &&
      stringified !== "null"
    ) {
      return stringified;
    }
  } catch {
    // Ignore JSON conversion errors.
  }

  return fallback;
}

/* =========================================================
   COMMON REQUEST
========================================================= */

async function request(path, options = {}) {
  const isFormData =
    options.body instanceof FormData;

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),
    ...(options.headers || {}),
  };

  const authToken = token();

  if (authToken) {
    headers.Authorization =
      `Bearer ${authToken}`;
  }

  let response;

  try {
    response = await fetch(
      `${API}${path}`,
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    console.error(
      "API connection error:",
      error
    );

    throw new Error(
      "Unable to connect to the backend server. Make sure the FastAPI server is running on port 8000."
    );
  }

  const data = await response
    .json()
    .catch(() => ({}));

  /* =======================================================
     UNAUTHORIZED
  ======================================================= */

  if (response.status === 401) {
    clearAuth();

    if (
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }

    throw new Error(
      "Your session has expired. Please login again."
    );
  }

  /* =======================================================
     DUPLICATE CANDIDATE
  ======================================================= */

  if (response.status === 409) {
    throw new Error(
      getErrorMessage(
        data,
        "A candidate with this email already exists."
      )
    );
  }

  /* =======================================================
     OTHER API ERRORS
  ======================================================= */

  if (!response.ok) {
    const message = getErrorMessage(
      data,
      `Request failed (${response.status})`
    );

    console.error(
      `API ERROR ${response.status}:`,
      {
        path,
        method: options.method || "GET",
        response: data,
        message,
      }
    );

    throw new Error(message);
  }

  return data;
}

/* =========================================================
   API
========================================================= */

export const api = {

  /* =======================================================
     AUTH
  ======================================================= */

  signup: (payload) =>
    request(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  login: (payload) =>
    request(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  googleLogin: (payload) =>
    request(
      "/auth/google",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  me: () =>
    request("/auth/me"),

  forgotPassword: (payload) =>
    request(
      "/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  resetPassword: (payload) =>
    request(
      "/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  /* =======================================================
     USER / DASHBOARD
  ======================================================= */

  dashboard: () =>
    request("/me/dashboard"),

  profile: () =>
    request("/me"),

  updateProfile: (payload) =>
    request(
      "/me",
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ),

  settings: () =>
    request("/me/settings"),

  updateSettings: (payload) =>
    request(
      "/me/settings",
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ),

  /* =======================================================
     JOBS
  ======================================================= */

  jobs: () =>
    request("/jobs"),

  job: (id) =>
    request(`/jobs/${id}`),

  createJob: (payload) =>
    request(
      "/jobs",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  updateJob: (id, payload) =>
    request(
      `/jobs/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    ),

  deleteJob: (id) =>
    request(
      `/jobs/${id}`,
      {
        method: "DELETE",
      }
    ),

  /* =======================================================
     JOB STATUS
     
     Backend:
     PATCH /api/jobs/{job_id}/status?status=PAUSED
     
     Supported:
     ACTIVE
     PAUSED
     CLOSED
     DRAFT
  ======================================================= */

  jobStatus: (id, status) => {
    if (!id) {
      return Promise.reject(
        new Error("Job ID is missing.")
      );
    }

    if (!status) {
      return Promise.reject(
        new Error("Job status is missing.")
      );
    }

    return request(
      `/jobs/${id}/status?status=${encodeURIComponent(
        String(status).toUpperCase()
      )}`,
      {
        method: "PATCH",
      }
    );
  },

  /* Alias so Jobs.jsx can use either name */

  updateJobStatus: (id, status) => {
    if (!id) {
      return Promise.reject(
        new Error("Job ID is missing.")
      );
    }

    if (!status) {
      return Promise.reject(
        new Error("Job status is missing.")
      );
    }

    return request(
      `/jobs/${id}/status?status=${encodeURIComponent(
        String(status).toUpperCase()
      )}`,
      {
        method: "PATCH",
      }
    );
  },

  /* =======================================================
     JOB MATCHING
  ======================================================= */

  matchJob: (id, payload = {}) =>
    request(
      `/jobs/${id}/match`,
      {
        method: "POST",
        body: JSON.stringify({
          job_id: id,
          ...payload,
        }),
      }
    ),

  /* =======================================================
     CANDIDATES
  ======================================================= */

  candidates: () =>
    request("/candidates"),

  candidate: (id) =>
    request(`/candidates/${id}`),

  createCandidate: (payload) =>
    request(
      "/candidates",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  uploadResume: (file) => {
    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    return request(
      "/candidates/upload-resume",
      {
        method: "POST",
        body: formData,
      }
    );
  },

  deleteCandidate: (id) =>
    request(
      `/candidates/${id}`,
      {
        method: "DELETE",
      }
    ),

  contactCandidate: (id, payload) =>
    request(
      `/candidates/${id}/contact`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  scheduleCandidate: (id, payload) =>
    request(
      `/candidates/${id}/schedule`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  /* =======================================================
     PIPELINE
  ======================================================= */

  pipeline: () =>
    request("/pipeline"),

  moveStage: (payload) =>
    request(
      "/pipeline/move-stage",
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ),

  interviews: () =>
    request("/pipeline/interviews"),

  /* =======================================================
     AI INTERVIEW
  ======================================================= */

  startInterview: (payload) =>
    request(
      "/pipeline/interview/start",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  answerInterview: (payload) =>
    request(
      "/pipeline/interview/answer",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  finishInterview: (payload) =>
    request(
      "/pipeline/interview/finish",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  /* =======================================================
     AI
  ======================================================= */

  generateJD: (payload) =>
    request(
      "/ai/generate-jd",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  chat: (payload) =>
    request(
      "/ai/candidate-agent/chat",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  /* =======================================================
     CAMPAIGNS
  ======================================================= */

  campaigns: () =>
    request("/campaigns"),

  createCampaign: (payload) =>
    request(
      "/campaigns",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  updateCampaign: (id, payload) =>
    request(
      `/campaigns/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    ),

  deleteCampaign: (id) =>
    request(
      `/campaigns/${id}`,
      {
        method: "DELETE",
      }
    ),

  generateCampaign: (id) =>
    request(
      `/campaigns/${id}/generate`,
      {
        method: "POST",
      }
    ),

  launchCampaign: (id) =>
    request(
      `/campaigns/${id}/launch`,
      {
        method: "POST",
      }
    ),

  /* =======================================================
     ANALYTICS
  ======================================================= */

  analytics: () =>
    request("/analytics"),
};