import { useState, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryData {
  name: string;
  flag: string;
  users: string;
  useCase?: string;
}

// Uses ISO 3166-1 numeric codes (world-atlas format)
const whatsappData: Record<string, CountryData> = {
  // Americas
  "076": { name: "Brazil", flag: "🇧🇷", users: "95K", useCase: "Consumer insights & retail research" },
  "484": { name: "Mexico", flag: "🇲🇽", users: "65K", useCase: "Brand perception tracking" },
  "170": { name: "Colombia", flag: "🇨🇴", users: "30K", useCase: "Agricultural supply chain" },
  "032": { name: "Argentina", flag: "🇦🇷", users: "28K", useCase: "Media consumption habits" },
  "604": { name: "Peru", flag: "🇵🇪", users: "15K", useCase: "Mining sector engagement" },
  "152": { name: "Chile", flag: "🇨🇱", users: "12K", useCase: "Retail experience research" },
  "218": { name: "Ecuador", flag: "🇪🇨", users: "8K", useCase: "Agricultural export studies" },
  "068": { name: "Bolivia", flag: "🇧🇴", users: "5K", useCase: "Rural connectivity research" },
  "862": { name: "Venezuela", flag: "🇻🇪", users: "9K", useCase: "Diaspora communication" },
  "320": { name: "Guatemala", flag: "🇬🇹", users: "6K", useCase: "Remittance behaviour" },
  "340": { name: "Honduras", flag: "🇭🇳", users: "4K", useCase: "Coffee trade research" },
  "188": { name: "Costa Rica", flag: "🇨🇷", users: "3K", useCase: "Ecotourism studies" },
  "591": { name: "Panama", flag: "🇵🇦", users: "2K", useCase: "Logistics & trade" },
  "600": { name: "Paraguay", flag: "🇵🇾", users: "4K", useCase: "Agricultural insights" },
  "858": { name: "Uruguay", flag: "🇺🇾", users: "2K", useCase: "Digital banking adoption" },
  "214": { name: "Dominican Republic", flag: "🇩🇴", users: "5K", useCase: "Tourism feedback" },
  "840": { name: "United States", flag: "🇺🇸", users: "120K", useCase: "Consumer & UX research" },
  // Asia
  "356": { name: "India", flag: "🇮🇳", users: "170K", useCase: "Rural healthcare & FMCG studies" },
  "360": { name: "Indonesia", flag: "🇮🇩", users: "85K", useCase: "Financial inclusion research" },
  "586": { name: "Pakistan", flag: "🇵🇰", users: "40K", useCase: "Education technology" },
  "608": { name: "Philippines", flag: "🇵🇭", users: "18K", useCase: "Remote work studies" },
  "458": { name: "Malaysia", flag: "🇲🇾", users: "20K", useCase: "Multicultural consumer research" },
  "784": { name: "UAE", flag: "🇦🇪", users: "8K", useCase: "Luxury brand perception" },
  "682": { name: "Saudi Arabia", flag: "🇸🇦", users: "22K", useCase: "Digital government services" },
  "792": { name: "Türkiye", flag: "🇹🇷", users: "25K", useCase: "E-commerce behaviour" },
  "050": { name: "Bangladesh", flag: "🇧🇩", users: "32K", useCase: "Garment industry insights" },
  "704": { name: "Vietnam", flag: "🇻🇳", users: "10K", useCase: "Manufacturing supply chain" },
  "764": { name: "Thailand", flag: "🇹🇭", users: "12K", useCase: "Tourism satisfaction" },
  "368": { name: "Iraq", flag: "🇮🇶", users: "14K", useCase: "Telecom adoption" },
  "400": { name: "Jordan", flag: "🇯🇴", users: "4K", useCase: "Refugee community research" },
  "524": { name: "Nepal", flag: "🇳🇵", users: "9K", useCase: "Remittance behaviour" },
  "144": { name: "Sri Lanka", flag: "🇱🇰", users: "6K", useCase: "Tea industry research" },
  "104": { name: "Myanmar", flag: "🇲🇲", users: "8K", useCase: "Mobile-first commerce" },
  "116": { name: "Cambodia", flag: "🇰🇭", users: "5K", useCase: "Microfinance adoption" },
  "414": { name: "Kuwait", flag: "🇰🇼", users: "3K", useCase: "Oil & gas workforce" },
  "512": { name: "Oman", flag: "🇴🇲", users: "2K", useCase: "Smart city research" },
  "634": { name: "Qatar", flag: "🇶🇦", users: "2K", useCase: "Sports event engagement" },
  "422": { name: "Lebanon", flag: "🇱🇧", users: "3K", useCase: "Banking sector insights" },
  // Europe
  "276": { name: "Germany", flag: "🇩🇪", users: "45K", useCase: "Automotive UX research" },
  "826": { name: "United Kingdom", flag: "🇬🇧", users: "150K", useCase: "Healthcare patient diaries" },
  "724": { name: "Spain", flag: "🇪🇸", users: "28K", useCase: "Tourism experience mapping" },
  "380": { name: "Italy", flag: "🇮🇹", users: "27K", useCase: "Food & beverage insights" },
  "250": { name: "France", flag: "🇫🇷", users: "24K", useCase: "Luxury goods research" },
  "528": { name: "Netherlands", flag: "🇳🇱", users: "11K", useCase: "Sustainability studies" },
  "620": { name: "Portugal", flag: "🇵🇹", users: "6K", useCase: "Digital nomad research" },
  "756": { name: "Switzerland", flag: "🇨🇭", users: "5K", useCase: "Pharma patient insights" },
  "040": { name: "Austria", flag: "🇦🇹", users: "5K", useCase: "Tourism UX" },
  "056": { name: "Belgium", flag: "🇧🇪", users: "6K", useCase: "EU policy research" },
  "616": { name: "Poland", flag: "🇵🇱", users: "12K", useCase: "Tech workforce studies" },
  "642": { name: "Romania", flag: "🇷🇴", users: "8K", useCase: "IT outsourcing insights" },
  "300": { name: "Greece", flag: "🇬🇷", users: "5K", useCase: "Tourism recovery research" },
  "203": { name: "Czechia", flag: "🇨🇿", users: "4K", useCase: "Automotive supply chain" },
  "348": { name: "Hungary", flag: "🇭🇺", users: "3K", useCase: "Manufacturing insights" },
  "752": { name: "Sweden", flag: "🇸🇪", users: "5K", useCase: "Green energy research" },
  "578": { name: "Norway", flag: "🇳🇴", users: "3K", useCase: "Maritime industry" },
  "246": { name: "Finland", flag: "🇫🇮", users: "3K", useCase: "EdTech adoption" },
  "372": { name: "Ireland", flag: "🇮🇪", users: "3K", useCase: "Pharma industry research" },
  // Africa
  "566": { name: "Nigeria", flag: "🇳🇬", users: "110K", useCase: "Fintech adoption studies" },
  "710": { name: "South Africa", flag: "🇿🇦", users: "80K", useCase: "Youth market research" },
  "818": { name: "Egypt", flag: "🇪🇬", users: "45K", useCase: "Telecom satisfaction" },
  "404": { name: "Kenya", flag: "🇰🇪", users: "55K", useCase: "Mobile money research" },
  "288": { name: "Ghana", flag: "🇬🇭", users: "18K", useCase: "Agritech adoption" },
  "834": { name: "Tanzania", flag: "🇹🇿", users: "15K", useCase: "Healthcare access studies" },
  "504": { name: "Morocco", flag: "🇲🇦", users: "20K", useCase: "Automotive market research" },
  "800": { name: "Uganda", flag: "🇺🇬", users: "10K", useCase: "Microfinance engagement" },
  "180": { name: "DR Congo", flag: "🇨🇩", users: "6K", useCase: "Humanitarian comms research" },
  "508": { name: "Mozambique", flag: "🇲🇿", users: "4K", useCase: "Energy access studies" },
  "024": { name: "Angola", flag: "🇦🇴", users: "5K", useCase: "Oil sector workforce" },
  "012": { name: "Algeria", flag: "🇩🇿", users: "12K", useCase: "Youth employment studies" },
  "706": { name: "Somalia", flag: "🇸🇴", users: "3K", useCase: "Remittance flows" },
  "646": { name: "Rwanda", flag: "🇷🇼", users: "4K", useCase: "Digital government" },
  "384": { name: "Ivory Coast", flag: "🇨🇮", users: "6K", useCase: "Cocoa trade research" },
  "854": { name: "Burkina Faso", flag: "🇧🇫", users: "2K", useCase: "Agricultural resilience" },
  "562": { name: "Niger", flag: "🇳🇪", users: "1K", useCase: "Climate adaptation studies" },
  "894": { name: "Zambia", flag: "🇿🇲", users: "3K", useCase: "Mining community research" },
  "716": { name: "Zimbabwe", flag: "🇿🇼", users: "3K", useCase: "Agricultural market access" },
  "148": { name: "Chad", flag: "🇹🇩", users: "1K", useCase: "Humanitarian research" },
  "231": { name: "Ethiopia", flag: "🇪🇹", users: "8K", useCase: "Coffee supply chain" },
  "729": { name: "Sudan", flag: "🇸🇩", users: "6K", useCase: "Aid distribution research" },
  "788": { name: "Tunisia", flag: "🇹🇳", users: "5K", useCase: "Startup ecosystem studies" },
  "450": { name: "Madagascar", flag: "🇲🇬", users: "2K", useCase: "Biodiversity research" },
  "466": { name: "Mali", flag: "🇲🇱", users: "2K", useCase: "Agricultural development" },
  "686": { name: "Senegal", flag: "🇸🇳", users: "5K", useCase: "Digital payments research" },
  "120": { name: "Cameroon", flag: "🇨🇲", users: "4K", useCase: "Telecom market insights" },
};

const InteractiveWorldMap = () => {
  const [tooltip, setTooltip] = useState<{
    data: CountryData;
    x: number;
    y: number;
  } | null>(null);

  const handleInteraction = (
    geo: any,
    event: React.MouseEvent | React.TouchEvent
  ) => {
    const iso = geo.id;
    const data = whatsappData[iso];
    if (data) {
      const rect = (event.currentTarget as HTMLElement)
        .closest(".map-container")
        ?.getBoundingClientRect();
      const clientX =
        "touches" in event ? event.touches[0]?.clientX ?? 0 : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0]?.clientY ?? 0 : event.clientY;
      setTooltip({
        data,
        x: clientX - (rect?.left ?? 0),
        y: clientY - (rect?.top ?? 0),
      });
    }
  };

  const isHighlighted = (id: string) => id in whatsappData;

  return (
    <div
      className="map-container relative w-full h-full select-none"
      onMouseLeave={() => setTooltip(null)}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [10, 20],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[10, 20]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = geo.id;
                const active = isHighlighted(id);
                return (
                  <Geography
                    key={geo.rpiKey || geo.id}
                    geography={geo}
                    onMouseEnter={(e) => handleInteraction(geo, e)}
                    onMouseMove={(e) => {
                      if (active) handleInteraction(geo, e);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (active) {
                        handleInteraction(geo, e);
                      }
                    }}
                    style={{
                      default: {
                        fill: active ? "#70815A" : "hsl(36, 30%, 90%)",
                        stroke: "hsl(36, 30%, 85%)",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "fill 150ms ease-in-out",
                      },
                      hover: {
                        fill: active ? "#8A9B6E" : "hsl(36, 30%, 87%)",
                        stroke: "hsl(36, 30%, 80%)",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: active ? "pointer" : "default",
                      },
                      pressed: {
                        fill: active ? "#5A6B48" : "hsl(36, 30%, 90%)",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -110%)",
            animation: "tooltipFadeIn 150ms ease-in-out",
          }}
        >
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-lg px-4 py-3 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{tooltip.data.flag}</span>
              <span className="font-sans font-semibold text-sm text-foreground">
                {tooltip.data.name}
              </span>
            </div>
            <p className="font-sans text-xs text-muted-foreground mb-1">
              <span className="font-semibold text-foreground">
                {tooltip.data.users}
              </span>{" "}
              panellists
            </p>
            {tooltip.data.useCase && (
              <p className="font-sans text-xs text-muted-foreground italic">
                {tooltip.data.useCase}
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translate(-50%, -100%); }
          to { opacity: 1; transform: translate(-50%, -110%); }
        }
      `}</style>
    </div>
  );
};

export default memo(InteractiveWorldMap);
