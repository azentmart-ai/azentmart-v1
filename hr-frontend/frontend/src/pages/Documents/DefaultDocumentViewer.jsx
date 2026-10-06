import React from "react";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const DEFAULT_DOCUMENTS = [
  {
    id: "default-employee-001",
    title: "Employee Handbook",
    category: "Employee Records",
    owner: "HR Department",
    status: "Available",
    description:
      "General employee information, workplace guidance, company expectations and HR procedures.",
    content: `
AZENTMART
EMPLOYEE HANDBOOK

Document Type: Employee Records
Owner: HR Department
Status: Active

1. Welcome
Welcome to AzentMart. This handbook provides employees with important information about workplace practices, responsibilities and HR processes.

2. Working Hours
Employees are expected to follow their assigned working schedule and maintain regular attendance.

3. Workplace Conduct
Employees are expected to maintain professional behavior, respect colleagues and follow company policies.

4. Leave
Employees should submit leave requests through the HR system and obtain the required approval.

5. Confidentiality
Employees must protect company information, customer information and internal business records.

6. Employee Responsibilities
Employees are responsible for completing assigned work, maintaining accurate information and following applicable company policies.

This document is a reference copy maintained by the People Operations team.
    `,
  },

  {
    id: "default-employee-002",
    title: "Employee Information Form",
    category: "Employee Records",
    owner: "HR Department",
    status: "Available",
    description:
      "Standard employee information record containing personal and employment details.",
    content: `
AZENTMART
EMPLOYEE INFORMATION FORM

Employee Name: ______________________________
Employee ID: ________________________________
Email: ______________________________________
Phone: ______________________________________
Department: _________________________________
Designation: ________________________________
Reporting Manager: __________________________
Location: ___________________________________
Joining Date: ________________________________
Employment Type: ____________________________

Emergency Contact
Name: _______________________________________
Phone: ______________________________________
Relationship: ________________________________

This form is maintained by the People Operations team.
    `,
  },

  {
    id: "default-identity-001",
    title: "Identity Verification Checklist",
    category: "Identity & Compliance",
    owner: "HR Compliance",
    status: "Available",
    description:
      "Checklist for verifying employee identity and required compliance documents.",
    content: `
AZENTMART
IDENTITY VERIFICATION CHECKLIST

Employee Name: ______________________________
Employee ID: ________________________________

Required Documents

[ ] Government ID
[ ] Address Proof
[ ] Passport / Visa, if applicable
[ ] Photograph
[ ] Tax Identification
[ ] Other required identity documents

Verification Status: _________________________
Verified By: _________________________________
Verification Date: ___________________________

Notes:
________________________________________________
________________________________________________

This checklist is used by HR for employee verification.
    `,
  },

  {
    id: "default-identity-002",
    title: "Background Verification Policy",
    category: "Identity & Compliance",
    owner: "HR Compliance",
    status: "Available",
    description:
      "Reference policy describing standard background verification requirements.",
    content: `
AZENTMART
BACKGROUND VERIFICATION POLICY

Purpose:
To establish a consistent process for verifying information provided by employees and candidates.

Verification Areas:
1. Identity verification
2. Address verification
3. Education verification
4. Employment verification
5. Reference verification where applicable

HR must maintain verification records securely and restrict access to authorized personnel.

All verification activities must follow applicable company procedures and legal requirements.
    `,
  },

  {
    id: "default-employment-001",
    title: "Offer Letter",
    category: "Employment",
    owner: "Employee Record",
    status: "Available",
    description:
      "Formal employment offer containing position, compensation and joining information.",
    content: `
AZENTMART
EMPLOYMENT OFFER LETTER

Date: ______________________

Dear Employee,

We are pleased to offer you employment with AzentMart.

Position: _________________________________
Department: ______________________________
Reporting Manager: ________________________
Joining Date: _____________________________
Employment Type: _________________________
Location: _________________________________

Compensation:
The compensation package will be communicated as part of the employment terms.

You are expected to comply with company policies, confidentiality requirements and workplace standards.

Employee Acceptance

Employee Name: ____________________________
Signature: _________________________________
Date: _____________________________________

HR Representative: _________________________
    `,
  },

  {
    id: "default-employment-002",
    title: "Employment Agreement",
    category: "Employment",
    owner: "Employee Record",
    status: "Available",
    description:
      "Employment agreement defining employee responsibilities, terms and conditions.",
    content: `
AZENTMART
EMPLOYMENT AGREEMENT

Employee Name: _____________________________
Designation: _______________________________
Department: ________________________________

1. Employment
The employee agrees to perform assigned responsibilities professionally and diligently.

2. Working Conditions
The employee must follow assigned working hours, attendance requirements and company procedures.

3. Confidentiality
Company information must not be disclosed to unauthorized persons.

4. Company Policies
The employee agrees to comply with applicable company policies and procedures.

5. Separation
Employment separation will be handled according to company policy and applicable requirements.

Employee Signature: _________________________
Date: ______________________________________
    `,
  },

  {
    id: "default-employment-003",
    title: "Joining Letter",
    category: "Employment",
    owner: "Employee Record",
    status: "Available",
    description:
      "Employee joining confirmation containing date of joining and employment details.",
    content: `
AZENTMART
EMPLOYEE JOINING LETTER

Employee Name: _____________________________
Employee ID: _______________________________
Department: ________________________________
Designation: _______________________________
Joining Date: ______________________________
Reporting Manager: _________________________
Location: __________________________________

I confirm that I have joined AzentMart on the date mentioned above and agree to follow the applicable company policies and procedures.

Employee Signature: _________________________
HR Signature: _______________________________
Date: ______________________________________
    `,
  },

  {
    id: "default-employment-004",
    title: "Job Description",
    category: "Employment",
    owner: "Company",
    status: "Available",
    description:
      "Role responsibilities, required skills, reporting structure and position expectations.",
    content: `
AZENTMART
JOB DESCRIPTION

Position: _________________________________
Department: ______________________________
Reports To: _______________________________

Key Responsibilities:
• Complete assigned responsibilities.
• Collaborate with team members.
• Maintain quality and productivity standards.
• Follow company policies.
• Maintain required documentation.

Required Skills:
• Communication
• Teamwork
• Problem solving
• Role-specific technical skills
• Time management

Performance Expectations:
Performance will be reviewed according to company processes and role requirements.
    `,
  },

  {
    id: "default-payroll-001",
    title: "Salary Structure",
    category: "Payroll & Finance",
    owner: "Finance Department",
    status: "Available",
    description:
      "Standard reference structure for employee compensation and payroll components.",
    content: `
AZENTMART
SALARY STRUCTURE

Employee Name: _____________________________
Employee ID: _______________________________

Basic Salary: ______________________________
House Rent Allowance: ______________________
Special Allowance: _________________________
Other Allowances: __________________________

Gross Salary: ______________________________
Employee Contributions: ____________________
Tax Deduction: _____________________________
Other Deductions: __________________________

Net Salary: ________________________________

This is a reference payroll structure.
    `,
  },

  {
    id: "default-payroll-002",
    title: "Payroll Processing Guide",
    category: "Payroll & Finance",
    owner: "Finance Department",
    status: "Available",
    description:
      "Internal guide for monthly payroll processing, deductions and payroll review.",
    content: `
AZENTMART
PAYROLL PROCESSING GUIDE

Monthly payroll process:

1. Verify employee attendance.
2. Review approved leave.
3. Calculate payable working days.
4. Calculate gross salary.
5. Apply approved deductions.
6. Process statutory deductions where applicable.
7. Review payroll exceptions.
8. Approve payroll.
9. Generate payslips.
10. Complete payroll reporting.

Payroll information must be handled confidentially.
    `,
  },

  {
    id: "default-benefits-001",
    title: "Employee Benefits Guide",
    category: "Benefits",
    owner: "People Operations",
    status: "Available",
    description:
      "Overview of employee benefits and eligibility information.",
    content: `
AZENTMART
EMPLOYEE BENEFITS GUIDE

Available benefits may include:

• Health insurance
• Employee wellness programs
• Paid leave
• Learning and development
• Employee assistance
• Recognition programs
• Flexible work options where applicable

Eligibility and benefit coverage depend on employee role, employment type and company policy.
    `,
  },

  {
    id: "default-benefits-002",
    title: "Insurance Enrollment Form",
    category: "Benefits",
    owner: "HR Department",
    status: "Available",
    description:
      "Reference form for employee insurance enrollment and dependent information.",
    content: `
AZENTMART
INSURANCE ENROLLMENT FORM

Employee Name: _____________________________
Employee ID: _______________________________
Department: ________________________________

Primary Member:
Name: ______________________________________
Date of Birth: ______________________________

Dependents:
1. _________________________________________
2. _________________________________________
3. _________________________________________

Coverage Requested: _________________________

Employee Signature: _________________________
Date: ______________________________________
    `,
  },

  {
    id: "default-leave-001",
    title: "Leave Policy",
    category: "Leave & Attendance",
    owner: "HR Department",
    status: "Available",
    description:
      "Reference policy covering leave types, approval and attendance expectations.",
    content: `
AZENTMART
LEAVE POLICY

Employees may request applicable leave through the HR system.

Leave requests should include:
• Leave type
• Start date
• End date
• Reason where required

Employees should obtain approval before taking planned leave unless an emergency applies.

HR maintains leave records and balances.
    `,
  },

  {
    id: "default-leave-002",
    title: "Attendance Policy",
    category: "Leave & Attendance",
    owner: "HR Department",
    status: "Available",
    description:
      "Reference policy for attendance, working hours, late arrivals and regularization.",
    content: `
AZENTMART
ATTENDANCE POLICY

Employees are expected to maintain regular attendance and follow assigned schedules.

Attendance records may include:
• Check-in
• Check-out
• Break duration
• Working hours
• Overtime
• Late arrival
• Attendance exceptions

Attendance corrections must be submitted through the regularization process.
    `,
  },

  {
    id: "default-performance-001",
    title: "Performance Review Framework",
    category: "Performance",
    owner: "People Operations",
    status: "Available",
    description:
      "Framework for employee performance reviews, goals and development discussions.",
    content: `
AZENTMART
PERFORMANCE REVIEW FRAMEWORK

Review Areas:

1. Goal achievement
2. Quality of work
3. Productivity
4. Collaboration
5. Communication
6. Learning and development
7. Leadership where applicable

Managers should provide clear feedback and identify development opportunities.

Review Period: ______________________________
Manager: ___________________________________
Employee: __________________________________
    `,
  },

  {
    id: "default-training-001",
    title: "Training Catalogue",
    category: "Training & Development",
    owner: "Learning & Development",
    status: "Available",
    description:
      "Catalogue of standard employee learning and development programs.",
    content: `
AZENTMART
TRAINING CATALOGUE

Core Programs:

• Company Orientation
• Information Security
• Workplace Conduct
• HR Systems Introduction
• Communication Skills
• Leadership Development
• Technical Skills
• Manager Training

Employees may be assigned training based on role and organizational requirements.
    `,
  },

  {
    id: "default-training-002",
    title: "Security Awareness Training",
    category: "Training & Development",
    owner: "IT & Security",
    status: "Available",
    description:
      "Reference training material covering basic information security practices.",
    content: `
AZENTMART
SECURITY AWARENESS TRAINING

Employees should:

• Protect passwords and credentials.
• Avoid sharing confidential information.
• Verify suspicious emails.
• Lock devices when unattended.
• Use approved systems.
• Report suspected security incidents.
• Follow company data protection procedures.

Completion Status: __________________________
Employee: __________________________________
Date: ______________________________________
    `,
  },

  {
    id: "default-policy-001",
    title: "Code of Conduct",
    category: "Policies",
    owner: "People Operations",
    status: "Available",
    description:
      "Company standards for professional behavior, integrity and workplace conduct.",
    content: `
AZENTMART
CODE OF CONDUCT

Employees are expected to:

• Act honestly and professionally.
• Treat colleagues with respect.
• Protect company information.
• Avoid conflicts of interest.
• Follow applicable policies.
• Maintain a safe and inclusive workplace.
• Report concerns through appropriate channels.

Employees are responsible for understanding and following the Code of Conduct.
    `,
  },

  {
    id: "default-policy-002",
    title: "Information Security Policy",
    category: "Policies",
    owner: "IT & Security",
    status: "Available",
    description:
      "Policy covering secure use of company systems, data and technology.",
    content: `
AZENTMART
INFORMATION SECURITY POLICY

Purpose:
Protect company systems, data and information from unauthorized access or misuse.

Employees must:
• Use approved systems.
• Protect credentials.
• Report security incidents.
• Avoid unauthorized software.
• Handle sensitive information appropriately.
• Follow access-control requirements.

Security violations may be reviewed according to company procedures.
    `,
  },

  {
    id: "default-recruitment-001",
    title: "Recruitment Process Guide",
    category: "Recruitment",
    owner: "Talent Acquisition",
    status: "Available",
    description:
      "Standard recruitment workflow covering job creation, screening and selection.",
    content: `
AZENTMART
RECRUITMENT PROCESS GUIDE

Recruitment stages:

1. Workforce requirement
2. Job creation
3. Candidate sourcing
4. Resume screening
5. Candidate shortlisting
6. Interview scheduling
7. Interview feedback
8. Selection
9. Offer
10. Onboarding

Recruitment records should be maintained securely and consistently.
    `,
  },

  {
    id: "default-company-001",
    title: "Company Profile",
    category: "Company Documents",
    owner: "Administration",
    status: "Available",
    description:
      "General company information and organizational reference document.",
    content: `
AZENTMART
COMPANY PROFILE

Company Name: AzentMart

People Operations Platform:
A centralized workspace for employee management, onboarding, attendance, leave, documents, payroll, benefits and HR support.

Departments may include:
• Human Resources
• Engineering
• Finance
• Sales
• Operations
• Marketing
• Administration

This document is maintained as a general company reference.
    `,
  },

  {
    id: "default-certificate-001",
    title: "Employment Certificate Template",
    category: "Certificates",
    owner: "HR Department",
    status: "Available",
    description:
      "Reference template for employee employment confirmation certificates.",
    content: `
AZENTMART
EMPLOYMENT CERTIFICATE

This is to certify that

Employee Name: ______________________________
Employee ID: ________________________________
Designation: _______________________________
Department: ________________________________

was employed with AzentMart from

Start Date: _________________________________
End Date: ___________________________________

Authorized HR Representative: _______________
Date: ______________________________________
    `,
  },

  {
    id: "default-other-001",
    title: "HR Request Form",
    category: "Other",
    owner: "People Operations",
    status: "Available",
    description:
      "General-purpose HR request form for employee and manager requests.",
    content: `
AZENTMART
HR REQUEST FORM

Requester Name: _____________________________
Employee ID: _______________________________
Department: ________________________________

Request Type: _______________________________

Request Description:
________________________________________________
________________________________________________
________________________________________________

Priority:
[ ] Low
[ ] Medium
[ ] High
[ ] Urgent

Requested Date: ______________________________

HR Notes:
________________________________________________

HR Representative: __________________________
    `,
  },
];

function downloadTextFile(document) {
  const content = `${document.title}

AzentMart People Operations
Category: ${document.category}
Owner: ${document.owner}
Status: ${document.status}

${document.description}

----------------------------------------
DOCUMENT CONTENT
----------------------------------------

${document.content}

----------------------------------------
Generated from AzentMart HR document library.
`;

  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");

  anchor.href = url;
  anchor.download = `${document.title.replace(/[^a-z0-9]+/gi, "_")}.txt`;

  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export default function DefaultDocumentViewer() {
  const { id } = useParams();

  const documentData = DEFAULT_DOCUMENTS.find(
    (item) => item.id === id
  );

  if (!documentData) {
    return (
      <div className="page">
        <Link to="/documents" className="btn">
          <ArrowLeft size={15} />
          Documents
        </Link>

        <div className="error-box mt-4">
          Document not found.
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      <Link
        to={`/documents/category/${encodeURIComponent(
          documentData.category
        )}`}
        className="btn"
      >
        <ArrowLeft size={15} />
        {documentData.category}
      </Link>

      <div className="card mt-4 overflow-hidden">

        <div className="border-b border-slate-100 bg-slate-50/70 p-6">

          <div className="flex items-start gap-4">

            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={23} />
            </span>

            <div className="flex-1">

              <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-blue-600">
                {documentData.category}
              </span>

              <h1 className="mt-1 text-xl font-extrabold">
                {documentData.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {documentData.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="badge success">
                  Available
                </span>

                <span className="badge">
                  {documentData.owner}
                </span>

                <span className="badge">
                  Reference document
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="p-6">

          <h2 className="mb-4 text-sm font-extrabold">
            Document information
          </h2>

          <div className="grid gap-3 md:grid-cols-2">

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Document name
              </p>

              <p className="mt-2 text-xs font-bold">
                {documentData.title}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Category
              </p>

              <p className="mt-2 text-xs font-bold">
                {documentData.category}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Owner
              </p>

              <p className="mt-2 text-xs font-bold">
                {documentData.owner}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Status
              </p>

              <p className="mt-2 text-xs font-bold">
                {documentData.status}
              </p>
            </div>

          </div>

          <div className="mt-4 rounded-xl border border-slate-100 p-5">

            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {documentData.description}
            </p>

          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-5">

            <div className="flex items-center gap-2">
              <FileText
                size={16}
                className="text-blue-600"
              />

              <h3 className="text-sm font-extrabold">
                Document content
              </h3>
            </div>

            <pre className="mt-4 max-h-[500px] overflow-auto whitespace-pre-wrap rounded-xl bg-white p-5 text-[11px] leading-6 text-slate-600">
              {documentData.content.trim()}
            </pre>

            <div className="mt-4">

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  downloadTextFile(documentData)
                }
              >
                <Download size={14} />
                Download document
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}