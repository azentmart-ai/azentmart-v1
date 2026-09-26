import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Bot,
  Users,
  KanbanSquare,
  Mic2,
  MessageCircle,
  Megaphone,
  BriefcaseBusiness,
  BarChart3,
  ChevronDown,
  Sparkles,
  ChevronRight,
  LogOut,
  Pencil,
  Mail,
  Phone,
  IdCard,
  X,
  Save,
} from "lucide-react";

import {
  api,
  clearAuth,
  storedUser,
} from "../lib/api";

import "./AppShell.css";


/* =========================================================
   SIDEBAR SECTIONS
========================================================= */

const sections = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "AI Recruiter",
    icon: Bot,
    children: [
      [
        "Create Job",
        "/ai-recruiter/create-job",
      ],
      [
        "AI Job Description",
        "/ai-recruiter/ai-job-description",
      ],
      [
        "Source Candidates",
        "/ai-recruiter/source-candidates",
      ],
      [
        "Candidate Matching",
        "/ai-recruiter/candidate-matching",
      ],
    ],
  },

  {
    label: "Candidates",
    icon: Users,
    children: [
      [
        "All Candidates",
        "/candidates",
      ],
      [
        "AI Shortlisted",
        "/candidates/ai-shortlisted",
      ],
    ],
  },

  {
    label: "Recruitment Pipeline",
    icon: KanbanSquare,
    children: [
      [
        "Applied",
        "/pipeline/applied",
      ],
      [
        "AI Screening",
        "/pipeline/ai-screening",
      ],
      [
        "Shortlisted",
        "/pipeline/shortlisted",
      ],
      [
        "Interview",
        "/pipeline/interview",
      ],
      [
        "Offer",
        "/pipeline/offer",
      ],
      [
        "Hired",
        "/pipeline/hired",
      ],
    ],
  },

  {
    label: "AI Interviewer",
    to: "/ai-interviewer",
    icon: Mic2,
  },

  {
    label: "Candidate Agent",
    to: "/candidate-agent",
    icon: MessageCircle,
  },

  {
    label: "Campaigns",
    to: "/campaigns",
    icon: Megaphone,
  },

  {
    label: "Jobs",
    to: "/jobs",
    icon: BriefcaseBusiness,
  },

  {
    label: "Analytics",
    to: "/analytics",
    icon: BarChart3,
  },
];


/* =========================================================
   DEFAULT PROFILE
========================================================= */

const DEFAULT_PROFILE = {
  name: "Bhuvanesh",
  email: "vbhuvanesh14@gmail.com",
  phone: "",
  role: "RECRUITER",
  recruiterId: "REC-001",
};


/* =========================================================
   NORMALIZE USER
========================================================= */

function normalizeUser(data) {
  const source =
    data?.data ||
    data?.user ||
    data?.profile ||
    data ||
    {};

  return {
    ...source,

    name:
      source.name ||
      source.full_name ||
      DEFAULT_PROFILE.name,

    email:
      source.email ||
      source.email_address ||
      DEFAULT_PROFILE.email,

    phone:
      source.phone ||
      source.phone_number ||
      DEFAULT_PROFILE.phone,

    role:
      source.role ||
      source.job_role ||
      DEFAULT_PROFILE.role,

    recruiterId:
      source.recruiter_id ||
      source.recruiterId ||
      source.employee_id ||
      source.employeeId ||
      source.id ||
      DEFAULT_PROFILE.recruiterId,
  };
}


/* =========================================================
   APP SHELL
========================================================= */

export default function AppShell() {

  const location = useLocation();

  const navigate = useNavigate();


  /* =======================================================
     SIDEBAR STATE
  ======================================================= */

  const [
    open,
    setOpen,
  ] = useState({
    "AI Recruiter": true,
    Candidates: true,
    "Recruitment Pipeline": true,
  });


  /* =======================================================
     USER STATE
  ======================================================= */

  const [
    user,
    setUser,
  ] = useState(() => {

    const saved = storedUser();

    return saved
      ? normalizeUser(saved)
      : DEFAULT_PROFILE;

  });


  /* =======================================================
     EDIT PROFILE MODAL
  ======================================================= */

  const [
    showProfileModal,
    setShowProfileModal,
  ] = useState(false);


  /* =======================================================
     EDITED PROFILE
  ======================================================= */

  const [
    editedProfile,
    setEditedProfile,
  ] = useState(DEFAULT_PROFILE);


  /* =======================================================
     SAVE LOADING
  ======================================================= */

  const [
    profileSaving,
    setProfileSaving,
  ] = useState(false);


  /* =======================================================
     LOAD USER
  ======================================================= */

  useEffect(() => {

    let mounted = true;

    const loadUser = async () => {

      try {

        if (
          typeof api.me !==
          "function"
        ) {
          return;
        }

        const result =
          await api.me();

        if (
          !mounted ||
          !result
        ) {
          return;
        }

        const normalized =
          normalizeUser(result);

        setUser(normalized);

      } catch (error) {

        console.error(
          "Unable to load current user:",
          error
        );

      }

    };

    loadUser();

    return () => {
      mounted = false;
    };

  }, []);


  /* =======================================================
     PAGE TITLE
  ======================================================= */

  const title = useMemo(() => {

    if (
      location.pathname ===
      "/dashboard"
    ) {
      return "Dashboard";
    }

    const childMatch =
      sections
        .flatMap(
          (section) =>
            section.children || []
        )
        .find(
          ([, path]) =>
            location.pathname ===
            path
        );

    if (childMatch) {
      return childMatch[0];
    }

    const parentMatch =
      sections.find(
        (section) =>
          section.to &&
          location.pathname.startsWith(
            section.to
          )
      );

    return (
      parentMatch?.label ||
      "Dashboard"
    );

  }, [
    location.pathname,
  ]);


  /* =======================================================
     INITIALS
  ======================================================= */

  const initials = useMemo(() => {

    const name =
      String(
        user?.name ||
        DEFAULT_PROFILE.name
      ).trim();

    const parts =
      name
        .split(/\s+/)
        .filter(Boolean);

    return parts
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .toUpperCase();

  }, [
    user?.name,
  ]);


  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {

    clearAuth();

    navigate(
      "/login",
      {
        replace: true,
      }
    );

  };


  /* =======================================================
     OPEN PROFILE EDIT
  ======================================================= */

  const openEditProfile = (
    event
  ) => {

    if (event) {
      event.stopPropagation();
    }

    setEditedProfile({

      name:
        user?.name ||
        DEFAULT_PROFILE.name,

      email:
        user?.email ||
        DEFAULT_PROFILE.email,

      phone:
        user?.phone ||
        user?.phone_number ||
        DEFAULT_PROFILE.phone,

      role:
        user?.role ||
        DEFAULT_PROFILE.role,

      recruiterId:
        user?.recruiterId ||
        user?.recruiter_id ||
        user?.id ||
        DEFAULT_PROFILE.recruiterId,

    });

    setShowProfileModal(true);

  };


  /* =======================================================
     UPDATE PROFILE FIELD
  ======================================================= */

  const updateProfileField = (
    field,
    value
  ) => {

    setEditedProfile(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );

  };


  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const saveProfile = async () => {

    try {

      setProfileSaving(true);

      const payload = {
        name:
          editedProfile.name,

        email:
          editedProfile.email,

        phone:
          editedProfile.phone,

        role:
          editedProfile.role,
      };


      if (
        typeof api.updateProfile ===
        "function"
      ) {

        await api.updateProfile(
          payload
        );

      }


      const updatedUser = {
        ...user,
        ...editedProfile,
      };


      setUser(updatedUser);


      try {

        localStorage.setItem(
          "azentmart_user",
          JSON.stringify(
            updatedUser
          )
        );

      } catch {
        // Ignore storage errors.
      }


      setShowProfileModal(false);

    } catch (error) {

      console.error(
        "Profile update failed:",
        error
      );

      alert(
        error?.message ||
        "Unable to update profile."
      );

    } finally {

      setProfileSaving(false);

    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="shell">


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="sidebar">


        {/* =================================================
            BRAND
        ================================================= */}

        <Link
          to="/dashboard"
          className="brand"
        >

          <span className="brand-mark">

            <Sparkles
              size={18}
            />

          </span>

          <span>
            Recruiting{" "}
            <b>Agent</b>
          </span>

        </Link>


        {/* =================================================
            WORKSPACE
        ================================================= */}

        <div className="workspace">

          <span>
            RECRUITING WORKSPACE
          </span>

          <ChevronDown
            size={14}
          />

        </div>


        {/* =================================================
            SCROLLING NAVIGATION
        ================================================= */}

        <div className="sidebar-scroll">

          <nav className="sidebar-nav">

            {sections.map(
              (section) => {

                const Icon =
                  section.icon;


                /* =========================================
                   GROUP NAVIGATION
                ========================================= */

                if (
                  section.children
                ) {

                  return (

                    <div
                      className="nav-group"
                      key={
                        section.label
                      }
                    >

                      <button
                        type="button"
                        className="nav-parent"
                        onClick={() =>
                          setOpen(
                            (previous) => ({
                              ...previous,

                              [section.label]:
                                !previous[
                                  section.label
                                ],
                            })
                          )
                        }
                      >

                        <span className="nav-parent-left">

                          <Icon
                            size={18}
                          />

                          <span>
                            {
                              section.label
                            }
                          </span>

                        </span>


                        {open[
                          section.label
                        ] ? (

                          <ChevronDown
                            size={14}
                          />

                        ) : (

                          <ChevronRight
                            size={14}
                          />

                        )}

                      </button>


                      {open[
                        section.label
                      ] && (

                        <div className="subnav">

                          {section.children.map(
                            ([
                              label,
                              to,
                            ]) => (

                              <NavLink
                                key={to}
                                to={to}
                                className={({
                                  isActive,
                                }) =>
                                  isActive
                                    ? "subnav-item active"
                                    : "subnav-item"
                                }
                              >

                                {label}

                              </NavLink>

                            )
                          )}

                        </div>

                      )}

                    </div>

                  );

                }


                /* =========================================
                   NORMAL NAVIGATION
                ========================================= */

                return (

                  <NavLink
                    key={
                      section.to
                    }
                    to={
                      section.to
                    }
                    className={({
                      isActive,
                    }) =>
                      isActive
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >

                    <Icon
                      size={18}
                    />

                    <span>
                      {
                        section.label
                      }
                    </span>

                  </NavLink>

                );

              }
            )}

          </nav>

        </div>


        {/* =================================================
            AI RECRUITER HELP
        ================================================= */}

        <div className="side-help">

          <div className="help-icon">

            <Sparkles
              size={17}
            />

          </div>

          <strong>
            AI Recruiter is ready
          </strong>

          <p>
            Create jobs, match candidates
            and run AI interviews.
          </p>

          <Link
            to="/ai-recruiter"
          >
            Open AI Recruiter →
          </Link>

        </div>


      </aside>


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main className="main">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="topbar">

          <div className="mobile-brand">

            <Link
              to="/dashboard"
            >
              Recruiting{" "}
              <b>Agent</b>
            </Link>

          </div>


          <div className="crumb">

            {title}

          </div>


          <div className="top-actions">

            <button
              type="button"
              className="top-avatar"
              onClick={
                openEditProfile
              }
              title="Edit Profile"
            >

              {initials}

            </button>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <Outlet />

      </main>


      {/* ===================================================
          EDIT PROFILE MODAL
      =================================================== */}

      {showProfileModal && (

        <div
          className="profile-modal-overlay"
          onMouseDown={(
            event
          ) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              setShowProfileModal(
                false
              );

            }

          }}
        >

          <div className="profile-modal">


            {/* =============================================
                MODAL HEADER
            ============================================= */}

            <div className="profile-modal-header">

              <div className="profile-modal-title">

                <div className="profile-modal-icon">

                  <Pencil
                    size={16}
                  />

                </div>

                <div>

                  <h2>
                    Edit Profile
                  </h2>

                  <p>
                    Update your recruiter
                    information.
                  </p>

                </div>

              </div>


              <button
                type="button"
                className="profile-modal-close"
                onClick={() =>
                  setShowProfileModal(
                    false
                  )
                }
              >

                <X
                  size={17}
                />

              </button>

            </div>


            {/* =============================================
                MODAL BODY
            ============================================= */}

            <div className="profile-modal-body">


              {/* NAME */}

              <div className="profile-form-field">

                <label>
                  Full Name
                </label>

                <div className="profile-input-wrap">

                  <Users
                    size={15}
                  />

                  <input
                    type="text"
                    value={
                      editedProfile.name
                    }
                    onChange={(
                      event
                    ) =>
                      updateProfileField(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Enter full name"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="profile-form-field">

                <label>
                  Email Address
                </label>

                <div className="profile-input-wrap">

                  <Mail
                    size={15}
                  />

                  <input
                    type="email"
                    value={
                      editedProfile.email
                    }
                    onChange={(
                      event
                    ) =>
                      updateProfileField(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="Enter email address"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="profile-form-field">

                <label>
                  Phone Number
                </label>

                <div className="profile-input-wrap">

                  <Phone
                    size={15}
                  />

                  <input
                    type="text"
                    value={
                      editedProfile.phone
                    }
                    onChange={(
                      event
                    ) =>
                      updateProfileField(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+91 XXXXX XXXXX"
                  />

                </div>

              </div>


              {/* RECRUITER ID */}

              <div className="profile-form-field">

                <label>
                  Recruiter ID
                </label>

                <div className="profile-input-wrap disabled">

                  <IdCard
                    size={15}
                  />

                  <input
                    type="text"
                    value={
                      editedProfile.recruiterId
                    }
                    disabled
                  />

                </div>

                <small>
                  Recruiter ID cannot be changed.
                </small>

              </div>


              {/* ROLE */}

              <div className="profile-form-field">

                <label>
                  Role
                </label>

                <div className="profile-input-wrap">

                  <BriefcaseBusiness
                    size={15}
                  />

                  <input
                    type="text"
                    value={
                      editedProfile.role
                    }
                    onChange={(
                      event
                    ) =>
                      updateProfileField(
                        "role",
                        event.target.value
                      )
                    }
                    placeholder="RECRUITER"
                  />

                </div>

              </div>

            </div>


            {/* =============================================
                MODAL FOOTER
            ============================================= */}

            <div className="profile-modal-footer">

              <button
                type="button"
                className="profile-logout-modal-btn"
                onClick={logout}
              >

                <LogOut
                  size={13}
                />

                Logout

              </button>


              <div className="profile-modal-footer-right">

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() =>
                    setShowProfileModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="profile-save-btn"
                  onClick={
                    saveProfile
                  }
                  disabled={
                    profileSaving
                  }
                >

                  <Save
                    size={13}
                  />

                  {
                    profileSaving
                      ? "Saving..."
                      : "Save Profile"
                  }

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}