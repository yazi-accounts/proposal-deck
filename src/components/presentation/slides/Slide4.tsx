import { motion } from "framer-motion";
import { stagger, fadeUp } from "../animations";
import TabSection from "../TabSection";

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="feature-item">
        <span className="feature-dot" />
        <span className="slide-body">{item}</span>
      </li>
    ))}
  </ul>
);

const Slide4 = () => (
  <motion.div
    className="flex flex-col justify-center h-full px-4 md:px-16 lg:px-24 max-w-5xl mx-auto overflow-hidden"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={fadeUp}>
      <p className="slide-label mb-4">Participants</p>
    </motion.div>
    <motion.div variants={fadeUp}>
      <h2 className="slide-subheadline mb-10">
        Two ways to reach<br />
        <span className="italic">respondents.</span>
      </h2>
    </motion.div>
    <motion.div variants={fadeUp}>
      <TabSection
        layoutId="participants-toggle"
        tabs={[
          {
            label: "Your Customers",
            content: (
              <div>
                <p className="slide-body font-medium text-foreground mb-4">Research your own customers</p>
                <FeatureList items={["Upload customer lists", "Re-contact and track over time"]} />
              </div>
            ),
          },
          {
            label: "Global Panel",
            content: (
              <div>
                <p className="slide-body font-medium text-foreground mb-4">Reach 5M+ global participants</p>
                <FeatureList items={["Country + city targeting", "Demographic filters — age, gender, income"]} />
              </div>
            ),
          },
        ]}
      />
    </motion.div>
  </motion.div>
);

export default Slide4;
