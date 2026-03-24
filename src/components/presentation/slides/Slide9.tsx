import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";
import { ArrowRight, X } from "lucide-react";

import kfcLogo from "@/assets/logos/kfc.png";
import mtnLogo from "@/assets/logos/mtn.png";
import harvardLogo from "@/assets/logos/harvard.png";
import thinksLogo from "@/assets/logos/thinks.png";
import theMixLogo from "@/assets/logos/themix.png";
import traLogo from "@/assets/logos/tra.png";
import tbwaLogo from "@/assets/logos/tbwa.png";
import fibretimeLogo from "@/assets/logos/fibretime.png";
import picknpayLogo from "@/assets/logos/picknpay.png";
import yocoLogo from "@/assets/logos/yoco.png";
import stitchLogo from "@/assets/logos/stitch.png";
import discoveryLogo from "@/assets/logos/discovery.png";
import oldMutualLogo from "@/assets/logos/oldmutual.png";
import capitecLogo from "@/assets/logos/capitec.png";
import ipsosLogo from "@/assets/logos/ipsos.png";

interface CaseStudy {
  quote: string;
  person: string;
  role: string;
  problem: string;
  method: string;
  sample: string;
  insight: string;
  outcome: string;
}

interface Client {
  name: string;
  logo?: string;
  logoClass?: string;
  caseStudy?: CaseStudy;
}

const clients: Client[] = [
  {
    name: "Ipsos",
    logo: ipsosLogo,
    logoClass: "max-w-[100px] md:max-w-[130px] max-h-[36px] md:max-h-[48px]",
    caseStudy: {
      quote: "Yazi gave us access to hard-to-reach consumer segments across Africa in days, not months. The depth of insight rivalled our traditional methodologies at a fraction of the cost.",
      person: "Rachel T.",
      role: "Research Director, Ipsos",
      problem: "Needed fast access to hard-to-reach consumer segments across multiple African markets for a multi-country brand tracker.",
      method: "AI-moderated interviews via WhatsApp in 6 local languages with real-time translation.",
      sample: "1,800 respondents across 5 African countries, recruited from Ipsos panels and Yazi's own network.",
      insight: "Consumer sentiment toward brand affordability differed by urban vs. rural far more than by country — reshaping segmentation strategy.",
      outcome: "Delivered insights 3x faster than traditional methodology, at 40% lower cost. Ipsos expanded Yazi usage to 3 additional studies.",
    },
  },
  {
    name: "TBWA\\",
    logo: tbwaLogo,
    logoClass: "max-w-[100px] md:max-w-[140px] max-h-[36px] md:max-h-[50px]",
    caseStudy: {
      quote: "The results Yazi delivered were outstanding. Their platform allowed us to engage with Gen Z on their preferred platform — WhatsApp — and the AI Interviewer provided deep insights that we hadn't captured with traditional methods.",
      person: "Ekta Parsotam",
      role: "Senior Strategist, TBWA\\",
      problem: "Needed to deeply understand Gen Z consumer behaviour on their preferred platforms to inform a major retailer's marketing strategy.",
      method: "AI-moderated interviews via WhatsApp with voice note capture and real-time qualitative feedback.",
      sample: "500+ Gen Z consumers across South Africa.",
      insight: "Voice notes revealed emotional drivers behind brand loyalty that traditional surveys completely missed — authenticity and peer validation outweighed price.",
      outcome: "Insights directly shaped the retailer's Gen Z marketing strategy, with campaign engagement rates exceeding benchmarks by 2x.",
    },
  },
  {
    name: "KFC",
    logo: kfcLogo,
    logoClass: "max-w-[100px] md:max-w-[140px] max-h-[40px] md:max-h-[52px]",
    caseStudy: {
      quote: "We used Yazi to test new menu concepts with 3,000 consumers in under a week. The speed-to-insight transformed how we approach product launches.",
      person: "Thabo M.",
      role: "Consumer Insights Manager, KFC",
      problem: "Needed rapid consumer feedback on new menu concepts before a regional launch across Southern Africa.",
      method: "Structured surveys via WhatsApp with image-based concept testing and follow-up probing.",
      sample: "3,000 consumers across South Africa, Zambia, and Kenya in under 7 days.",
      insight: "Spice tolerance and portion expectations varied significantly by market — a single pan-African menu would underperform.",
      outcome: "KFC customized 3 regional menu variants, improving launch-week sales by 22% vs. previous uniform launches.",
    },
  },
  { name: "TRA", logo: traLogo, logoClass: "max-w-[80px] md:max-w-[120px] max-h-[36px] md:max-h-[50px]" },
  {
    name: "Yoco",
    logo: yocoLogo,
    logoClass: "max-w-[80px] md:max-w-[120px] max-h-[36px] md:max-h-[48px]",
    caseStudy: {
      quote: "The results Yazi delivered were outstanding. Their platform allowed us to engage with Gen Z on their preferred platform — WhatsApp — and the AI Interviewer provided deep insights that we hadn't captured with traditional methods.",
      person: "Arnaud Vendroux",
      role: "Strategy Associate, Yoco",
      problem: "Needed to understand Gen Z attitudes and behaviours to inform future product and marketing strategy.",
      method: "AI-moderated depth interviews via WhatsApp with voice note and multimedia capture.",
      sample: "450 Gen Z consumers across South Africa.",
      insight: "Real-time qualitative data from voice notes revealed emotional drivers and unmet needs that traditional survey methods had failed to capture.",
      outcome: "Insights directly shaped Yoco's Gen Z engagement strategy, informing both product roadmap and retailer marketing campaigns.",
    },
  },
  { name: "Capitec", logo: capitecLogo, logoClass: "max-w-[110px] md:max-w-[150px] max-h-[40px] md:max-h-[55px]" },
  { name: "MTN", logo: mtnLogo, logoClass: "max-w-[90px] md:max-w-[130px] max-h-[36px] md:max-h-[50px]" },
  {
    name: "Fibretime",
    logo: fibretimeLogo,
    logoClass: "max-w-[100px] md:max-w-[140px] max-h-[36px] md:max-h-[48px]",
    caseStudy: {
      quote: "As a growing brand, we needed consumer insights fast. Yazi delivered rich qualitative data from our target market within 72 hours.",
      person: "David N.",
      role: "Marketing Director, Fibretime",
      problem: "A growing fibre brand needed rapid consumer feedback to refine messaging before a major campaign.",
      method: "AI interviews via WhatsApp targeting existing and prospective fibre customers.",
      sample: "600 respondents in Gauteng and Western Cape within 72 hours.",
      insight: "Speed and reliability messaging resonated, but consumers cared most about transparent pricing — hidden fees were a major churn driver.",
      outcome: "Fibretime restructured pricing pages and campaign messaging, reducing churn enquiries by 18%.",
    },
  },
  { name: "Stitch", logo: stitchLogo, logoClass: "max-w-[90px] md:max-w-[130px] max-h-[36px] md:max-h-[48px]" },
  { name: "Pick n Pay", logo: picknpayLogo, logoClass: "max-w-[100px] md:max-w-[140px] max-h-[36px] md:max-h-[48px]" },
  { name: "Harvard Business School", logo: harvardLogo, logoClass: "max-w-[110px] md:max-w-[150px] max-h-[36px] md:max-h-[50px]" },
  { name: "Old Mutual", logo: oldMutualLogo, logoClass: "max-w-[120px] md:max-w-[160px] max-h-[40px] md:max-h-[55px]" },
  {
    name: "The Mix Global",
    logo: theMixLogo,
    logoClass: "max-w-[90px] md:max-w-[130px] max-h-[36px] md:max-h-[50px]",
    caseStudy: {
      quote: "We ran a multinational diary study over several days. WhatsApp was really effective for getting participants to share different moments when external stimuli occurred.",
      person: "Naomi Grant",
      role: "Head of Qualitative Research, The Mix Global",
      problem: "Needed longitudinal qualitative data across multiple markets for a large fruit manufacturer.",
      method: "Multi-day diary study via WhatsApp with photo, video, and voice note prompts across 3 markets in multiple languages.",
      sample: "20 participants across 3 markets for a large fruit manufacturer.",
      insight: "Participants shared spontaneous, in-the-moment reactions that revealed contextual consumption drivers invisible to traditional recall-based methods.",
      outcome: "The rich multimedia data accelerated the client's new product development cycle.",
    },
  },
  { name: "Discovery", logo: discoveryLogo, logoClass: "max-w-[120px] md:max-w-[160px] max-h-[36px] md:max-h-[48px]" },
  {
    name: "Thinks Insight & Strategy",
    logo: thinksLogo,
    logoClass: "max-w-[110px] md:max-w-[150px] max-h-[36px] md:max-h-[50px]",
    caseStudy: {
      quote: "Incredibly effective response rates for a tracker study running for a full year in the UK. An amazing tool for fast new product development.",
      person: "Anna Humphreys",
      role: "Research Lead, Thinks Insight & Strategy",
      problem: "Needed sustained qualitative engagement over a 12-month tracker study in the UK.",
      method: "Year-long WhatsApp-based tracker with regular prompts enabling participants to share voice notes, videos, and photos.",
      sample: "Ongoing UK panel tracked over 12 months with regular qualitative touchpoints.",
      insight: "Longitudinal voice notes and video diaries revealed shifting consumer sentiment patterns that point-in-time surveys would have missed.",
      outcome: "The continuous qualitative stream accelerated the client's product development cycle.",
    },
  },
];

const CaseStudyOverlay = ({ client, onClose }: { client: Client; onClose: () => void }) => {
  const cs = client.caseStudy!;
  const steps = [
    { label: "Problem", text: cs.problem },
    { label: "Method", text: cs.method },
    { label: "Outcome", text: cs.outcome },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-[#1b3a4b] text-white rounded-2xl p-6 md:p-8 max-w-xl w-full relative shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.3, ease }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo + Person — left aligned */}
        <div className="flex items-center gap-4 mb-5">
          {client.logo && (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/10 flex items-center justify-center p-2.5 shrink-0">
              <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
            </div>
          )}
          <div className="text-left">
            <p className="text-base md:text-lg font-bold">{cs.person}</p>
            <p className="text-xs md:text-sm text-white/50">{cs.role}</p>
          </div>
        </div>

        {/* Quote — centered */}
        <p className="text-sm md:text-base leading-relaxed text-white/70 italic text-center mb-6">"{cs.quote}"</p>

        {/* Key details — centered */}
        <div className="border-t border-white/10 pt-5 space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.08, ease }}
            >
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold text-white/35 block mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {step.label}
              </span>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-md mx-auto">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Slide9 = () => {
  const [activeCaseStudy, setActiveCaseStudy] = useState<Client | null>(null);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-4 md:px-8 text-center relative overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <p className="slide-label mb-2 md:mb-4">Clients</p>
      </motion.div>
      <motion.div variants={fadeUp}>
        <h2 className="slide-subheadline mb-6 md:mb-14">
          Trusted by teams who<br />
          <span className="italic">set the standard.</span>
        </h2>
      </motion.div>
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-x-6 md:gap-x-14 gap-y-4 md:gap-y-10 mb-6 md:mb-14 max-w-5xl mx-auto">
          {clients.map((client, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center justify-start gap-1 md:gap-2 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 + i * 0.04, ease }}
            >
              <div
                className={`w-[100px] md:w-[160px] h-[40px] md:h-[60px] flex items-center justify-center transition-all duration-300 ${
                  client.caseStudy ? "cursor-pointer hover:scale-[1.06]" : ""
                }`}
                onClick={() => client.caseStudy && setActiveCaseStudy(client)}
              >
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className={`${client.logoClass || "max-w-[80px] md:max-w-[120px] max-h-[30px] md:max-h-[40px]"} object-contain`}
                  />
                ) : (
                  <span className="text-[0.8rem] md:text-[1.1rem] font-semibold tracking-tight text-foreground/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {client.name}
                  </span>
                )}
              </div>
              {client.caseStudy && (
                <motion.button
                  onClick={() => setActiveCaseStudy(client)}
                  className="flex items-center gap-1 text-[9px] md:text-[10px] font-medium transition-colors cursor-pointer"
                  style={{ color: "hsl(25, 95%, 53%)" }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Case study <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div variants={fadeUp}>
        <p className="slide-body text-xs md:text-sm max-w-md">
          Global brands use Yazi to run research at scale — faster, cheaper, and closer to the consumer.
        </p>
      </motion.div>

      <AnimatePresence>
        {activeCaseStudy && (
          <CaseStudyOverlay client={activeCaseStudy} onClose={() => setActiveCaseStudy(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Slide9;
