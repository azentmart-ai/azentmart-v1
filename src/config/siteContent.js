import {
  FaChartLine,
  FaCogs,
  FaHeadset,
  FaRobot,
  FaShieldAlt,
  FaUsers,
  FaBolt,
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaIndustry,
  FaPlane,
  FaGraduationCap,
  FaHospital,
  FaBuilding,
  FaShoppingCart,
  FaTruck,
  FaLaptopCode,
  FaBullhorn,
  FaHandshake,
  FaSearch,
  FaFlask,
  FaRocket,
  FaTasks,
  FaBookOpen,
  FaLightbulb,
  FaGlobe,
} from "react-icons/fa";

export const slugify = (value) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const industries = [
  { id: "healthcare", name: "Healthcare", icon: <FaHospital />, focus: "patient communication, administration and operational coordination", body: "AI-supported workflows can help healthcare teams handle repetitive communication and administrative work while keeping people involved for decisions that require professional judgment." },
  { id: "retail-and-e-commerce", name: "Retail & E-commerce", icon: <FaShoppingCart />, focus: "customer engagement, lead capture and commerce operations", body: "Connect AI workflows to customer conversations, product enquiries, lead follow-up and repeatable commerce processes across digital channels." },
  { id: "manufacturing", name: "Manufacturing", icon: <FaIndustry />, focus: "procurement, operations, inventory and coordination", body: "Support manufacturing teams with structured workflows for information handling, procurement coordination, operational updates and internal requests." },
  { id: "real-estate", name: "Real Estate", icon: <FaBuilding />, focus: "lead response, qualification and follow-up", body: "Help property teams respond to enquiries faster, qualify prospects, coordinate follow-ups and keep customer communication consistent." },
  { id: "hospitality-and-food", name: "Hospitality & Food", icon: <FaBuilding />, focus: "guest communication, bookings and service workflows", body: "Automate repeatable guest and customer interactions while giving teams a clear path to handle exceptions and high-value conversations." },
  { id: "education", name: "Education", icon: <FaGraduationCap />, focus: "admissions, support and administration", body: "Use AI-assisted workflows for enquiries, admissions coordination, student support and administrative tasks while keeping staff in control." },
  { id: "finance-and-bfsi", name: "Finance & BFSI", icon: <FaFileInvoiceDollar />, focus: "service, documentation and operational workflows", body: "Structure information-heavy workflows around finance and service operations with clear approval points, access controls and human oversight." },
  { id: "legal", name: "Legal", icon: <FaBalanceScale />, focus: "research, documents and compliance support", body: "AI can assist with repeatable legal information workflows, document handling and research preparation while qualified professionals retain decision authority." },
  { id: "it-and-saas", name: "IT & SaaS", icon: <FaLaptopCode />, focus: "support, sales and technology operations", body: "Connect AI workflows to customer support, sales operations, internal requests and recurring technology-business processes." },
  { id: "logistics-and-supply-chain", name: "Logistics & Supply Chain", icon: <FaTruck />, focus: "procurement, inventory and customer coordination", body: "Automate information flow across procurement, inventory, shipment updates and customer communication so teams can focus on exceptions." },
  { id: "travel-and-tourism", name: "Travel & Tourism", icon: <FaPlane />, focus: "traveller support, enquiries and coordination", body: "Support travel teams with customer conversations, itinerary-related requests and operational coordination across repeatable workflows." },
];

export const businessFunctions = [
  { id: "sales", name: "Sales", icon: <FaChartLine />, focus: "lead generation, qualification and follow-up", body: "AI sales workflows can research prospects, qualify inbound interest, maintain follow-up and prepare information for sales teams." },
  { id: "marketing", name: "Marketing", icon: <FaBullhorn />, focus: "content, campaigns, engagement and analytics", body: "Automate repeatable marketing work such as content preparation, social engagement, campaign support and reporting while keeping brand control with people." },
  { id: "customer-support", name: "Customer Support", icon: <FaHeadset />, focus: "customer conversations, knowledge and escalation", body: "Give customers faster responses across supported channels, retrieve relevant information and route complex cases to human teams." },
  { id: "hr-and-recruitment", name: "HR & Recruitment", icon: <FaUsers />, focus: "screening, scheduling, onboarding and employee support", body: "Support recruiting and HR operations with repeatable workflows for candidate coordination, interview scheduling, onboarding and internal requests." },
  { id: "finance", name: "Finance", icon: <FaFileInvoiceDollar />, focus: "invoices, payments, expenses and reporting", body: "Organize finance workflows around document processing, payment follow-up, expense handling and reporting preparation with approval controls." },
  { id: "legal", name: "Legal", icon: <FaBalanceScale />, focus: "document, research and compliance support", body: "Use AI to assist repeatable legal information workflows while keeping review and final decisions with qualified professionals." },
  { id: "operations", name: "Operations", icon: <FaCogs />, focus: "coordination, process automation and internal workflows", body: "Connect repetitive operational requests to AI workflows that move information, trigger actions and escalate exceptions to the right people." },
];

export const platformPages = {
  "ai-workforce": { kicker: "PLATFORM", title: "AI Workforce", icon: <FaRobot />, intro: "A single platform concept for discovering, deploying and managing specialized AI employees.", body: "AzentMart AI is designed around specialized AI agents and workflows that can support different business roles. Start with a focused use case, connect the required systems and expand the workforce as the business needs grow.", cards: ["AI employee catalog vision", "Workflow-based automation", "Human oversight"] },
  "how-it-works": { kicker: "PLATFORM", title: "How It Works", icon: <FaTasks />, intro: "Discover, test, deploy and manage AI-powered workflows.", body: "The platform journey starts with a business workflow, validates the use case, connects the required tools and then provides a way to review and improve the workflow over time.", cards: ["Discover", "Test", "Deploy", "Manage"] },
  marketplace: { kicker: "PLATFORM", title: "Agent Marketplace", icon: <FaGlobe />, intro: "Explore ready-to-use AzentMart AI agent applications.", body: "The marketplace brings the current agent applications into one place so teams can understand what each agent is designed to do and open the relevant application.", cards: ["Instagram Agent", "WhatsApp Agent", "Voice Agent", "Interview Agent"] },
  "trust-and-control": { kicker: "PLATFORM", title: "Trust & Control", icon: <FaShieldAlt />, intro: "Human oversight and controlled workflows remain part of the design.", body: "AI workflows should have clear boundaries. AzentMart's platform direction emphasizes human review, controlled integrations, access boundaries and escalation paths where judgment or authorization is required.", cards: ["Human-in-the-loop", "Integration boundaries", "Access control"] },
};

export const solutionPages = {
  "industry-solutions": { kicker: "SOLUTIONS", title: "Industry Solutions", icon: <FaIndustry />, intro: "Explore AI workflows by industry domain.", body: "Different industries have different workflows, customers and operational constraints. Explore the industry pages to see how AI-assisted workflows can be structured around those needs.", cards: industries.map((item) => item.name) },
  "automate-repetitive-work": { kicker: "SOLUTIONS", title: "Automate Repetitive Work", icon: <FaBolt />, intro: "Move recurring tasks from manual queues into structured workflows.", body: "Identify repeatable work, define the inputs and outputs, connect the right tools and create a workflow with clear human escalation points.", cards: ["Routine requests", "Data movement", "Follow-ups", "Escalations"] },
  "customer-and-revenue": { kicker: "SOLUTIONS", title: "Customer & Revenue", icon: <FaHandshake />, intro: "Support customer conversations and revenue workflows across the funnel.", body: "AI workflows can assist with lead response, qualification, customer support and follow-up while sales and service teams retain control of important conversations.", cards: ["Lead response", "Qualification", "Support", "Follow-up"] },
  operations: { kicker: "SOLUTIONS", title: "Operations", icon: <FaCogs />, intro: "Connect AI employees to recurring business operations.", body: "Use structured workflows to coordinate requests, move information between systems and surface exceptions to people who need to act.", cards: ["Process coordination", "Internal requests", "Data handoffs"] },
  "human-and-ai": { kicker: "SOLUTIONS", title: "Human + AI", icon: <FaUsers />, intro: "Use AI for repeatable work and people for judgment.", body: "A practical AI workforce should make escalation explicit. Work can be automated where rules and context are clear, while people review, approve or take over when required.", cards: ["AI execution", "Human review", "Escalation", "Approval"] },
  "custom-workflows": { kicker: "SOLUTIONS", title: "Custom Workflows", icon: <FaCogs />, intro: "Design workflows around your business instead of forcing the business into a fixed process.", body: "Start from a specific operational problem and define the systems, actions, approvals and outcomes needed to make the workflow useful for your team.", cards: ["Workflow discovery", "System connections", "Actions", "Measurement"] },
};

export const employeePages = {
  ...Object.fromEntries(businessFunctions.map((item) => [item.id, { kicker: "AI EMPLOYEES", title: `AI ${item.name} Employee`, icon: item.icon, intro: `A specialized AI employee concept for ${item.name.toLowerCase()} workflows.`, body: item.body, cards: [item.focus, "Workflow automation", "Human escalation"] }])),
  "10k-plus": { kicker: "AI EMPLOYEES", title: "10,000+ AI Employees", icon: <FaRobot />, intro: "A long-term catalog vision across business functions and industry domains.", body: "The AzentMart AI workforce concept is built around a broad catalog of specialized AI employees. The current site presents 10,000+ as a catalog vision rather than a claim that every employee is already available today.", cards: ["Business functions", "Industry domains", "Custom workflows"] },
};

export const whyPages = {
  "save-time": { kicker: "WHY AZENTMART", title: "Save Time", icon: <FaBolt />, intro: "Automate repetitive and manual work.", body: "Use AI workflows for repeatable tasks so teams can spend more time on work that requires context, judgment and customer interaction.", cards: ["Less manual effort", "Faster workflows", "Human focus"] },
  "reduce-costs": { kicker: "WHY AZENTMART", title: "Reduce Costs", icon: <FaChartLine />, intro: "Do more with fewer repetitive operational steps.", body: "Automation can reduce the amount of manual coordination required for recurring processes and help teams scale workflows without adding the same amount of administrative effort.", cards: ["Recurring work", "Operational efficiency", "Scale"] },
  "increase-revenue": { kicker: "WHY AZENTMART", title: "Increase Revenue", icon: <FaChartLine />, intro: "Support faster lead response and consistent follow-up.", body: "Revenue workflows can use AI to respond, qualify, research and follow up consistently, while people remain responsible for important commercial decisions.", cards: ["Lead response", "Qualification", "Follow-up"] },
  "make-better-decisions": { kicker: "WHY AZENTMART", title: "Make Better Decisions", icon: <FaLightbulb />, intro: "Bring relevant information into the workflow.", body: "AI can help organize information, summarize context and surface patterns so teams can make decisions with better access to the information they already have.", cards: ["Context", "Insights", "Human judgment"] },
  "scale-effortlessly": { kicker: "WHY AZENTMART", title: "Scale Effortlessly", icon: <FaRocket />, intro: "Start focused and expand across functions.", body: "A workflow-first approach lets a business begin with a practical use case and add additional AI employees as new needs are identified.", cards: ["Start focused", "Expand functions", "Connected workflows"] },
};

export const processPages = {
  discover: { kicker: "HOW IT WORKS", title: "Discover", icon: <FaSearch />, intro: "Identify the workflow where AI can create useful impact.", body: "Start by mapping the current process, inputs, decisions, systems and outcomes. The goal is to choose a workflow with a clear problem and a measurable result.", cards: ["Current workflow", "Inputs & outputs", "Success criteria"] },
  test: { kicker: "HOW IT WORKS", title: "Test", icon: <FaFlask />, intro: "Validate the workflow before expanding it.", body: "Test the workflow with realistic inputs, review outputs and identify the points where human review or additional controls are required.", cards: ["Realistic inputs", "Output review", "Escalation"] },
  deploy: { kicker: "HOW IT WORKS", title: "Deploy", icon: <FaRocket />, intro: "Connect the workflow to the tools and people it needs.", body: "Once validated, connect the required systems, define permissions and put the workflow into the environment where the team will use it.", cards: ["Integrations", "Permissions", "Go live"] },
  manage: { kicker: "HOW IT WORKS", title: "Manage", icon: <FaTasks />, intro: "Review outcomes and improve the workflow over time.", body: "Monitor how the workflow performs, review exceptions and refine the process as business requirements change.", cards: ["Performance", "Exceptions", "Continuous improvement"] },
};

export const resources = {
  learning: { kicker: "RESOURCES", title: "Learning", icon: <FaBookOpen />, intro: "A future home for practical AI workforce learning content.", body: "The Learning section is ready for tutorials, guides, playbooks, implementation notes and other educational resources. Content can be added later without changing the navigation structure.", cards: ["AI fundamentals", "Workflow design", "Implementation guides", "Best practices"] },
};
