import { useState, useRef } from "react";
import { Building2, Upload, Sparkles, Eye, GitBranch, ExternalLink, Loader2, Check, ChevronDown, FileText, MessageSquare, BarChart3, Zap } from "lucide-react";

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

const STEPS = ["Input", "Generate", "Preview", "Deploy"];

const USE_CASE_TEMPLATES: Record<string, { feedback: UseCaseItem[]; research: UseCaseItem[] }> = {
  "FMCG / Consumer Goods": {
    feedback: [
      { icon: "📊", title: "Post-Purchase Surveys", desc: "WhatsApp surveys triggered after purchase to track satisfaction, NPS, and churn drivers — automatically and at scale.", tag: "NPS · Churn" },
      { icon: "📦", title: "In-Store & On-Pack QR", desc: "QR codes on packaging or in-store linking to short WhatsApp conversations for real-time product feedback.", tag: "Retail · QR" },
      { icon: "🔔", title: "Always-On Feedback Channel", desc: "Persistent WhatsApp channel to surface product issues early — defects, quality changes, stock-outs.", tag: "Early Warning" },
      { icon: "🧪", title: "Pre-Launch Concept Testing", desc: "Targeted pulses to test consumer reactions to new products, packaging, or messaging before rollout.", tag: "Innovation" },
    ],
    research: [
      { icon: "📈", title: "Tracker Augmentation", desc: "Run parts of brand trackers via WhatsApp to dramatically reduce cost and turnaround time.", tag: "Trackers" },
      { icon: "🌍", title: "New Market Studies", desc: "Research consumer behaviour in new markets in local languages where traditional panels struggle.", tag: "Market Entry" },
      { icon: "📱", title: "Product Testing via QR", desc: "QR code follow-ups after trial or delivery. Capture product experience at the moment of use.", tag: "Product Testing" },
      { icon: "⚡", title: "WhatsApp Screeners", desc: "Faster incidence and recruitment via WhatsApp screeners. Cut recruitment time by 80%.", tag: "Recruitment" },
    ],
  },
  "Financial Services / Banking": {
    feedback: [
      { icon: "💳", title: "Post-Transaction Feedback", desc: "WhatsApp surveys triggered after key banking moments — account opening, loan approval, card activation.", tag: "CX · Onboarding" },
      { icon: "📱", title: "Digital Channel Satisfaction", desc: "Capture real-time feedback on app and online banking experience at point of use.", tag: "Digital CX" },
      { icon: "🔔", title: "Service Recovery Alerts", desc: "Detect dissatisfaction early through always-on WhatsApp feedback to reduce churn and complaints.", tag: "Churn Prevention" },
      { icon: "⭐", title: "Branch Experience Audit", desc: "Post-visit research to measure staff engagement, wait times, and service quality across branches.", tag: "Branch CX" },
    ],
    research: [
      { icon: "📈", title: "Financial Wellbeing Tracker", desc: "Recurring tracker on financial literacy, saving habits, and product consideration.", tag: "Tracker" },
      { icon: "🏦", title: "Product Concept Testing", desc: "Test new financial product ideas with target segments before development investment.", tag: "Innovation" },
      { icon: "🌍", title: "Inclusive Research", desc: "Reach underbanked and rural populations via WhatsApp in local languages.", tag: "Inclusion" },
      { icon: "⚡", title: "Competitor Switching Study", desc: "Understand why customers switch banks and what drives loyalty in your market.", tag: "Competitive Intel" },
    ],
  },
  "Insurance": {
    feedback: [
      { icon: "📋", title: "Claims Experience Feedback", desc: "Trigger WhatsApp surveys post-claim to track satisfaction with speed, communication, and resolution.", tag: "Claims CX" },
      { icon: "🔄", title: "Renewal Journey Research", desc: "Understand decision drivers at renewal: price sensitivity, trust, and competitor consideration.", tag: "Retention" },
      { icon: "📱", title: "Digital Onboarding Audit", desc: "Capture real-time feedback on policy sign-up and digital self-service experience.", tag: "Digital CX" },
      { icon: "🔔", title: "Service Alert Channel", desc: "Always-on WhatsApp channel to detect policyholder frustration before formal complaints.", tag: "Early Warning" },
    ],
    research: [
      { icon: "📈", title: "Brand Trust Tracker", desc: "Run recurring trust and consideration trackers via WhatsApp at a fraction of traditional cost.", tag: "Tracker" },
      { icon: "🧪", title: "Product Concept Testing", desc: "Test new insurance products, bundles, or pricing tiers with target segments before launch.", tag: "Innovation" },
      { icon: "🌍", title: "Underserved Segment Research", desc: "Reach informal and underinsured populations in local languages where panels fail.", tag: "Inclusion" },
      { icon: "⚡", title: "Agent Channel Research", desc: "Gather feedback from brokers and agents on tools, incentives, and customer needs.", tag: "Distribution" },
    ],
  },
  "Telecommunications": {
    feedback: [
      { icon: "📶", title: "Network Experience Feedback", desc: "WhatsApp surveys triggered by network events — outages, plan changes, roaming — to capture real-time CX.", tag: "Network CX" },
      { icon: "📱", title: "App & USSD Satisfaction", desc: "In-moment feedback on self-service digital channels and app feature usage.", tag: "Digital CX" },
      { icon: "🔔", title: "Churn Early Warning", desc: "Detect dissatisfaction signals early via always-on WhatsApp to trigger save-desk interventions.", tag: "Churn Prevention" },
      { icon: "🏪", title: "Retail & Call Centre Audit", desc: "Post-interaction feedback across retail stores and contact centres.", tag: "Touchpoint CX" },
    ],
    research: [
      { icon: "📈", title: "Brand Health Tracker", desc: "Run brand consideration and NPS trackers via WhatsApp at 80% lower cost.", tag: "Tracker" },
      { icon: "💰", title: "Price Sensitivity Research", desc: "Understand data bundle and plan pricing elasticity across segments.", tag: "Pricing" },
      { icon: "🌍", title: "Rural Market Research", desc: "Reach prepaid and rural subscribers in local languages where online panels can't.", tag: "Inclusion" },
      { icon: "⚡", title: "5G / New Service Concept Test", desc: "Test interest and willingness to pay for new services before capital investment.", tag: "Innovation" },
    ],
  },
  "Retail / E-commerce": {
    feedback: [
      { icon: "🛒", title: "Post-Purchase Feedback", desc: "WhatsApp surveys triggered after purchase to track satisfaction, delivery experience, and product quality.", tag: "CX · Delivery" },
      { icon: "📦", title: "In-Store QR Feedback", desc: "QR codes at checkout or on receipts linking to WhatsApp for real-time store experience feedback.", tag: "Store CX" },
      { icon: "🔔", title: "Returns & Complaints Channel", desc: "Always-on WhatsApp channel to capture return reasons and service recovery opportunities early.", tag: "Service Recovery" },
      { icon: "⭐", title: "Loyalty Program Research", desc: "Understand member satisfaction, redemption behaviour, and program value perception.", tag: "Loyalty" },
    ],
    research: [
      { icon: "📈", title: "Shopper Behaviour Tracker", desc: "Recurring study on shopping habits, channel preference, and basket composition.", tag: "Tracker" },
      { icon: "🧪", title: "Private Label Testing", desc: "Test new private label products, packaging, and pricing with target shoppers.", tag: "Innovation" },
      { icon: "🌍", title: "Market Expansion Research", desc: "Understand new market dynamics and consumer needs before store openings.", tag: "Market Entry" },
      { icon: "⚡", title: "Competitor Price Perception", desc: "Research how consumers perceive your pricing vs. competitors across categories.", tag: "Competitive Intel" },
    ],
  },
};

const DEFAULT_TEMPLATE = {
  feedback: [
    { icon: "📊", title: "Customer Satisfaction Surveys", desc: "Automated WhatsApp surveys triggered at key touchpoints to track NPS, CSAT, and CES.", tag: "NPS · CSAT" },
    { icon: "📦", title: "QR-Triggered Feedback", desc: "QR codes at point of experience linking to WhatsApp conversations for real-time feedback.", tag: "QR · Real-Time" },
    { icon: "🔔", title: "Always-On Feedback", desc: "Persistent WhatsApp channel for early issue detection before problems escalate.", tag: "Early Warning" },
    { icon: "🧪", title: "Concept Testing", desc: "Rapid consumer pulses to test new products, services, or messaging before launch.", tag: "Innovation" },
  ],
  research: [
    { icon: "📈", title: "Tracker Augmentation", desc: "Run recurring studies via WhatsApp to reduce cost and turnaround vs. traditional methods.", tag: "Trackers" },
    { icon: "🌍", title: "Market Entry Research", desc: "Reach consumers in new markets in local languages where traditional panels struggle.", tag: "Market Entry" },
    { icon: "📱", title: "Experience Testing", desc: "Capture product/service experience data at the moment of use via QR or trigger-based flows.", tag: "Testing" },
    { icon: "⚡", title: "WhatsApp Recruitment", desc: "Faster screening and recruitment via WhatsApp. Cut recruitment time by 80%.", tag: "Recruitment" },
  ],
};

interface UseCaseItem {
  icon: string;
  title: string;
  desc: string;
  tag: string;
}

interface FormState {
  companyName: string;
  brandName: string;
  industry: string;
  context: string;
}

interface GeneratedContent {
  intro: { headline: string; subtitle: string };
  feedbackUseCases: UseCaseItem[];
  researchUseCases: UseCaseItem[];
  flowSteps: { emoji: string; label: string; bg: string }[];
  chatMessages: { from: string; text: string }[];
  cta: string;
  branchName: string;
}

function getTemplate(industry: string) {
  return USE_CASE_TEMPLATES[industry] || DEFAULT_TEMPLATE;
}

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

const Admin = () => {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    companyName: "",
    brandName: "",
    industry: "",
    context: "",
  });

  const [generated, setGenerated] = useState<GeneratedContent | null>(null);

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
    await new Promise((r) => setTimeout(r, 2000));

    const template = getTemplate(form.industry);

    setGenerated({
      intro: {
        headline: `AI-Powered Consumer Research for ${form.brandName || form.companyName}`,
        subtitle: "Understand your consumers through WhatsApp conversations at scale",
      },
      feedbackUseCases: template.feedback,
      researchUseCases: template.research,
      flowSteps: [
        { emoji: "📦", label: "Purchase Event or QR Scan", bg: "navy" },
        { emoji: "💬", label: "WhatsApp Conversation Opens", bg: "whatsapp" },
        { emoji: "🤖", label: "AI Adaptive Interview (3–5 Qs)", bg: "light" },
        { emoji: "🔀", label: "Satisfied → NPS / Issue → Deep Probe", bg: "light" },
        { emoji: "📊", label: "Dashboard + Real-Time Alert", bg: "olive" },
      ],
      chatMessages: [
        { from: "bot", text: `Hey! 👋 Thanks for your recent experience with ${form.brandName || form.companyName}. We'd love to hear your feedback — takes just 2 mins.` },
        { from: "bot", text: "Q1 of 4 📋\nHow would you rate your overall experience?" },
        { from: "user", text: "Pretty good overall, but there were a few things that could be better" },
        { from: "bot", text: "Thanks for sharing! You mentioned some things could be better — what specifically stood out?" },
      ],
      cta: `See how Yazi can transform consumer research for ${form.companyName}. Book a demo in seconds.`,
      branchName: (form.brandName || form.companyName)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-"),
    });

    setGenerating(false);
    setStep(2);
  };

  const handleDeploy = () => setStep(3);

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                    i === step
                      ? "bg-foreground text-background"
                      : i < step
                      ? "text-foreground/60"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                  style={{ backgroundColor: i < step ? "hsl(86, 18%, 90%)" : undefined, color: i < step ? "hsl(86, 18%, 43%)" : undefined }}
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
        {/* STEP 0: Input Form */}
        {step === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl mb-3">
                Create a <em>Personalized</em> Deck
              </h1>
              <p className="text-muted-foreground text-base">Enter the prospect's details and we'll generate a tailored Yazi proposal deck.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => updateForm("companyName", e.target.value)}
                    placeholder="e.g. British American Tobacco"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand / Short Name</label>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={(e) => updateForm("brandName", e.target.value)}
                  placeholder="e.g. BAT (used in headlines)"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Industry *</label>
                <div className="relative">
                  <select
                    value={form.industry}
                    onChange={(e) => updateForm("industry", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select an industry...</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Logo</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-all"
                  style={{ backgroundColor: logoPreview ? undefined : "rgba(0,0,0,0.01)" }}
                >
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
                <label className="block text-sm font-medium mb-2">Context / Meeting Notes</label>
                <textarea
                  value={form.context}
                  onChange={(e) => updateForm("context", e.target.value)}
                  placeholder="Paste any meeting notes, specific use cases they mentioned, or details about what they're looking for..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1.5">Optional — if left empty, we'll research the company and suggest use cases.</p>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  handleGenerate();
                }}
                disabled={!form.companyName || !form.industry}
                className="w-full py-4 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              >
                <Sparkles className="w-4 h-4" />
                Generate Personalized Deck
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Generating */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin mb-6" style={{ color: "hsl(86, 18%, 43%)" }} />
            <h2 className="text-2xl mb-2">
              Generating deck for <em>{form.brandName || form.companyName}</em>
            </h2>
            <p className="text-muted-foreground text-sm">Researching the company and creating tailored use cases...</p>
          </div>
        )}

        {/* STEP 2: Preview */}
        {step === 2 && generated && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl">
                  Preview: <em>{form.brandName || form.companyName}</em>
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Review the personalized content before deploying.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep(0);
                    setGenerated(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-white transition-colors"
                >
                  Edit Inputs
                </button>
                <button
                  onClick={handleDeploy}
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "hsl(86, 18%, 43%)" }}
                >
                  <GitBranch className="w-4 h-4" />
                  Deploy to Vercel
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <PreviewCard title="Slide 1 — Introduction" icon={<FileText className="w-4 h-4" />}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                      <path d="M18 16l6 8-6 8M24 16l6 8-6 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xl text-muted-foreground/40 font-light">×</span>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="max-h-8 max-w-[100px] object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-foreground">{form.brandName || form.companyName}</span>
                  )}
                </div>
                <h3 className="text-2xl mb-2">{generated.intro.headline}</h3>
                <p className="text-sm text-muted-foreground">{generated.intro.subtitle}</p>
              </PreviewCard>

              <PreviewCard title="Slide 3 — Customer Feedback Use Cases" icon={<MessageSquare className="w-4 h-4" />}>
                <div className="grid grid-cols-2 gap-3">
                  {generated.feedbackUseCases.map((uc, i) => (
                    <div key={i} className="bg-background rounded-lg p-4 border border-border">
                      <span className="text-lg mb-2 block">{uc.icon}</span>
                      <p className="text-sm font-semibold mb-1">{uc.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "hsl(86, 18%, 90%)", color: "hsl(86, 18%, 43%)" }}>
                        {uc.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </PreviewCard>

              <PreviewCard title="Slide 4 — Research Use Cases" icon={<BarChart3 className="w-4 h-4" />}>
                <div className="grid grid-cols-2 gap-3">
                  {generated.researchUseCases.map((uc, i) => (
                    <div key={i} className="bg-background rounded-lg p-4 border border-border">
                      <span className="text-lg mb-2 block">{uc.icon}</span>
                      <p className="text-sm font-semibold mb-1">{uc.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "hsl(86, 18%, 90%)", color: "hsl(86, 18%, 43%)" }}>
                        {uc.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </PreviewCard>

              <PreviewCard title="Slide 5 — How It Works" icon={<Zap className="w-4 h-4" />}>
                <div className="flex gap-8">
                  <div className="flex-1">
                    <div className="flex flex-col gap-0">
                      {generated.flowSteps.map((s, i) => (
                        <div key={i} className="flex flex-col items-start">
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium ${
                              s.bg === "navy"
                                ? "bg-foreground text-background"
                                : s.bg === "whatsapp"
                                ? "text-white"
                                : s.bg === "olive"
                                ? "text-white"
                                : "bg-muted/40 text-foreground"
                            }`}
                            style={{
                              backgroundColor: s.bg === "whatsapp" ? "#075E54" : s.bg === "olive" ? "hsl(86, 18%, 43%)" : undefined,
                            }}
                          >
                            <span>{s.emoji}</span> {s.label}
                          </div>
                          {i < generated.flowSteps.length - 1 && <div className="ml-5 w-0.5 h-4 bg-border" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="rounded-xl p-3 max-w-xs" style={{ backgroundColor: "#ECE5DD" }}>
                      <div className="text-white text-xs font-semibold px-3 py-2 rounded-t-lg -mt-3 -mx-3 mb-2" style={{ backgroundColor: "#075E54" }}>
                        {form.brandName || form.companyName} Research
                      </div>
                      <div className="space-y-1.5">
                        {generated.chatMessages.map((msg, i) => (
                          <div key={i} className={`${msg.from === "user" ? "ml-6" : "mr-6"} rounded-lg px-2.5 py-1.5 text-[11px] leading-snug`} style={{ backgroundColor: msg.from === "user" ? "#DCF8C6" : "white" }}>
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </PreviewCard>

              <PreviewCard title="Slide 14 — Book a Demo" icon={<ExternalLink className="w-4 h-4" />}>
                <p className="text-sm text-muted-foreground">{generated.cta}</p>
              </PreviewCard>

              <div className="bg-white/60 rounded-xl border border-border p-5">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Slides 2, 6–13 remain unchanged:</strong> Conversion Gap, Methodologies, Project Creation, Multilingual, Recruitment, Engagement, Security, Reporting & Analytics, Clients.
                </p>
              </div>

              <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-border -mx-6 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Ready to deploy?</p>
                  <p className="text-xs text-muted-foreground">
                    Branch: <code className="bg-muted/30 px-1.5 py-0.5 rounded" style={{ color: "hsl(86, 18%, 43%)" }}>{generated.branchName}</code>
                  </p>
                </div>
                <button
                  onClick={handleDeploy}
                  className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <GitBranch className="w-4 h-4" />
                  Create Branch & Deploy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Deploy */}
        {step === 3 && generated && (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "hsl(86, 18%, 90%)" }}>
              <Check className="w-8 h-8" style={{ color: "hsl(86, 18%, 43%)" }} />
            </div>
            <h2 className="text-3xl mb-3">
              Deck <em>Deployed</em>
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              The personalized deck for {form.brandName || form.companyName} has been created on branch{" "}
              <code className="bg-muted/30 px-1.5 py-0.5 rounded" style={{ color: "hsl(86, 18%, 43%)" }}>
                {generated.branchName}
              </code>
              .
            </p>

            <div className="bg-white rounded-xl border border-border p-6 text-left space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Branch</span>
                <code className="text-sm font-medium">{generated.branchName}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vercel URL</span>
                <span className="text-sm font-medium flex items-center gap-1" style={{ color: "hsl(86, 18%, 43%)" }}>
                  proposal-deck-{generated.branchName}.vercel.app <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Custom domain</span>
                <span className="text-sm text-muted-foreground">{generated.branchName}.deck.askyazi.com</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setStep(0);
                  setGenerated(null);
                  setForm({ companyName: "", brandName: "", industry: "", context: "" });
                  setLogoPreview(null);
                }}
                className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-white transition-colors"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
