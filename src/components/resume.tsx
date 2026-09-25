import type { ReactNode } from "react";

const sectionTitle =
  "text-left font-tanker md:text-[48px] text-[30px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase";

const entryTitle =
  "text-left font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white md:font-tanker md:text-[24px] md:leading-[1.2]";

const bodyText =
  "text-left font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-[#D5D2CC]";

const dateText =
  "text-left font-bespoke text-[18px] leading-[1.5] font-medium tracking-normal text-[#8C8A87]";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 text-left md:flex-row md:justify-between md:gap-16">
      <h2 className={`${sectionTitle} md:max-w-[420px]`}>{title}</h2>
      <div className="flex w-full flex-col gap-8 md:max-w-[640px]">{children}</div>
    </section>
  );
}

function Entry({
  title,
  date,
  paragraphs,
}: {
  title: string;
  date?: string;
  paragraphs?: string[];
}) {
  return (
    <div className="flex flex-col gap-3 text-left">
      <h3 className={entryTitle}>{title}</h3>
      {date ? <p className={dateText}>{date}</p> : null}
      {paragraphs?.map((paragraph) => (
        <p key={paragraph} className={bodyText}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function Resume() {
  return (
    <div className="flex w-full flex-col gap-8 md:gap-20">
      <div className="flex gap-4 flex-col items-start text-left md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-tanker md:text-[60px] text-[30px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
            Yinka Jayeola
          </h2>
          <p className="font-bespoke md:text-[20px] text-[16px] leading-[1.5] font-normal tracking-normal text-[#D5D2CC]">
            UI/UX Designer
          </p>
        </div>
        <div className="flex flex-col font-bespoke text-[20px] leading-[1.5] font-normal tracking-normal text-[#8C8A87] md:text-right">
          <a href="mailto:yinka@jayintop.com">yinka@jayintop.com</a>
          <a
            href="https://linkedin.com/in/jayintop"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/jayintop
          </a>
          <a href="tel:+2348137645364">+2348137645364</a>
        </div>
      </div>

      <Section title="Bio">
        <p className={bodyText}>
          Dynamic Senior Product Designer with 6+ years of experience delivering
          user-centred enterprise solutions in fintech, govtech, healthtech, and
          e-commerce for clients across the UK, USA, Australia, and Nigeria.
          Expert in end-to-end product design (100–1,600+ screen scopes), design
          systems, marketplace/payment flows, and brand identity. Founder of
          Jayintop Studio, a productized design agency focused on scalable UI/UX
          and branding services that drive conversion improvements (e.g., 35%+
          uplift) and support multi-million USD operations. Passionate about
          human-centred design that creates seamless, profitable experiences.
          Open to senior/lead roles in innovative global teams.
        </p>
      </Section>

      <Section title="Education">
        <Entry
          title="OBAFEMI AWOLOWO UNIVERSITY"
          date="2013 – 2020"
          paragraphs={["Bsc. Chemical Engineering"]}
        />
      </Section>

      <Section title="Experience">
        <Entry
          title="FOUNDER & CREATIVE DIRECTOR, JAYINTOP STUDIO"
          date="01/2025 – Present · Nigeria (Remote Global)"
          paragraphs={[
            "Founded and scaled a productized design agency offering streamlined services in brand identity, UI/UX audits, website design, social media kits, marketing collateral, and full product development.",
            "Delivered 25+ projects for international startups and enterprises, including enterprise dashboards and brand systems, fostering repeat business and portfolio growth in fintech/e-commerce.",
            "Led end-to-end strategy, operations, and client delivery, emphasizing agile workflows and accessibility (WCAG AA) to enhance user engagement and business outcomes.",
          ]}
        />
        <Entry
          title="Senior Product Design Lead (Contract), FixMyBuild (UK)"
          date="01/2022 – 12/2023 · UK (Remote)"
          paragraphs={[
            "Sole designer for a two-sided home-services marketplace; shipped v1.0 (120+ screens) from pre-seed to 10k+ downloads.",
            "Owned onboarding, quote engine, real-time chat, Stripe escrow payments, and trust/safety features; drove 35% faster quote-to-booking conversion via 60+ user interviews and usability testing.",
          ]}
        />
        <Entry
          title="Senior Product & Brand Identity Designer, Upwork, PeoplePerHour & Fiverr"
          date="01/2021 – Present · Global (Remote)"
          paragraphs={[
            "Top 0.1% rated across platforms; executed $15k–$80k contracts in brand identity, SaaS redesigns, and fintech dashboards for UK/US/EU clients.",
            "Shipped 200+ projects, including luxury branding and e-commerce platforms, earning 5-star reviews for strategic depth, rapid iteration, and client-focused outcomes.",
          ]}
        />
        <Entry
          title="SENIOR DESIGN LEAD (CONTRACT), FROSTFLOW FOODS"
          date="01/2025 – Present · Nigeria (Remote Global)"
          paragraphs={[
            "Leading design of a three-sided frozen-food e-commerce ecosystem (consumer, wholesale, retailer portals), owning unified design system, subscription flows, bulk ordering, and checkout optimization across web/mobile.",
            "Collaborated with UK founders on remote sprints, conducting UX research to ensure WCAG AA compatibility, mobile responsiveness, and 25%+ conversion uplift in high-order-value experiences.",
          ]}
        />
        <Entry
          title="Senior Product Designer / Design Lead, ThoughtCab Design Agency"
          date="12/2021 – 12/2024 · United State (Remote)"
          paragraphs={[
            "Led UI/UX for high-growth startups in fintech, healthtech, and edtech; owned 100–400+ screen scopes, mentoring 12+ juniors and delivering Root Diamonds, Coral Health, and Root Ally platforms.",
            "Ensured seamless developer handoff, accessibility compliance, and iterative improvements based on analytics, contributing to live deployments with enhanced user retention.",
          ]}
        />
        <Entry
          title="DESIGN LEAD, THOUGHTCAB DESIGN AGENCY"
          date="12/2021 – 12/2024 · United State (Remote)"
          paragraphs={[
            "Led UI/UX for high-growth startups in fintech, healthtech, and edtech; owned 100–400+ screen scopes, mentoring 12+ juniors and delivering Root Diamonds, Coral Health, and Root Ally platforms.",
            "Ensured seamless developer handoff, accessibility compliance, and iterative improvements based on analytics, contributing to live deployments with enhanced user retention.",
          ]}
        />
      </Section>

      <Section title="Skill">
        <Entry
          title="RESEARCH"
          paragraphs={[
            "User Research · Journey Mapping · Heuristic Evaluations · Accessibility Audits (WCAG 2.2+) · Information Architecture · Usability Testing",
          ]}
        />
        <Entry
          title="CORE DESIGN"
          paragraphs={[
            "Product Design · UI/UX Design · Design Systems · Interaction Design · Brand Identity · Creative Direction",
          ]}
        />
        <Entry
          title="UI/UX TOOLS"
          paragraphs={[
            "Figma (Expert) · Framer · Adobe Suite · After Effects · Miro · FigJam · Webflow · Penpot · Notion · Jira",
          ]}
        />
        <Entry
          title="SOFT SKILLS"
          paragraphs={[
            "· Critical Thinker · Analytical Reasoning · Remote Leadership · Attention to Detail · Receptive to Feedback · Problem Solver · Excellent Written Communication · Consistent & Honest Judgment · Empathetic",
          ]}
        />
      </Section>

      <Section title="Certificates & training">
        <Entry title="GOOGLE UX DESIGN CERTIFICATE" date="12/01/2025" />
        <Entry title="MASTER DIGITAL PRODUCT DESIGN, UDEMY" date="12/01/2025" />
        <Entry title="ULTIMATE FIGMA MASTERCLASS, DESIGNERSHIP" date="12/01/2025" />
        <Entry title="FOUNDATIONS OF UX DESIGN, COURSERA" date="12/01/2025" />
        <Entry title="MASTER DIGITAL PRODUCT DESIGN, UDEMY" date="12/01/2025" />
        <Entry title="PROMPT ENGINEERING FOR EVERYONE, COURSERA" date="12/01/2025" />
        <Entry title="TECHNICAL WRITING FUNDAMENTALS, GOOGLE" date="12/01/2025" />
        <Entry
          title="AI FOR EVERYONE, ANDREW NG / COURSERA"
          date="12/01/2025"
        />
        <Entry title="ENGLISH" paragraphs={["Native/Bilingual"]} />
        <Entry title="YORUBA" paragraphs={["Native/Bilingual"]} />
      </Section>
    </div>
  );
}
