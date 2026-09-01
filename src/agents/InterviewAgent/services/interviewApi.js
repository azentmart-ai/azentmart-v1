const API_URL = "http://localhost:8000";

/* =====================================================
   USER AUTH
===================================================== */

export async function registerUser(userData) {
    const response = await fetch(
        `${API_URL}/api/users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Registration failed"
        );
    }

    return response.json();
}


export async function loginUser(loginData) {
    const response = await fetch(
        `${API_URL}/api/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Login failed"
        );
    }

    return response.json();
}


/* =====================================================
   INTERVIEW SESSION
===================================================== */

export async function createInterviewSession(
    sessionData
) {
    const response = await fetch(
        `${API_URL}/api/interviews/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sessionData),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to create interview session"
        );
    }

    return response.json();
}


export async function getUserInterviewSessions(
    userId
) {
    const response = await fetch(
        `${API_URL}/api/interviews/user/${userId}`
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to get interview sessions"
        );
    }

    return response.json();
}


export async function getInterviewSession(
    sessionId
) {
    const response = await fetch(
        `${API_URL}/api/interviews/${sessionId}`
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to get interview session"
        );
    }

    return response.json();
}


export async function endInterviewSession(
    sessionId
) {
    const response = await fetch(
        `${API_URL}/api/interviews/${sessionId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: "ended",
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to end interview session"
        );
    }

    return response.json();
}


/* =====================================================
   RESUME
===================================================== */

export async function uploadResumeFile(
    userId,
    file
) {
    const formData = new FormData();

    formData.append("user_id", userId);
    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/api/resumes/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to upload resume"
        );
    }

    return response.json();
}


export async function createResume(
    resumeData
) {
    const response = await fetch(
        `${API_URL}/api/resumes/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resumeData),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to create resume"
        );
    }

    return response.json();
}


export async function updateResume(
    resumeId,
    resumeData
) {
    const response = await fetch(
        `${API_URL}/api/resumes/${resumeId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resumeData),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to update resume"
        );
    }

    return response.json();
}


/* =====================================================
   INTERVIEW COPILOT WEBSOCKET
===================================================== */

export function connectInterviewCopilot(
    sessionId,
    onMessage,
    onError,
    onClose
) {
    const socket = new WebSocket(
        `ws://localhost:8000/ws/interview/${sessionId}`
    );

    socket.onopen = () => {
        console.log(
            "Interview WebSocket connected:",
            sessionId
        );
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            if (onMessage) {
                onMessage(data);
            }
        } catch (error) {
            console.error(
                "Invalid WebSocket message:",
                error
            );
        }
    };

    socket.onerror = (error) => {
        console.error(
            "Interview WebSocket error:",
            error
        );

        if (onError) {
            onError(error);
        }
    };

    socket.onclose = () => {
        console.log(
            "Interview WebSocket closed"
        );

        if (onClose) {
            onClose();
        }
    };

    return socket;
}







export async function getUserResumes(userId) {
    const response = await fetch(
        `${API_URL}/api/resumes/user/${userId}`
    );

    if (!response.ok) {
        // Fallback for query parameter based route
        const fallbackResponse = await fetch(
            `${API_URL}/api/resumes/?user_id=${userId}`
        );
        if (!fallbackResponse.ok) {
            const error = await fallbackResponse.json().catch(() => ({}));
            throw new Error(error.detail || "Failed to get resumes");
        }
        return fallbackResponse.json();
    }

    return response.json();
}






/* =====================================================
   DOCUMENTS
===================================================== */

export async function getUserDocuments(
    userId,
    sourceType = "all",
    search = ""
) {
    const params = new URLSearchParams();

    if (sourceType && sourceType !== "all") {
        params.append("source_type", sourceType);
    }

    if (search) {
        params.append("search", search);
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const response = await fetch(
        `${API_URL}/api/documents/user/${userId}${queryString}`
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to get documents"
        );
    }

    return response.json();
}


export async function uploadDocumentFile(
    userId,
    file
) {
    const formData = new FormData();

    formData.append("user_id", userId);
    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/api/documents/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to upload document"
        );
    }

    return response.json();
}


export async function scrapeDocument(
    documentData
) {
    const response = await fetch(
        `${API_URL}/api/documents/scrape`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(documentData),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to scrape document"
        );
    }

    return response.json();
}


export async function createManualDocument(
    documentData
) {
    const response = await fetch(
        `${API_URL}/api/documents/manual`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(documentData),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Failed to create manual document"
        );
    }

    return response.json();
}