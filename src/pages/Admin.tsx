import { useState, useRef, useEffect } from "react";
import {
  Building2, Upload, Sparkles, GitBranch, ExternalLink, Loader2, Check,
  ChevronDown, FileText, MessageSquare, BarChart3, Zap, Shield, Users,
  TrendingUp, AlertTriangle, Download
} from "lucide-react";
import { generateDeckHTML } from "@/lib/generateDeckHTML";

/* ─── CONSTANTS ─── */
const INDUSTRIES = [
  "FMCG / Consumer Goods",
  "Financial Services / Banking",
  "Insurance",
  "Telecommunications",
  "Retail / E-commerce",
  "Healthcare / Pharma",
  "Automotive",
  "Technology / SaaS",
  "Media / Entertainment",
  "Education",
  "Government / Public Sector",
  "Hospitality / Travel",
  "Energy / Utilities",
  "Agriculture",
  "Other",
];

const STEPS = ["Input", "Generate", "Preview", "Export"];

/* ─── TYPES ─── */
interface UseCaseItem { icon: string; title: string; desc: string; tags: string[] }
interface FlowStep { emoji: string; label: string; desc: string; bg: "navy" | "whatsapp" | "olive" | "gold" | "coral" | "light" }
interface FlowBranch { label: string; color: "olive" | "gold" | "coral" }
interface CompetitorCard { name: string; stat: string; desc: string; badge: string }
interface KpiCard { label: string; value: string; delta: string; positive: boolean }
interface IssueRow { issue: string; mentions: number; severity: "High" | "Medium" | "Low" }
interface ChatMsg { from: "bot" | "user"; text: string }

interface GeneratedDeck {
  intro: { headline: string; subtitle: string };
  feedbackUseCases: UseCaseItem[];
  researchUseCases: UseCaseItem[];
  flowSteps: FlowStep[];
  flowBranches: FlowBranch[];
  flowOutputs: { label: string; desc: string; color: string }[];
  chatMessages: ChatMsg[];
  competitors: CompetitorCard[];
  competitorCta: string;
  kpis: KpiCard[];
  npsData: number[];
  sentiment: { positive: number; neutral: number; negative: number };
  issues: IssueRow[];
  sampleQuestions: string[];
  branchName: string;
}

interface FormState {
  companyName: string;
  brandName: string;
  industry: string;
  context: string;
  competitors: string;
  brandColor: string;
}

/* ─── INDUSTRY TEMPLATES ─── */
const TEMPLATES: Record<string, {
  feedback: UseCaseItem[];
  research: UseCaseItem[];
  flowTrigger: string;
  chatMessages: ChatMsg[];
  kpis: KpiCard[];
  issues: IssueRow[];
  sampleQuestions: string[];
}> = {
  "Financial Services / Banking": {
    feedback: [
      { icon: "🏦", title: "Post-Onboarding Check-in", desc: "WhatsApp pulse after sign-up. Track satisfaction, friction, and early churn signals from new customers.", tags: ["Onboarding", "NPS", "Churn"] },
      { icon: "🏪", title: "Branch Experience Survey", desc: "Survey triggered after in-branch visits. Measure wait time satisfaction and staff experience.", tags: ["Branch", "CSAT", "Ops"] },
      { icon: "📱", title: "App & Digital Experience", desc: "Proactive check-in after digital transactions. Surface UX issues before they hit app store reviews.", tags: ["Digital", "UX", "Retention"] },
      { icon: "🚪", title: "Competitor Switch Intercept", desc: "AI depth-probe when a customer signals intent to leave. Understand what competitors offer.", tags: ["Churn", "Win-back", "Intel"] },
    ],
    research: [
      { icon: "💳", title: "Product Concept Testing", desc: "Test new product concepts with segmented panels before launch. Validate pricing, messaging, features.", tags: ["Product", "Concept", "Validation"] },
      { icon: "🏬", title: "Partner Channel Experience", desc: "Survey customers after interactions at retail partners. Optimise experiences driving adoption.", tags: ["Partners", "Retail", "Ops"] },
      { icon: "📈", title: "Brand Perception Tracker", desc: "Quarterly brand health pulse across demographics. Track awareness, trust, and consideration vs competitors.", tags: ["Brand", "Tracking", "Quarterly"] },
      { icon: "🎯", title: "Segment Deep-Dives", desc: "AI-moderated interviews with specific segments. Rich qualitative insights without traditional focus group costs.", tags: ["Qualitative", "Segments", "AI"] },
    ],
    flowTrigger: "Customer signs up, visits branch, or completes first transaction",
    chatMessages: [
      { from: "bot", text: "Hi! 👋 Thanks for joining us 5 days ago. How's it going so far?" },
      { from: "user", text: "Pretty good, but the app is a bit slow" },
      { from: "bot", text: "Thanks for sharing that. On a scale of 0-10, how likely are you to recommend us?" },
      { from: "user", text: "7" },
      { from: "bot", text: "Great — what's one thing we could do better?" },
      { from: "user", text: "Fix the scheduled payments feature" },
    ],
    kpis: [
      { label: "Response Rate", value: "32%", delta: "+8% vs email", positive: true },
      { label: "NPS Score", value: "47", delta: "+12 vs Q4", positive: true },
      { label: "Avg. Response Time", value: "1.4 hrs", delta: "from 3–5 days", positive: true },
      { label: "Active Surveys", value: "3", delta: "247 responses today", positive: true },
    ],
    issues: [
      { issue: "App loading speed", mentions: 89, severity: "High" },
      { issue: "Branch wait time", mentions: 64, severity: "Medium" },
      { issue: "Fee transparency", mentions: 41, severity: "Medium" },
      { issue: "Scheduled payments missing", mentions: 37, severity: "High" },
    ],
    sampleQuestions: ["How easy was it to sign up?", "Would you recommend us?", "What would you improve about the app?", "How was your branch experience?"],
  },
  "FMCG / Consumer Goods": {
    feedback: [
      { icon: "📊", title: "Post-Purchase Surveys", desc: "WhatsApp surveys triggered after purchase to track satisfaction, NPS, and churn drivers at scale.", tags: ["NPS", "Churn", "Scale"] },
      { icon: "📦", title: "In-Store & On-Pack QR", desc: "QR codes on packaging linking to WhatsApp conversations for real-time product feedback.", tags: ["Retail", "QR", "Real-Time"] },
      { icon: "🔔", title: "Always-On Feedback Channel", desc: "Persistent WhatsApp channel to surface product issues early — defects, quality, stock-outs.", tags: ["Early Warning", "QA"] },
      { icon: "🧪", title: "Pre-Launch Concept Testing", desc: "Targeted pulses to test consumer reactions to new products, packaging, or messaging.", tags: ["Innovation", "Testing"] },
    ],
    research: [
      { icon: "📈", title: "Tracker Augmentation", desc: "Run parts of brand trackers via WhatsApp to dramatically reduce cost and turnaround.", tags: ["Trackers", "Cost Savings"] },
      { icon: "🌍", title: "New Market Studies", desc: "Research consumer behaviour in new markets in local languages where panels struggle.", tags: ["Market Entry", "Multilingual"] },
      { icon: "📱", title: "Product Testing via QR", desc: "QR follow-ups after trial or delivery. Capture experience at the moment of use.", tags: ["Product Testing", "QR"] },
      { icon: "⚡", title: "WhatsApp Screeners", desc: "Faster incidence and recruitment via WhatsApp screeners. Cut recruitment time by 80%.", tags: ["Recruitment", "Speed"] },
    ],
    flowTrigger: "Customer purchases product, scans QR on packaging, or visits store",
    chatMessages: [
      { from: "bot", text: "Hey! 👋 Thanks for trying our product. We'd love your feedback — takes 2 mins." },
      { from: "user", text: "Sure, happy to help" },
      { from: "bot", text: "How would you rate the overall quality? (1-10)" },
      { from: "user", text: "8 - really liked the flavour but packaging was hard to open" },
      { from: "bot", text: "Great score! Tell me more about the packaging issue — what made it difficult?" },
      { from: "user", text: "The seal was too tight, had to use scissors" },
    ],
    kpis: [
      { label: "Response Rate", value: "45%", delta: "+22% vs email", positive: true },
      { label: "NPS Score", value: "52", delta: "+8 vs last quarter", positive: true },
      { label: "Avg. Response Time", value: "47 min", delta: "from 3–5 days", positive: true },
      { label: "Active Studies", value: "4", delta: "1,203 responses today", positive: true },
    ],
    issues: [
      { issue: "Packaging difficulty", mentions: 112, severity: "High" },
      { issue: "Stock availability", mentions: 78, severity: "Medium" },
      { issue: "Flavour inconsistency", mentions: 54, severity: "Medium" },
      { issue: "Price perception", mentions: 43, severity: "High" },
    ],
    sampleQuestions: ["How did you find the product quality?", "Where did you purchase it?", "Would you buy it again?", "How does it compare to alternatives?"],
  },
  "Telecommunications": {
    feedback: [
      { icon: "📶", title: "Network Experience Feedback", desc: "WhatsApp surveys triggered by network events — outages, plan changes, roaming — for real-time CX.", tags: ["Network", "CX", "Events"] },
      { icon: "📱", title: "App & USSD Satisfaction", desc: "In-moment feedback on self-service digital channels and app feature usage.", tags: ["Digital", "CX", "App"] },
      { icon: "🔔", title: "Churn Early Warning", desc: "Detect dissatisfaction signals early via always-on WhatsApp to trigger save-desk interventions.", tags: ["Churn", "Prevention", "Save"] },
      { icon: "🏪", title: "Retail & Call Centre Audit", desc: "Post-interaction feedback across retail stores and contact centres.", tags: ["Touchpoint", "CX", "Ops"] },
    ],
    research: [
      { icon: "📈", title: "Brand Health Tracker", desc: "Run brand consideration and NPS trackers via WhatsApp at 80% lower cost.", tags: ["Tracker", "Brand", "NPS"] },
      { icon: "💰", title: "Price Sensitivity Research", desc: "Understand data bundle and plan pricing elasticity across segments.", tags: ["Pricing", "Segments"] },
      { icon: "🌍", title: "Rural Market Research", desc: "Reach prepaid and rural subscribers in local languages where online panels can't.", tags: ["Rural", "Inclusion", "Multilingual"] },
      { icon: "⚡", title: "New Service Concept Test", desc: "Test interest and willingness to pay for new services before capital investment.", tags: ["Innovation", "5G", "Testing"] },
    ],
    flowTrigger: "Customer activates SIM, recharges, or contacts support",
    chatMessages: [
      { from: "bot", text: "Hi! 👋 We noticed you recently changed your data plan. How's it working for you?" },
      { from: "user", text: "The speed is fine but I keep running out of data" },
      { from: "bot", text: "Got it. On a scale of 0-10, how satisfied are you with your current plan value?" },
      { from: "user", text: "5 - it's expensive for what you get" },
      { from: "bot", text: "Thanks for being honest. What would make your plan feel worth it?" },
      { from: "user", text: "Rollover data and cheaper night-time rates" },
    ],
    kpis: [
      { label: "Response Rate", value: "38%", delta: "+15% vs USSD", positive: true },
      { label: "NPS Score", value: "34", delta: "+6 vs Q3", positive: true },
      { label: "Avg. Response Time", value: "52 min", delta: "from 4 days", positive: true },
      { label: "Active Surveys", value: "5", delta: "892 responses today", positive: true },
    ],
    issues: [
      { issue: "Data running out too fast", mentions: 156, severity: "High" },
      { issue: "Network coverage gaps", mentions: 98, severity: "High" },
      { issue: "Billing confusion", mentions: 67, severity: "Medium" },
      { issue: "Call centre wait times", mentions: 45, severity: "Medium" },
    ],
    sampleQuestions: ["How's your network experience?", "Is your plan good value?", "What would improve your experience?", "How was your last store visit?"],
  },
  "Automotive": {
    feedback: [
      { icon: "🚗", title: "Post-Enquiry Experience", desc: "WhatsApp survey triggered after a buyer enquires on a listing. Track dealer responsiveness, lead quality, and buyer satisfaction.", tags: ["Buyer CX", "Dealer", "Lead Quality"] },
      { icon: "⭐", title: "Dealer Rating Follow-Up", desc: "Automated feedback request after a test drive or purchase through the platform. Build trust with verified reviews.", tags: ["Reviews", "Trust", "Ratings"] },
      { icon: "📱", title: "App & Search Experience", desc: "In-moment feedback on search, filtering, and listing quality. Surface UX issues, crashes, and feature gaps before app store reviews.", tags: ["App CX", "UX", "Search"] },
      { icon: "🔔", title: "Listing Quality Audit", desc: "Survey sellers after listing creation. Track photo upload friction, pricing tool satisfaction, and listing completion rates.", tags: ["Seller CX", "Listings", "Quality"] },
    ],
    research: [
      { icon: "📈", title: "Buyer Journey Tracker", desc: "Quarterly study tracking how buyers research, compare, and decide — from first search to dealer visit to purchase.", tags: ["Journey", "Tracking", "Quarterly"] },
      { icon: "💰", title: "Pricing & Affordability Study", desc: "Understand price sensitivity, financing preferences, and how buyers perceive value across vehicle segments.", tags: ["Pricing", "Finance", "Segments"] },
      { icon: "🔄", title: "Seller Experience Research", desc: "AI-moderated depth interviews with private sellers and dealers on what drives listing decisions and platform choice.", tags: ["Sellers", "Dealers", "AI Interview"] },
      { icon: "🌍", title: "Market Expansion Insights", desc: "Research buyer behaviour in new vehicle categories (EVs, bakkies, bikes) or underserved markets.", tags: ["Market Entry", "EV", "Segments"] },
    ],
    flowTrigger: "Buyer enquires on a listing, books a test drive, or completes a purchase",
    chatMessages: [
      { from: "bot", text: "Hi! 👋 You recently enquired about a 2022 VW Polo on AutoTrader. How was your experience with the dealer?" },
      { from: "user", text: "They took 2 days to respond, which was frustrating" },
      { from: "bot", text: "Sorry to hear that. On a scale of 0-10, how would you rate the overall enquiry experience?" },
      { from: "user", text: "4 - the listing was great but the dealer let it down" },
      { from: "bot", text: "Thanks for being honest. What would have made this experience better?" },
      { from: "user", text: "Faster response and the ability to book a test drive directly through the app" },
    ],
    kpis: [
      { label: "Response Rate", value: "41%", delta: "+18% vs email", positive: true },
      { label: "NPS Score", value: "38", delta: "+9 vs Q3", positive: true },
      { label: "Avg. Response Time", value: "35 min", delta: "from 3 days", positive: true },
      { label: "Active Surveys", value: "4", delta: "312 responses today", positive: true },
    ],
    issues: [
      { issue: "Dealer response time", mentions: 134, severity: "High" },
      { issue: "App crashes during search", mentions: 87, severity: "High" },
      { issue: "Outdated/sold listings", mentions: 72, severity: "Medium" },
      { issue: "Financing clarity", mentions: 48, severity: "Medium" },
    ],
    sampleQuestions: ["How was the dealer response?", "Was the listing accurate?", "Would you use AutoTrader again?", "How easy was the search experience?"],
  },
};

const DEFAULT_TEMPLATE = TEMPLATES["FMCG / Consumer Goods"]!;

function getTemplate(industry: string) {
  return TEMPLATES[industry] || DEFAULT_TEMPLATE;
}

/* ─── PREVIEW CARD ─── */
function PreviewCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2" style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ─── TAG COMPONENT ─── */
function Tag({ label, color }: { label: string; color?: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mr-1 mb-1"
      style={{ backgroundColor: color || "hsl(86, 18%, 90%)", color: color ? "white" : "hsl(86, 18%, 43%)" }}
    >
      {label}
    </span>
  );
}

/* ─── MAIN COMPONENT ─── */
const Admin = () => {
  // Override the deck's overflow:hidden on html/body so admin page scrolls
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    companyName: "",
    brandName: "",
    industry: "",
    context: "",
    competitors: "",
    brandColor: "#1A6B3C",
  });

  const [generated, setGenerated] = useState<GeneratedDeck | null>(null);

  const updateForm = (key: keyof FormState, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));

    const template = getTemplate(form.industry);
    const brand = form.brandName || form.companyName;

    // Generate competitor cards (from input or defaults)
    // Industry-specific default competitors
    const INDUSTRY_COMPETITORS: Record<string, CompetitorCard[]> = {
      "Financial Services / Banking": [
        { name: "Capitec", stat: "24.1M active clients", desc: "Dominant mass-market bank with best-rated app in SA. Heavily invests in CX research and digital optimisation.", doing: "In-app feedback loops, dedicated CX research team, continuous NPS tracking, behavioural analytics", badge: "Active CX programme" },
        { name: "TymeBank / GoTyme", stat: "10.7M clients across SA & Philippines", desc: "Fastest growing neobank. Kiosk-first model with Pick n Pay drives massive reach into underserved segments.", doing: "Automated onboarding feedback, retail partner surveys, WhatsApp support, kiosk experience tracking", badge: "AI-driven insights" },
        { name: "Discovery Bank", stat: "Vitality-integrated banking", desc: "Behavioural banking pioneer. Vitality-linked rewards create sticky retention loops with deep data analytics.", doing: "Advanced behavioural analytics, personalised CX journeys, real-time engagement scoring, reward-linked NPS", badge: "Behavioural CX" },
      ],
      "Automotive": [
        { name: "Cars.co.za", stat: "5.1M monthly visits", desc: "SA's leading motoring media + marketplace. Combines thousands of listings with editorial reviews, video content, and motoring news.", doing: "Post-purchase dealer surveys, editorial-driven buyer engagement, comprehensive vehicle reviews, Car of the Year awards", badge: "Content + marketplace" },
        { name: "WeBuyCars", stat: "SA's #1 car buying service", desc: "Instant vehicle purchasing model with on-site evaluations and immediate cash payments. Disrupting private selling.", doing: "Streamlined seller experience tracking, instant valuation feedback, purchase journey optimisation, NPS at point of sale", badge: "Transactional CX" },
        { name: "Facebook Marketplace", stat: "Massive organic reach", desc: "Growing C2C vehicle marketplace with no listing fees. Increasing threat to classified platforms with social trust signals.", doing: "Social proof via profiles, instant messaging engagement, organic reach algorithms, community-driven trust", badge: "Social commerce" },
      ],
      "FMCG / Consumer Goods": [
        { name: "Nielsen", stat: "Global market research leader", desc: "Comprehensive retail measurement and consumer intelligence across FMCG categories. Gold standard for market sizing.", doing: "Retail panel tracking, shopper insights, brand health trackers, media measurement, syndicated studies", badge: "Full-service research" },
        { name: "Kantar", stat: "World's largest insights company", desc: "End-to-end brand and CX measurement. Strong in brand equity tracking and advertising effectiveness.", doing: "BrandZ tracking, Worldpanel shopper data, creative testing, social intelligence, sustainability measurement", badge: "Brand intelligence" },
        { name: "Ipsos", stat: "3rd largest research globally", desc: "Already a Yazi client. Deep expertise in innovation testing, UX research, and customer experience measurement.", doing: "Innovation testing, UX labs, mystery shopping, CX programmes, political and social research", badge: "Innovation + CX" },
      ],
      "Telecommunications": [
        { name: "MTN", stat: "280M+ subscribers across Africa", desc: "Africa's largest telco by subscribers. Massive investment in digital services and mobile money (MoMo).", doing: "In-app satisfaction surveys, USSD feedback, churn prediction models, network quality monitoring", badge: "Scale + digital" },
        { name: "Telkom", stat: "SA's converged operator", desc: "Fixed + mobile convergence play. Aggressive pricing and fibre rollout creating competitive pressure.", doing: "Converged experience tracking, fibre installation feedback, call centre quality monitoring", badge: "Converged CX" },
        { name: "Rain", stat: "Data-only disruptor", desc: "5G pioneer in SA with unlimited data model. Attracting young, data-heavy users from traditional telcos.", doing: "Digital-first CX, app-only support, 5G experience feedback, community-driven support forums", badge: "Digital disruptor" },
      ],
    };

    let competitors: CompetitorCard[];
    if (form.competitors.trim()) {
      // User provided specific competitors — use them with contextual descriptions
      const names = form.competitors.split(",").map((c) => c.trim()).filter(Boolean).slice(0, 3);
      const industryDefaults = INDUSTRY_COMPETITORS[form.industry] || [];
      competitors = names.map((name, i) => {
        // Check if this competitor has a pre-built profile
        const match = industryDefaults.find(d => d.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(d.name.toLowerCase()));
        if (match) return { ...match, name }; // Use researched data
        return {
          name,
          stat: "Key competitor",
          desc: `A significant player in the ${form.industry} space, actively investing in customer experience and digital transformation.`,
          doing: "Customer feedback programmes, digital experience optimisation, competitive CX initiatives",
          badge: "Active CX",
        };
      });
    } else {
      competitors = INDUSTRY_COMPETITORS[form.industry] || [
        { name: "Competitor A", stat: "Market leader", desc: "Running structured CX surveys across digital touchpoints to drive customer retention.", doing: "Customer surveys, NPS tracking, digital feedback loops, CX analytics dashboards", badge: "Active CX programme" },
        { name: "Competitor B", stat: "Fast-growing challenger", desc: "AI-powered voice-of-customer analysis driving rapid product iteration and customer insights.", doing: "AI-powered sentiment analysis, real-time feedback, automated CX workflows", badge: "AI-driven insights" },
        { name: "Competitor C", stat: "Digital-first innovator", desc: "Behavioural data and feedback loops powering highly personalised customer experiences.", doing: "Behavioural analytics, personalised journeys, predictive churn models", badge: "Behavioural CX" },
      ];
    }

    // Customise chat messages with brand name
    const chatMessages = template.chatMessages.map((msg) => ({
      ...msg,
      text: msg.text.replace(/joining us/g, `joining ${brand}`).replace(/our product/g, `${brand}`),
    }));

    setGenerated({
      intro: {
        headline: `Real-Time Customer Intelligence for ${brand}`,
        subtitle: `Understand your customers through WhatsApp conversations — from onboarding to advocacy, at scale`,
      },
      feedbackUseCases: template.feedback,
      researchUseCases: template.research,
      flowSteps: [
        { emoji: "⚡", label: "Trigger Event", desc: template.flowTrigger, bg: "coral" },
        { emoji: "💬", label: "WhatsApp Conversation", desc: "Yazi AI engages customer in natural, adaptive dialogue", bg: "whatsapp" },
      ],
      flowBranches: [
        { label: "Quick Pulse", color: "olive" },
        { label: "AI Depth Probe", color: "gold" },
        { label: "Save Attempt", color: "coral" },
      ],
      flowOutputs: [
        { label: "Live Dashboard", desc: "Real-time KPIs, trends & segment views", color: "hsl(211, 75%, 35%)" },
        { label: "Retention Alert", desc: "Instant alerts on at-risk customers", color: "hsl(14, 83%, 54%)" },
      ],
      chatMessages,
      competitors,
      competitorCta: `With Yazi, ${brand} can leapfrog competitors — launching real-time CX intelligence on WhatsApp, the channel your customers already live on.`,
      kpis: template.kpis,
      npsData: [32, 35, 38, 41, 39, 44, 47],
      sentiment: { positive: 62, neutral: 24, negative: 14 },
      issues: template.issues,
      sampleQuestions: template.sampleQuestions,
      branchName: brand.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    });

    setGenerating(false);
    setStep(2);
  };

  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");
  const [deployError, setDeployError] = useState("");

  const handleExport = async () => {
    if (!generated) return;
    setDeploying(true);
    setDeployError("");
    setStep(3);

    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const owner = "yazi-accounts";
      const repo = "proposal-deck";
      const slug = generated.branchName;
      const api = `https://api.github.com/repos/${owner}/${repo}`;
      const headers: Record<string, string> = { Authorization: `token ${token}`, "Content-Type": "application/json" };

      // 1. Generate the standalone HTML deck
      const htmlContent = generateDeckHTML(generated, form, logoPreview);
      const encodedContent = btoa(unescape(encodeURIComponent(htmlContent)));

      // 2. Check if the file already exists (to get its sha for update)
      const filePath = `public/decks/${slug}.html`;
      let existingSha: string | undefined;
      try {
        const existing = await fetch(`${api}/contents/${filePath}?ref=main`, { headers });
        if (existing.ok) {
          const data = await existing.json();
          existingSha = data.sha;
        }
      } catch { /* file doesn't exist yet — that's fine */ }

      // 3. Push the HTML file to main branch in public/decks/ folder
      const putBody: Record<string, string> = {
        message: `Add personalized deck for ${form.brandName || form.companyName}`,
        content: encodedContent,
        branch: "main",
      };
      if (existingSha) putBody.sha = existingSha;

      const pushResult = await fetch(`${api}/contents/${filePath}`, {
        method: "PUT", headers,
        body: JSON.stringify(putBody),
      });

      if (!pushResult.ok) {
        const err = await pushResult.json();
        throw new Error(err.message || `GitHub API error: ${pushResult.status}`);
      }

      // The deck will be available at /decks/[slug].html after Vercel redeploys
      const previewUrl = `https://proposal-deck.vercel.app/decks/${slug}.html`;
      setDeployUrl(previewUrl);
    } catch (err: any) {
      console.error("Deploy failed:", err);
      setDeployError(err.message || "Deploy failed. Check the console for details.");
    }

    setDeploying(false);
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif", overflow: "auto", height: "auto" }}>
      {/* Header */}
      <header className="border-b border-border bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                <path d="M18 16l6 8-6 8M24 16l6 8-6 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">Proposal Generator</span>
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    i === step ? "bg-foreground text-background" : i < step ? "text-foreground/60" : "bg-muted/30 text-muted-foreground"
                  }`}
                  style={i < step ? { backgroundColor: "hsl(86, 18%, 90%)", color: "hsl(86, 18%, 43%)" } : undefined}
                >
                  {i < step ? <Check className="w-3 h-3" /> : null}
                  {s}
                </div>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ── STEP 0: INPUT FORM ── */}
        {step === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl mb-3">Create a <em>Personalized</em> Deck</h1>
              <p className="text-muted-foreground text-base">Enter the prospect's details and we'll generate 5–6 tailored proposal slides.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={form.companyName} onChange={(e) => updateForm("companyName", e.target.value)} placeholder="e.g. Old Mutual Bank" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand / Short Name</label>
                <input type="text" value={form.brandName} onChange={(e) => updateForm("brandName", e.target.value)} placeholder="e.g. OM Bank (used in headlines)" className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Industry *</label>
                  <div className="relative">
                    <select value={form.industry} onChange={(e) => updateForm("industry", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm appearance-none">
                      <option value="">Select...</option>
                      {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brand Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.brandColor} onChange={(e) => updateForm("brandColor", e.target.value)} className="w-12 h-11 rounded-lg border border-border cursor-pointer" />
                    <input type="text" value={form.brandColor} onChange={(e) => updateForm("brandColor", e.target.value)} placeholder="#1A6B3C" className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Logo</label>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-all">
                  {logoPreview ? (
                    <div className="flex items-center justify-center gap-4">
                      <img src={logoPreview} alt="Logo" className="max-h-12 max-w-[160px] object-contain" />
                      <span className="text-xs text-muted-foreground">Click to change</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload logo (PNG, SVG)</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Competitors <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input type="text" value={form.competitors} onChange={(e) => updateForm("competitors", e.target.value)} placeholder="e.g. Capitec, TymeBank, Discovery Bank (comma-separated)" className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
                <p className="text-xs text-muted-foreground mt-1">Leave empty and we'll research competitors for you.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Context / Meeting Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
                <textarea value={form.context} onChange={(e) => updateForm("context", e.target.value)} placeholder="Paste meeting notes, specific pain points, KPIs they care about, key contacts..." rows={5} className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none" />
              </div>

              <button onClick={() => { setStep(1); handleGenerate(); }} disabled={!form.companyName || !form.industry} className="w-full py-4 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90">
                <Sparkles className="w-4 h-4" />
                Generate Proposal Slides
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: GENERATING ── */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin mb-6" style={{ color: "hsl(86, 18%, 43%)" }} />
            <h2 className="text-2xl mb-2">Generating slides for <em>{form.brandName || form.companyName}</em></h2>
            <p className="text-muted-foreground text-sm">Researching the company, building use cases, and creating dashboard mockups...</p>
          </div>
        )}

        {/* ── STEP 2: PREVIEW ── */}
        {step === 2 && generated && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl">Preview: <em>{form.brandName || form.companyName}</em></h2>
                <p className="text-muted-foreground text-sm mt-1">5 tailored slides to append after your main deck.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setStep(0); setGenerated(null); }} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-white transition-colors">Edit Inputs</button>
                <button onClick={handleExport} className="px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 hover:opacity-90" style={{ backgroundColor: "hsl(86, 18%, 43%)" }}>
                  <Download className="w-4 h-4" />
                  Export Deck
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* SLIDE 1: Co-branded Intro */}
              <PreviewCard title="Slide 1 — Co-branded Introduction" icon={<FileText className="w-4 h-4" />}>
                <div className="text-center py-6" style={{ backgroundColor: "hsl(37, 100%, 97%)", borderRadius: "12px" }}>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M18 16l6 8-6 8M24 16l6 8-6 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <span className="text-xl text-muted-foreground/40">×</span>
                    {logoPreview ? <img src={logoPreview} alt="" className="max-h-10 max-w-[120px] object-contain" /> : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: form.brandColor }}>{(form.brandName || form.companyName).charAt(0)}</div>
                    )}
                  </div>
                  <h3 className="text-2xl mb-2">{generated.intro.headline}</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">{generated.intro.subtitle}</p>
                </div>
              </PreviewCard>

              {/* SLIDE 2: Use Cases */}
              <PreviewCard title="Slide 2 — Use Cases" icon={<MessageSquare className="w-4 h-4" />}>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(86, 18%, 43%)" }} />
                    <span className="text-sm font-semibold">Customer Feedback — CX & Brand Perception</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {generated.feedbackUseCases.map((uc, i) => (
                      <div key={i} className="bg-background rounded-lg p-3 border border-border">
                        <span className="text-base mb-1 block">{uc.icon}</span>
                        <p className="text-xs font-semibold mb-1">{uc.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{uc.desc}</p>
                        <div>{uc.tags.map((t) => <Tag key={t} label={t} />)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(35, 88%, 59%)" }} />
                    <span className="text-sm font-semibold">Market Research</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {generated.researchUseCases.map((uc, i) => (
                      <div key={i} className="bg-background rounded-lg p-3 border border-border">
                        <span className="text-base mb-1 block">{uc.icon}</span>
                        <p className="text-xs font-semibold mb-1">{uc.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{uc.desc}</p>
                        <div>{uc.tags.map((t) => <Tag key={t} label={t} />)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </PreviewCard>

              {/* SLIDE 3: How It Works */}
              <PreviewCard title="Slide 3 — How It Works" icon={<Zap className="w-4 h-4" />}>
                <div className="flex gap-8">
                  <div className="flex-1">
                    {/* Flow steps */}
                    {generated.flowSteps.map((s, i) => (
                      <div key={i} className="mb-1">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white`} style={{ backgroundColor: s.bg === "coral" ? "hsl(14, 83%, 54%)" : "#075E54" }}>
                          <span>{s.emoji}</span> <strong>{s.label}</strong>
                        </div>
                        <p className="text-[11px] text-muted-foreground ml-8 mt-0.5 mb-1">{s.desc}</p>
                        <div className="ml-5 w-0.5 h-3 bg-border" />
                      </div>
                    ))}
                    {/* Branches */}
                    <div className="flex gap-2 ml-4 mb-1">
                      {generated.flowBranches.map((b) => (
                        <span key={b.label} className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: b.color === "olive" ? "hsl(86,18%,43%)" : b.color === "gold" ? "hsl(35,88%,59%)" : "hsl(14,83%,54%)" }}>{b.label}</span>
                      ))}
                    </div>
                    <div className="ml-5 w-0.5 h-3 bg-border" />
                    {/* Outputs */}
                    <div className="flex gap-2 ml-4">
                      {generated.flowOutputs.map((o) => (
                        <div key={o.label} className="px-3 py-2 rounded-lg text-[10px] font-medium text-white" style={{ backgroundColor: o.color }}>
                          <strong>{o.label}</strong><br /><span className="opacity-80">{o.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 max-w-xs">
                    <div className="rounded-xl p-3" style={{ backgroundColor: "#ECE5DD" }}>
                      <div className="text-white text-xs font-semibold px-3 py-2 rounded-t-lg -mt-3 -mx-3 mb-2" style={{ backgroundColor: "#075E54" }}>
                        {form.brandName || form.companyName} Research
                      </div>
                      <div className="space-y-1.5">
                        {generated.chatMessages.map((msg, i) => (
                          <div key={i} className={`${msg.from === "user" ? "ml-4" : "mr-4"} rounded-lg px-2.5 py-1.5 text-[10px] leading-snug`} style={{ backgroundColor: msg.from === "user" ? "#DCF8C6" : "white" }}>{msg.text}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </PreviewCard>

              {/* SLIDE 4: Competitive Edge */}
              <PreviewCard title="Slide 4 — Competitive Edge" icon={<Shield className="w-4 h-4" />}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Competitors Are Already Listening</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {generated.competitors.map((c, i) => (
                    <div key={i} className="bg-background rounded-lg p-4 border border-border text-center">
                      <p className="text-sm font-bold mb-1">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground mb-2">{c.stat}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{c.desc}</p>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold bg-foreground/10 text-foreground">{c.badge}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">{generated.competitorCta}</p>
              </PreviewCard>

              {/* SLIDE 5: Dashboard Mockup */}
              <PreviewCard title="Slide 5 — Dashboard Mockup" icon={<BarChart3 className="w-4 h-4" />}>
                <div className="rounded-xl border border-border overflow-hidden">
                  {/* Dashboard header */}
                  <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: "hsl(211, 75%, 15%)" }}>
                    <span className="text-white text-xs font-semibold">{form.brandName || form.companyName} — Customer Intelligence Dashboard</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-white" style={{ backgroundColor: "#25D366" }}>Live</span>
                  </div>
                  {/* KPI row */}
                  <div className="grid grid-cols-4 gap-3 p-4 border-b border-border">
                    {generated.kpis.map((kpi) => (
                      <div key={kpi.label} className="text-center bg-background rounded-lg p-3 border border-border">
                        <p className="text-lg font-bold" style={{ fontFamily: "'Instrument Serif', serif" }}>{kpi.value}</p>
                        <p className="text-[10px] font-medium text-foreground">{kpi.label}</p>
                        <p className={`text-[10px] ${kpi.positive ? "text-green-600" : "text-red-500"}`}>{kpi.delta}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {/* NPS Trend */}
                    <div>
                      <p className="text-[11px] font-semibold mb-2">NPS Trend — Post-Onboarding Survey</p>
                      <div className="bg-background rounded-lg p-3 border border-border h-24 flex items-end gap-1">
                        {generated.npsData.map((v, i) => (
                          <div key={i} className="flex-1 rounded-t" style={{ height: `${(v / 50) * 100}%`, backgroundColor: form.brandColor, opacity: 0.6 + (i * 0.05) }} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
                        {["W1", "W2", "W3", "W4", "W5", "W6", "W7"].map((w) => <span key={w}>{w}</span>)}
                      </div>
                    </div>
                    {/* Right panel */}
                    <div className="space-y-3">
                      {/* Sentiment */}
                      <div>
                        <p className="text-[11px] font-semibold mb-2">Sentiment Breakdown — This Week</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px]"><span className="w-14 text-right">Positive</span><div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${generated.sentiment.positive}%`, backgroundColor: "hsl(86,18%,43%)" }} /></div><span className="w-8">{generated.sentiment.positive}%</span></div>
                          <div className="flex items-center gap-2 text-[10px]"><span className="w-14 text-right">Neutral</span><div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${generated.sentiment.neutral}%`, backgroundColor: "hsl(35,88%,59%)" }} /></div><span className="w-8">{generated.sentiment.neutral}%</span></div>
                          <div className="flex items-center gap-2 text-[10px]"><span className="w-14 text-right">Negative</span><div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${generated.sentiment.negative}%`, backgroundColor: "hsl(14,83%,54%)" }} /></div><span className="w-8">{generated.sentiment.negative}%</span></div>
                        </div>
                      </div>
                      {/* Issues table */}
                      <div>
                        <p className="text-[11px] font-semibold mb-1.5">Top Issues — AI-Categorised</p>
                        <div className="space-y-1">
                          {generated.issues.map((issue) => (
                            <div key={issue.issue} className="flex items-center justify-between text-[10px] py-1 border-b border-border last:border-0">
                              <span>{issue.issue}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">{issue.mentions} mentions</span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${issue.severity === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{issue.severity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Sample questions */}
                  <div className="px-4 pb-3 flex gap-2 flex-wrap">
                    {generated.sampleQuestions.map((q) => (
                      <span key={q} className="px-2.5 py-1 bg-muted/30 rounded-full text-[10px] text-muted-foreground">{q}</span>
                    ))}
                  </div>
                </div>
              </PreviewCard>

              {/* Bottom export bar */}
              <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-border -mx-6 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Ready to export?</p>
                  <p className="text-xs text-muted-foreground">5 tailored slides for {form.brandName || form.companyName}</p>
                </div>
                <button onClick={handleExport} className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center gap-2 hover:opacity-90">
                  <Download className="w-4 h-4" />
                  Export & Deploy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: EXPORT ── */}
        {step === 3 && generated && (
          <div className="max-w-lg mx-auto text-center py-20">
            {deploying ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-6" style={{ color: "hsl(86, 18%, 43%)" }} />
                <h2 className="text-2xl mb-2">Deploying <em>{form.brandName || form.companyName}</em></h2>
                <p className="text-muted-foreground text-sm">Creating branch, generating HTML, pushing to GitHub...</p>
              </>
            ) : deployError ? (
              <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "hsl(14, 83%, 92%)" }}>
                  <AlertTriangle className="w-8 h-8" style={{ color: "hsl(14, 83%, 54%)" }} />
                </div>
                <h2 className="text-3xl mb-3">Deploy <em>Failed</em></h2>
                <p className="text-muted-foreground text-sm mb-4">{deployError}</p>
                <button onClick={() => { setStep(2); setDeployError(""); }} className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-white">Go Back</button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "hsl(86, 18%, 90%)" }}>
                  <Check className="w-8 h-8" style={{ color: "hsl(86, 18%, 43%)" }} />
                </div>
                <h2 className="text-3xl mb-3">Deck <em>Deployed</em></h2>
                <p className="text-muted-foreground text-sm mb-8">
                  5 personalized slides for {form.brandName || form.companyName} are live on branch{" "}
                  <code className="bg-muted/30 px-1.5 py-0.5 rounded" style={{ color: "hsl(86, 18%, 43%)" }}>{generated.branchName}</code>.
                </p>
                <div className="bg-white rounded-xl border border-border p-6 text-left space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Branch</span>
                    <code className="text-sm font-medium">{generated.branchName}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preview URL</span>
                    <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-1 hover:underline" style={{ color: "hsl(86, 18%, 43%)" }}>
                      {deployUrl.replace("https://", "")} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Custom domain</span>
                    <span className="text-sm text-muted-foreground">{generated.branchName}.deck.askyazi.com (configure in Vercel)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">GitHub</span>
                    <a href={`https://github.com/yazi-accounts/proposal-deck/tree/${generated.branchName}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-1 text-foreground hover:underline">
                      yazi-accounts/proposal-deck/{generated.branchName} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center gap-2 hover:opacity-90">
                    <ExternalLink className="w-4 h-4" />
                    View Live Deck
                  </a>
                  <button onClick={() => { setStep(0); setGenerated(null); setDeployUrl(""); setForm({ companyName: "", brandName: "", industry: "", context: "", competitors: "", brandColor: "#1A6B3C" }); setLogoPreview(null); }} className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-white transition-colors">
                    Generate Another
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
