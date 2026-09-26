import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Send,
  CalendarCheck,
  FileText,
  MessageCircle,
  ChevronRight,
  Search,
  UserRound,
  Mail,
  BriefcaseBusiness,
  Bot,
  Loader2,
  Users,
  RefreshCw,
} from "lucide-react";

import { api } from "../lib/api";
import "./CandidateAgent.css";

export default function CandidateAgent() {
  /* =========================================================
     STATE
  ========================================================= */

  const [candidates, setCandidates] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");

  const [mode, setMode] = useState("Candidate Support");

  const [text, setText] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Select a candidate to start. I can answer questions using the candidate's available application, resume, skills, projects and job context.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [candidateError, setCandidateError] = useState("");

  /* =========================================================
     AGENT MODES
  ========================================================= */

  const agentModes = [
    {
      name: "Candidate Support",
      icon: MessageCircle,
      description: "Answer process and candidate questions",
    },
    {
      name: "Interview Coach",
      icon: Sparkles,
      description: "Prepare for role-specific interviews",
    },
    {
      name: "Application Guide",
      icon: FileText,
      description: "Explain application and pipeline steps",
    },
    {
      name: "Scheduling Assistant",
      icon: CalendarCheck,
      description: "Guide scheduling and availability",
    },
  ];

  /* =========================================================
     NORMALIZE CANDIDATE RESPONSE
  ========================================================= */

  const extractCandidates = (result) => {
    if (Array.isArray(result)) {
      return result;
    }

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    if (Array.isArray(result?.candidates)) {
      return result.candidates;
    }

    if (Array.isArray(result?.items)) {
      return result.items;
    }

    if (Array.isArray(result?.results)) {
      return result.results;
    }

    if (Array.isArray(result?.data?.candidates)) {
      return result.data.candidates;
    }

    if (Array.isArray(result?.data?.items)) {
      return result.data.items;
    }

    return [];
  };

  /* =========================================================
     CANDIDATE HELPERS
  ========================================================= */

  const getCandidateId = (candidate) => {
    return (
      candidate?.candidate_id ??
      candidate?.candidateId ??
      candidate?.id ??
      candidate?.candidate?.id ??
      ""
    );
  };

  const getCandidateName = (candidate) => {
    return String(
      candidate?.candidate_name ??
        candidate?.candidateName ??
        candidate?.name ??
        candidate?.full_name ??
        candidate?.fullName ??
        candidate?.candidate?.name ??
        "Candidate"
    );
  };

  const getCandidateEmail = (candidate) => {
    return String(
      candidate?.email ??
        candidate?.candidate_email ??
        candidate?.candidateEmail ??
        candidate?.candidate?.email ??
        ""
    );
  };

  const getCandidateJob = (candidate) => {
    return String(
      candidate?.job_title ??
        candidate?.jobTitle ??
        candidate?.position ??
        candidate?.role ??
        candidate?.job?.title ??
        "Candidate"
    );
  };

  const getCandidateStage = (candidate) => {
    return String(
      candidate?.stage ??
        candidate?.status ??
        candidate?.pipeline_stage ??
        candidate?.pipelineStage ??
        "Applied"
    );
  };

  const getCandidateScore = (candidate) => {
    const score =
      candidate?.score ??
      candidate?.match_score ??
      candidate?.matchScore ??
      candidate?.ai_score ??
      candidate?.aiScore;

    if (
      score === undefined ||
      score === null ||
      score === ""
    ) {
      return null;
    }

    const value = Number(score);

    return Number.isNaN(value)
      ? null
      : Math.round(value);
  };

  const getCandidateSkills = (candidate) => {
    const skills =
      candidate?.skills ??
      candidate?.skill_set ??
      candidate?.skillSet ??
      candidate?.resume?.skills ??
      candidate?.candidate?.skills ??
      [];

    if (Array.isArray(skills)) {
      return skills
        .map((skill) => {
          if (typeof skill === "string") {
            return skill;
          }

          return (
            skill?.name ??
            skill?.skill ??
            skill?.title ??
            ""
          );
        })
        .filter(Boolean);
    }

    if (typeof skills === "string") {
      return skills
        .split(/[,|]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getCandidateProjects = (candidate) => {
    const projects =
      candidate?.projects ??
      candidate?.resume?.projects ??
      candidate?.candidate?.projects ??
      [];

    if (Array.isArray(projects)) {
      return projects
        .map((project) => {
          if (typeof project === "string") {
            return project;
          }

          return (
            project?.name ??
            project?.title ??
            project?.project_name ??
            project?.projectName ??
            project?.description ??
            ""
          );
        })
        .filter(Boolean);
    }

    if (typeof projects === "string") {
      return [projects];
    }

    return [];
  };

  const getCandidateExperience = (candidate) => {
    const experience =
      candidate?.experience ??
      candidate?.work_experience ??
      candidate?.workExperience ??
      candidate?.resume?.experience ??
      candidate?.candidate?.experience ??
      [];

    if (Array.isArray(experience)) {
      return experience
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return [
            item?.title,
            item?.role,
            item?.position,
            item?.company,
            item?.organization,
            item?.description,
          ]
            .filter(Boolean)
            .join(" — ");
        })
        .filter(Boolean);
    }

    if (typeof experience === "string") {
      return [experience];
    }

    return [];
  };

  const getCandidateResume = (candidate) => {
    return String(
      candidate?.resume_text ??
        candidate?.resumeText ??
        candidate?.resume_content ??
        candidate?.resumeContent ??
        candidate?.resume?.text ??
        candidate?.resume?.content ??
        candidate?.candidate?.resume_text ??
        candidate?.candidate?.resumeText ??
        ""
    );
  };

  const getInitials = (candidate) => {
    const name = getCandidateName(candidate);

    return (
      name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "C"
    );
  };

  /* =========================================================
     LOAD CANDIDATES
  ========================================================= */

  const loadCandidates = async () => {
    try {
      setLoadingCandidates(true);
      setCandidateError("");

      const result = await api.candidates();

      console.log(
        "CANDIDATE AGENT API RESPONSE:",
        result
      );

      const data = extractCandidates(result);

      console.log(
        "NORMALIZED CANDIDATES:",
        data
      );

      setCandidates(data);

      if (candidateId) {
        const exists = data.some(
          (candidate) =>
            String(getCandidateId(candidate)) ===
            String(candidateId)
        );

        if (!exists) {
          setCandidateId("");
        }
      }
    } catch (error) {
      console.error(
        "CANDIDATE LOAD ERROR:",
        error
      );

      setCandidates([]);

      setCandidateError(
        error?.message ||
          "Unable to load candidates."
      );
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoadingCandidates(true);
        setCandidateError("");

        const result = await api.candidates();

        console.log(
          "CANDIDATE AGENT API RESPONSE:",
          result
        );

        const data = extractCandidates(result);

        if (!mounted) return;

        setCandidates(data);
      } catch (error) {
        console.error(
          "CANDIDATE LOAD ERROR:",
          error
        );

        if (!mounted) return;

        setCandidates([]);

        setCandidateError(
          error?.message ||
            "Unable to load candidates."
        );
      } finally {
        if (mounted) {
          setLoadingCandidates(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     SEARCH CANDIDATES
  ========================================================= */

  const filteredCandidates = useMemo(() => {
    const value = candidateSearch
      .trim()
      .toLowerCase();

    if (!value) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      const searchableText = [
        getCandidateName(candidate),
        getCandidateEmail(candidate),
        getCandidateJob(candidate),
        getCandidateStage(candidate),
        String(getCandidateId(candidate)),
        getCandidateSkills(candidate).join(" "),
        getCandidateProjects(candidate).join(" "),
        getCandidateResume(candidate),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(value);
    });
  }, [candidates, candidateSearch]);

  /* =========================================================
     SELECTED CANDIDATE
  ========================================================= */

  const selectedCandidate = useMemo(() => {
    return candidates.find(
      (candidate) =>
        String(getCandidateId(candidate)) ===
        String(candidateId)
    );
  }, [candidates, candidateId]);

  /* =========================================================
     SELECT CANDIDATE
  ========================================================= */

  const selectCandidate = (id) => {
    setCandidateId(id);

    if (!id) {
      setMessages([
        {
          role: "assistant",
          text:
            "Select a candidate to start. I can answer questions using the candidate's available application, resume, skills, projects and job context.",
        },
      ]);

      return;
    }

    const candidate = candidates.find(
      (item) =>
        String(getCandidateId(item)) ===
        String(id)
    );

    if (!candidate) return;

    const name = getCandidateName(candidate);
    const job = getCandidateJob(candidate);
    const skills = getCandidateSkills(candidate);

    const initialMessages = [
      {
        role: "assistant",
        text:
          `I'm now assisting with ${name}'s candidate context for the ${job} role. Ask me a specific question and I'll use the available candidate information.`,
      },
    ];

    if (skills.length > 0) {
      initialMessages.push({
        role: "assistant",
        text:
          `Candidate skills available: ${skills
            .slice(0, 12)
            .join(", ")}.`,
      });
    }

    setMessages(initialMessages);
  };

  /* =========================================================
     BUILD CANDIDATE CONTEXT
  ========================================================= */

  const buildCandidateContext = (candidate) => {
    if (!candidate) {
      return "";
    }

    const skills =
      getCandidateSkills(candidate);

    const projects =
      getCandidateProjects(candidate);

    const experience =
      getCandidateExperience(candidate);

    const resume =
      getCandidateResume(candidate);

    return [
      `Candidate Name: ${getCandidateName(candidate)}`,
      `Position: ${getCandidateJob(candidate)}`,
      `Current Stage: ${getCandidateStage(candidate)}`,

      getCandidateEmail(candidate)
        ? `Email: ${getCandidateEmail(candidate)}`
        : "",

      skills.length
        ? `Skills: ${skills.join(", ")}`
        : "",

      projects.length
        ? `Projects: ${projects.join(" | ")}`
        : "",

      experience.length
        ? `Experience: ${experience.join(" | ")}`
        : "",

      resume
        ? `Resume Content:\n${resume.slice(0, 7000)}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  /* =========================================================
     DETECT OLD GENERIC BACKEND RESPONSE
  ========================================================= */

  const isGenericBackendReply = (reply) => {
    const value = String(reply || "")
      .trim()
      .toLowerCase();

    if (!value) {
      return true;
    }

    const genericPhrases = [
      "i can help with recruiting-process questions",
      "i can help with recruiting process questions",
      "based on the available context, i can explain next steps",
      "i can help with recruiting-process",
      "i can help with recruiting process",
      "your question was:",
    ];

    return genericPhrases.some((phrase) =>
      value.includes(phrase)
    );
  };

  /* =========================================================
     QUESTION-SPECIFIC CANDIDATE ANSWER
  ========================================================= */

  const generateCandidateResponse = (
    question,
    candidate
  ) => {
    if (!candidate) {
      return (
        "Please select a candidate first. " +
        "I need the candidate context to answer " +
        "this question specifically."
      );
    }

    const q = String(question || "")
      .toLowerCase();

    const name =
      getCandidateName(candidate);

    const job =
      getCandidateJob(candidate);

    const stage =
      getCandidateStage(candidate);

    const skills =
      getCandidateSkills(candidate);

    const projects =
      getCandidateProjects(candidate);

    const experience =
      getCandidateExperience(candidate);

    const resume =
      getCandidateResume(candidate);

    const score =
      getCandidateScore(candidate);

    const skillText = skills.length
      ? skills.slice(0, 15).join(", ")
      : "No structured skills available.";

    const projectText = projects.length
      ? projects.slice(0, 8).join(", ")
      : "No structured projects available.";

    /* =====================================================
       INTERVIEW PREPARATION
    ===================================================== */

    if (
      q.includes("prepare") &&
      (
        q.includes("interview") ||
        q.includes("technical")
      )
    ) {
      return `For ${name}'s ${job} interview, prepare using the candidate information available in the profile.

Skills:
${skillText}

Projects:
${projectText}

Focus on:

• Explain your strongest project
• Explain your exact contribution
• Explain why you selected the technologies
• Explain the architecture and implementation
• Explain technical challenges and how you solved them
• Revise the important skills related to the job
• Prepare real examples for teamwork and problem solving

Most importantly, be able to explain the information written in your resume rather than only memorizing definitions.`;
    }

    /* =====================================================
       RESUME QUESTIONS
    ===================================================== */

    if (
      (
        q.includes("what questions") ||
        q.includes("which questions") ||
        q.includes("questions")
      ) &&
      (
        q.includes("resume") ||
        q.includes("cv")
      )
    ) {
      return `Based on ${name}'s available profile, the interviewer can ask questions such as:

1. Explain your most relevant project for the ${job} role.
2. What was your responsibility in that project?
3. Why did you choose the technologies you used?
4. What was the biggest technical challenge?
5. How did you solve that challenge?
6. How did you test your implementation?
7. What would you improve if you rebuilt the project?
8. Which skill listed in your resume are you strongest in?
9. Where have you used that skill?
10. How does your previous experience relate to this role?

Available skills:
${skillText}

Available projects:
${projectText}`;
    }

    /* =====================================================
       SKILLS
    ===================================================== */

    if (
      q.includes("skills") &&
      (
        q.includes("prepare") ||
        q.includes("revise") ||
        q.includes("technical") ||
        q.includes("study")
      )
    ) {
      return `For ${name}'s ${job} application, these skills are currently available in the candidate record:

${skillText}

For each important skill, prepare:

• Basic concepts
• Practical usage
• One project example
• Problems you solved
• Why you selected the technology
• Limitations
• Possible improvements

Focus first on the skills that directly match the job description.`;
    }

    /* =====================================================
       PROJECTS
    ===================================================== */

    if (
      q.includes("project") ||
      q.includes("projects")
    ) {
      return `The available project information for ${name} is:

${projectText}

For each relevant project, prepare this structure:

Problem → Your Role → Technology → Implementation → Challenge → Solution → Result → Improvement

The interviewer may ask follow-up questions based on any technology or decision mentioned in the project.`;
    }

    /* =====================================================
       EXPERIENCE
    ===================================================== */

    if (
      q.includes("experience") ||
      q.includes("work history") ||
      q.includes("previous work")
    ) {
      if (experience.length > 0) {
        return `Here is the available experience information for ${name}:

${experience.join("\n")}

For the ${job} interview, connect this experience to the responsibilities of the role and explain your actual contribution with specific examples.`;
      }

      if (resume) {
        return `The structured experience field is not available, but resume content is available for ${name}.

Relevant resume content:

${resume.slice(0, 3500)}

Use the actual experience described in the resume when answering interview questions.`;
      }

      return `No structured work-experience information is currently available for ${name}.`;
    }

    /* =====================================================
       SELF INTRODUCTION
    ===================================================== */

    if (
      q.includes("introduce myself") ||
      q.includes("self introduction") ||
      q.includes("tell me about myself") ||
      q.includes("tell me about yourself")
    ) {
      return `For ${name}'s ${job} interview, you can structure the introduction like this:

"Hello, I'm ${name}. I'm interested in the ${job} role. My background includes ${skills.length ? skills.slice(0, 5).join(", ") : "the skills listed in my application"}. I have worked on ${projects.length ? projects.slice(0, 2).join(" and ") : "projects listed in my resume"}. I'm interested in this opportunity because it allows me to apply my technical skills to real-world problems."

Keep the introduction around 60–90 seconds and use only information that is actually present in the candidate's background.`;
    }

    /* =====================================================
       TECHNICAL QUESTIONS
    ===================================================== */

    if (
      q.includes("technical") ||
      q.includes("coding") ||
      q.includes("programming") ||
      q.includes("developer")
    ) {
      return `For ${name}'s ${job} application, technical preparation should be connected to the candidate's actual skills and projects.

Skills currently available:
${skillText}

The interviewer may ask:

• How did you use this technology?
• Why did you choose it?
• What problem did it solve?
• What alternatives did you consider?
• What technical issue did you face?
• How did you debug it?
• How would you improve the implementation?

Prepare practical examples from the candidate's projects instead of only theoretical answers.`;
    }

    /* =====================================================
       NEXT RECRUITMENT STAGE
    ===================================================== */

    if (
      q.includes("next stage") ||
      q.includes("next step") ||
      q.includes("what happens next") ||
      q.includes("recruitment stage")
    ) {
      const normalizedStage =
        stage
          .replace(/_/g, " ")
          .trim()
          .toUpperCase();

      const nextStageMap = {
        APPLIED: "AI Screening",
        "AI SCREENING": "Shortlisted",
        SCREENING: "Shortlisted",
        SHORTLISTED: "Interview",
        INTERVIEW: "Offer",
        OFFER: "Hired",
        HIRED: "Completed",
      };

      const nextStage =
        nextStageMap[normalizedStage] ||
        "the next stage configured for this application";

      return `${name}'s current application stage is ${stage}.

The next stage is:
${nextStage}

Typical recruiting flow:

Applied
↓
AI Screening
↓
Shortlisted
↓
Interview
↓
Offer
↓
Hired

The exact next action should follow the candidate's actual application record.`;
    }

    /* =====================================================
       APPLICATION STATUS
    ===================================================== */

    if (
      q.includes("application status") ||
      q.includes("where is my application") ||
      q.includes("my application") ||
      q.includes("application")
    ) {
      return `${name}'s application is currently at the ${stage} stage for the ${job} position.

Current candidate:
${name}

Position:
${job}

Stage:
${stage}

${
  score !== null
    ? `AI Match Score: ${score}%`
    : "AI match score is not available in the current record."
}

The normal recruiting flow is:

Applied → AI Screening → Shortlisted → Interview → Offer → Hired`;
    }

    /* =====================================================
       RESCHEDULE
    ===================================================== */

    if (
      q.includes("reschedule") ||
      q.includes("change interview") ||
      q.includes("change the interview") ||
      q.includes("different interview time")
    ) {
      return `To reschedule ${name}'s interview:

1. Open the interview scheduling workflow.
2. Select ${name}.
3. Select the ${job} application.
4. Choose a new available date and time.
5. Confirm the duration.
6. Confirm the interview mode.
7. Save the updated interview record.

The Candidate Agent can explain the process, while the scheduling workflow should be used to actually save the new interview time.`;
    }

    /* =====================================================
       SCHEDULING
    ===================================================== */

    if (
      q.includes("schedule") ||
      q.includes("availability") ||
      q.includes("calendar") ||
      q.includes("interview time")
    ) {
      return `For ${name}'s ${job} application, interview scheduling should contain:

• Candidate
• Job
• Interview date
• Interview time
• Duration
• Interview mode

Select the candidate in the interview workflow and choose an available slot before saving the interview record.`;
    }

    /* =====================================================
       RESUME / CV
    ===================================================== */

    if (
      q.includes("resume") ||
      q.includes("cv") ||
      q.includes("profile")
    ) {
      return `I have the following candidate context available for ${name}:

Position:
${job}

Stage:
${stage}

Skills:
${skillText}

Projects:
${projectText}

${
  resume
    ? "Resume text is also available in the candidate record."
    : "Resume text is not exposed in the current candidate API response."
}

You can ask me something specific such as:

• What questions can be asked from my resume?
• What projects should I explain?
• Which skills should I revise?
• Give me a self-introduction based on my resume.`;
    }

    /* =====================================================
       OFFER
    ===================================================== */

    if (
      q.includes("offer") ||
      q.includes("salary") ||
      q.includes("package") ||
      q.includes("compensation")
    ) {
      return `Offer information should come from ${name}'s actual application or offer record.

Current stage:
${stage}

Position:
${job}

I should not invent salary, package or compensation information when those values are not present in the candidate data.`;
    }

    /* =====================================================
       DEFAULT
    ===================================================== */

    return `I understand your question:

"${question}"

For ${name}'s ${job} application, I can help with:

• Resume questions
• Interview preparation
• Technical preparation
• Project discussion
• Application status
• Recruitment stages
• Interview scheduling
• Candidate guidance

Current stage:
${stage}

Available skills:
${skillText}

Try asking a more specific question and I'll use the selected candidate's context.`;
  };

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const send = async (
    question = text.trim()
  ) => {
    const query = String(
      question || ""
    ).trim();

    if (!query || loading) {
      return;
    }

    /* Candidate is required for candidate-specific answers */

    if (!selectedCandidate) {
      setMessages((current) => [
        ...current,
        {
          role: "user",
          text: query,
        },
        {
          role: "assistant",
          text:
            "Please select a candidate first. I need the candidate context to answer this question specifically.",
        },
      ]);

      setText("");

      return;
    }

    /* Show user's question */

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: query,
      },
    ]);

    setText("");
    setLoading(true);

    try {
      /*
        IMPORTANT:
        Candidate context is now sent together with the question.
        Your backend can use this information with the LLM.
      */

      const result = await api.chat({
        message: query,

        candidate_id:
          getCandidateId(
            selectedCandidate
          ) || null,

        mode:
          mode
            .toLowerCase()
            .replace(/\s+/g, "_"),

        candidate_context:
          buildCandidateContext(
            selectedCandidate
          ),
      });

      console.log(
        "CANDIDATE AGENT CHAT RESPONSE:",
        result
      );

      const backendReply =
        result?.reply ??
        result?.message ??
        result?.response ??
        "";

      /*
        If the backend still sends the old generic response,
        don't display it. Generate a specific response.
      */

      const finalReply =
        isGenericBackendReply(
          backendReply
        )
          ? generateCandidateResponse(
              query,
              selectedCandidate
            )
          : backendReply;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: finalReply,
        },
      ]);
    } catch (error) {
      console.error(
        "CANDIDATE AGENT CHAT ERROR:",
        error
      );

      /*
        Backend failure fallback.
        The answer is still based on the selected candidate.
      */

      const fallback =
        generateCandidateResponse(
          query,
          selectedCandidate
        );

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: fallback,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="candidate-agent-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="candidate-agent-header">

        <div>
          <div className="candidate-agent-eyebrow">
            <Sparkles size={13} />
            AI RECRUITING WORKSPACE
          </div>

          <h1>
            Candidate Agent
          </h1>

          <p>
            Resume-aware AI assistance for candidate
            communication, interview preparation,
            application status and next-step guidance.
          </p>
        </div>

        

      </div>

      {/* =====================================================
          MAIN CONSOLE
      ===================================================== */}

      <div className="agent-console">

        {/* ===================================================
            LEFT PANEL
        =================================================== */}

        <aside className="agent-tools">

          <div className="tools-heading">

            <div>
              <span>
                AI ASSISTANT
              </span>

              <h3>
                Agent modes
              </h3>
            </div>

          </div>

          {/* MODES */}

          <div className="agent-mode-list">

            {agentModes.map(
              ({
                name,
                icon: Icon,
                description,
              }) => (
                <button
                  type="button"
                  key={name}
                  className={
                    mode === name
                      ? "agent-mode active"
                      : "agent-mode"
                  }
                  onClick={() =>
                    setMode(name)
                  }
                >

                  <div className="agent-mode-icon">
                    <Icon size={16} />
                  </div>

                  <div className="agent-mode-content">

                    <strong>
                      {name}
                    </strong>

                    <small>
                      {description}
                    </small>

                  </div>

                  <ChevronRight
                    size={14}
                    className="agent-mode-arrow"
                  />

                </button>
              )
            )}

          </div>

          {/* =================================================
              CANDIDATE CONTEXT
          ================================================= */}

          <div className="agent-context">

            <div className="context-heading">

              <div>
                <span>
                  DATABASE + RESUME CONTEXT
                </span>

                <label>
                  Candidate context
                </label>
              </div>

              <Users size={15} />

            </div>

            {/* SEARCH */}

            <div className="context-search">

              <Search size={13} />

              <input
                value={candidateSearch}
                onChange={(e) =>
                  setCandidateSearch(
                    e.target.value
                  )
                }
                placeholder="Search candidate, email, job..."
              />

            </div>

            {/* SELECT */}

            <select
              value={candidateId}
              onChange={(e) =>
                selectCandidate(
                  e.target.value
                )
              }
              disabled={
                loadingCandidates
              }
            >

              <option value="">
                {loadingCandidates
                  ? "Loading candidates..."
                  : candidates.length === 0
                    ? "No candidates available"
                    : "Choose candidate"}
              </option>

              {filteredCandidates.map(
                (candidate, index) => {

                  const id =
                    getCandidateId(
                      candidate
                    ) ||
                    `candidate-${index}`;

                  return (
                    <option
                      key={id}
                      value={id}
                    >
                      {getCandidateName(
                        candidate
                      )}
                      {" · "}
                      {getCandidateJob(
                        candidate
                      )}
                    </option>
                  );
                }
              )}

            </select>

            {/* COUNT */}

            {!loadingCandidates &&
              candidates.length > 0 && (
                <div className="candidate-count">

                  <Users size={11} />

                  {filteredCandidates.length}
                  {" of "}
                  {candidates.length}
                  {" candidates"}

                </div>
              )}

            {/* ERROR */}

            {candidateError && (
              <div className="candidate-error">

                <span>
                  {candidateError}
                </span>

                <button
                  type="button"
                  onClick={
                    loadCandidates
                  }
                  title="Retry"
                >
                  <RefreshCw
                    size={12}
                  />
                </button>

              </div>
            )}

            <small className="context-note">
              Candidate information is attached
              to the question so the AI can provide
              a specific response.
            </small>

          </div>

          {/* =================================================
              SELECTED CANDIDATE
          ================================================= */}

          {selectedCandidate && (
            <div className="context-candidate-card">

              <div className="context-avatar">
                {getInitials(
                  selectedCandidate
                )}
              </div>

              <div className="context-candidate-info">

                <strong>
                  {getCandidateName(
                    selectedCandidate
                  )}
                </strong>

                <span>
                  <BriefcaseBusiness
                    size={10}
                  />

                  {getCandidateJob(
                    selectedCandidate
                  )}
                </span>

                {getCandidateEmail(
                  selectedCandidate
                ) && (
                  <small>
                    <Mail size={10} />

                    {getCandidateEmail(
                      selectedCandidate
                    )}
                  </small>
                )}

              </div>

              {getCandidateScore(
                selectedCandidate
              ) !== null && (
                <div className="context-score">
                  {getCandidateScore(
                    selectedCandidate
                  )}
                  %
                </div>
              )}

            </div>
          )}

        </aside>

        {/* ===================================================
            CHAT
        =================================================== */}

        <section className="agent-chat">

          {/* CHAT HEADER */}

          <div className="chat-head">

            <div className="chat-agent-info">

              <div className="chat-bot-icon">
                <Bot size={18} />
              </div>

              <div>

                <strong>
                  {mode}
                </strong>

                <small>
                  Candidate-aware AI assistant
                </small>

              </div>

            </div>

            <div className="chat-live">
              <span />
              Live
            </div>

          </div>

          {/* SELECTED CONTEXT */}

          {selectedCandidate && (
            <div className="chat-context-bar">

              <div className="chat-context-avatar">
                {getInitials(
                  selectedCandidate
                )}
              </div>

              <div>

                <strong>
                  {getCandidateName(
                    selectedCandidate
                  )}
                </strong>

                <span>
                  {getCandidateJob(
                    selectedCandidate
                  )}
                </span>

              </div>

              <div className="chat-context-stage">
                {getCandidateStage(
                  selectedCandidate
                )}
              </div>

            </div>
          )}

          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="chat-messages">

            {messages.map(
              (message, index) => {

                const isAssistant =
                  message.role ===
                  "assistant";

                return (
                  <div
                    key={index}
                    className={
                      isAssistant
                        ? "chat-message assistant"
                        : "chat-message user"
                    }
                  >

                    <div className="message-label">

                      {isAssistant ? (
                        <>
                          <Bot size={11} />
                          AI Assistant
                        </>
                      ) : (
                        <>
                          <UserRound
                            size={11}
                          />
                          You
                        </>
                      )}

                    </div>

                    <div className="message-bubble">
                      {message.text}
                    </div>

                  </div>
                );
              }
            )}

            {/* THINKING */}

            {loading && (
              <div className="chat-message assistant">

                <div className="message-label">
                  <Bot size={11} />
                  AI Assistant
                </div>

                <div className="message-bubble thinking">

                  <Loader2
                    size={14}
                    className="spin"
                  />

                  Reading candidate context...

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              SUGGESTIONS
          ================================================= */}

          <div className="suggestions">

            <span>
              Try asking the selected candidate
            </span>

            <div className="suggestion-list">

              {[
                "What should I prepare for the interview?",
                "What questions can be asked from my resume?",
                "Which technical skills should I revise?",
                "Explain my next recruitment stage",
                "How can I reschedule my interview?",
              ].map(
                (question) => (
                  <button
                    type="button"
                    key={question}
                    onClick={() =>
                      send(question)
                    }
                    disabled={loading}
                  >
                    {question}
                  </button>
                )
              )}

            </div>

          </div>

          {/* =================================================
              INPUT
          ================================================= */}

          <div className="chat-input">

            <div className="chat-input-field">

              <MessageCircle
                size={15}
              />

              <input
                value={text}
                onChange={(e) =>
                  setText(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    send();
                  }

                }}
                placeholder={
                  selectedCandidate
                    ? `Ask about ${getCandidateName(
                        selectedCandidate
                      )}...`
                    : "Choose a candidate first..."
                }
                disabled={
                  !selectedCandidate ||
                  loading
                }
              />

            </div>

            <button
              type="button"
              className="send-button"
              onClick={() => send()}
              disabled={
                loading ||
                !selectedCandidate ||
                !text.trim()
              }
            >

              {loading ? (
                <Loader2
                  size={14}
                  className="spin"
                />
              ) : (
                <Send size={14} />
              )}

              {loading
                ? "Thinking"
                : "Send"}

            </button>

          </div>

        </section>

      </div>

    </div>
  );
}