/**
 * Editable site content — schema registry.
 *
 * Every static block on the public website is declared here once: the fields it
 * exposes to the admin panel, and the copy the site ships with. The admin
 * "Content" section renders its forms directly from this registry, so adding a
 * new editable block anywhere on the site is a matter of adding an entry here —
 * no new admin page, form or server action required.
 *
 * Values are stored in `public.site_content` keyed by (page_key, block_key).
 * A missing row means "never edited", and the `defaults` below are used, so the
 * site always renders even with an empty database.
 */

export type SimpleFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "file"
  | "url"
  | "boolean"
  | "number";

export type SimpleField = {
  name: string;
  label: string;
  type: SimpleFieldType;
  help?: string;
};

export type ListField = {
  name: string;
  label: string;
  type: "list";
  /** Singular noun used for the "Add ..." button, e.g. "slide". */
  itemNoun: string;
  /** Field on each item used as the row title in the admin UI. */
  titleField: string;
  fields: SimpleField[];
  help?: string;
};

export type Field = SimpleField | ListField;

export type ContentBlock = {
  key: string;
  label: string;
  description?: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};

export type ContentPage = {
  key: string;
  label: string;
  /** Public path, used for the "View page" link in the admin UI. */
  path: string;
  description?: string;
  blocks: ContentBlock[];
};

export function isListField(field: Field): field is ListField {
  return field.type === "list";
}

/** Shared shape for the dark page banner every inner page opens with. */
const pageHero = (
  eyebrow: string,
  heading: string,
  body?: string
): ContentBlock => ({
  key: "hero",
  label: "Page header",
  description: "The dark banner at the top of the page.",
  fields: [
    { name: "eyebrow", label: "Eyebrow", type: "text" },
    { name: "heading", label: "Heading", type: "textarea" },
    ...(body === undefined
      ? []
      : [
          {
            name: "body",
            label: "Intro paragraph",
            type: "textarea" as const,
          },
        ]),
  ],
  defaults: body === undefined ? { eyebrow, heading } : { eyebrow, heading, body },
});

export const CONTENT_PAGES: ContentPage[] = [
  // -------------------------------------------------------------------------
  {
    key: "global",
    label: "Global",
    path: "/",
    description: "Shown on every page of the website.",
    blocks: [
      {
        key: "footer",
        label: "Footer",
        fields: [
          { name: "blurb", label: "Footer description", type: "textarea" },
          {
            name: "newsletterHeading",
            label: "Newsletter heading",
            type: "text",
          },
          { name: "newsletterBody", label: "Newsletter blurb", type: "text" },
          { name: "copyright", label: "Copyright line", type: "text" },
        ],
        defaults: {
          blurb:
            "TPi is a national NGO advancing inclusive urban transformation, poverty reduction and climate resilience across Tanzania.",
          newsletterHeading: "Stay informed",
          newsletterBody:
            "Get our latest reports, insights and news in your inbox.",
          copyright: "TPi Tanzania. All rights reserved.",
        },
      },
      {
        key: "social",
        label: "Social links",
        description: "Leave a field empty to hide that icon.",
        fields: [
          { name: "linkedin", label: "LinkedIn URL", type: "url" },
          { name: "twitter", label: "X / Twitter URL", type: "url" },
          { name: "facebook", label: "Facebook URL", type: "url" },
          { name: "instagram", label: "Instagram URL", type: "url" },
          { name: "youtube", label: "YouTube URL", type: "url" },
          {
            name: "whatsapp",
            label: "WhatsApp number",
            type: "text",
            help: "International format without +, e.g. 255749778332",
          },
        ],
        defaults: {
          linkedin: "",
          twitter: "",
          facebook: "",
          instagram: "",
          youtube: "",
          whatsapp: "255749778332",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    key: "home",
    label: "Home page",
    path: "/",
    blocks: [
      {
        key: "hero",
        label: "Hero slider",
        description:
          "Full-screen photo slider at the top of the home page. Slides rotate every 6 seconds.",
        fields: [
          {
            name: "slides",
            label: "Slides",
            type: "list",
            itemNoun: "slide",
            titleField: "title",
            fields: [
              { name: "image", label: "Photo", type: "image" },
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Caption", type: "text" },
            ],
          },
        ],
        defaults: {
          slides: [
            {
              image: "/hero/inclusive-urban-transformation.jpg",
              title: "Inclusive Urban Transformation",
              description: "Cities that work for everyone.",
            },
            {
              image: "/hero/poverty-reduction.jpg",
              title: "Poverty Reduction",
              description: "Dignity and opportunity for all.",
            },
            {
              image: "/hero/climate-resilience.jpg",
              title: "Climate Resilience",
              description: "Communities ready for tomorrow.",
            },
          ],
        },
      },
      {
        key: "intro",
        label: "Our Conviction",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "body", label: "Paragraph", type: "textarea" },
          {
            name: "statement",
            label: "Large statement",
            type: "textarea",
            help: "The oversized vision sentence below the paragraph.",
          },
        ],
        defaults: {
          eyebrow: "Our Conviction",
          heading:
            "The living conditions in our urban poor communities are unacceptable.",
          body: "The narrative of poverty has shifted. Mass urban migration is outpacing infrastructure, turning cities into the new epicentres of severe marginalisation — overpopulated, underserved, and struggling to provide the basic jobs, hygiene and safety every person deserves. Through evidence-based programming, strategic partnerships and community empowerment, TPi drives inclusive, systemic change across Tanzania's cities.",
          statement:
            "We envision a future where every urban resident lives in dignity, safety, and climate resilience with equal opportunities to thrive and contribute to the nation's economy.",
        },
      },
      {
        key: "target_groups",
        label: "Who Matters to Us",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "body", label: "Sub-heading", type: "textarea" },
          {
            name: "items",
            label: "Groups",
            type: "list",
            itemNoun: "group",
            titleField: "title",
            fields: [
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "image", label: "Photo", type: "image" },
              {
                name: "icon",
                label: "Icon",
                type: "text",
                help: "One of: users, heart, accessibility, home, landmark",
              },
            ],
          },
        ],
        defaults: {
          eyebrow: "Who Matters to Us",
          heading:
            "Our work centres on people and institutions too often left out of urban planning.",
          body: "When the most excluded residents have voice and agency, cities improve for everyone.",
          items: [
            {
              title: "Residents of informal settlements",
              description:
                "Supporting people in unplanned neighbourhoods to secure services, tenure and a meaningful say in city decisions.",
              image: "/community-water-point.jpg",
              icon: "users",
            },
            {
              title: "Women and youth",
              description:
                "Creating space, skills and economic opportunities for women and young people to lead urban change.",
              image: "/women-entrepreneurs.jpg",
              icon: "heart",
            },
            {
              title: "Persons with disabilities",
              description:
                "Ensuring urban planning, services and infrastructure are accessible and responsive to diverse needs.",
              image: "/community-development-meeting.jpg",
              icon: "accessibility",
            },
            {
              title: "Low-income urban households",
              description:
                "Working with families facing poverty to improve livelihoods, housing conditions and access to basic services.",
              image: "/tpi-image-2.jpeg",
              icon: "home",
            },
            {
              title: "Local governments and urban authorities",
              description:
                "Strengthening the capacity, data and processes that make public institutions more inclusive and accountable.",
              image: "/local-government-partnership.jpg",
              icon: "landmark",
            },
          ],
        },
      },
      {
        key: "community_statement",
        label: "Community statement",
        description: "The single large quote between the sections.",
        fields: [{ name: "text", label: "Statement", type: "textarea" }],
        defaults: {
          text: "People are not beneficiaries at the end of a project. They are partners from the beginning. TPi is grounded on participation, equity and learning.",
        },
      },
      {
        key: "sdg",
        label: "SDG alignment",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "text" },
          { name: "body", label: "Sub-heading", type: "textarea" },
          { name: "legendPrimary", label: "Legend — primary", type: "text" },
          {
            name: "legendSupporting",
            label: "Legend — supporting",
            type: "text",
          },
          {
            name: "items",
            label: "Goals",
            type: "list",
            itemNoun: "goal",
            titleField: "title",
            fields: [
              { name: "number", label: "SDG number", type: "number" },
              { name: "title", label: "Title", type: "text" },
              { name: "image", label: "Icon image", type: "image" },
              {
                name: "primary",
                label: "Primary focus",
                type: "boolean",
                help: "Highlights the goal with a gold ring and badge.",
              },
            ],
          },
        ],
        defaults: {
          eyebrow: "SDG Alignment",
          heading: "Contributing to the Global Goals.",
          body: "TPi's mandate directly advances SDG 1, SDG 11 and SDG 13, with meaningful contributions to SDGs 3, 4, 5, 6 and 10.",
          legendPrimary: "Primary focus",
          legendSupporting: "Supporting contribution",
          items: [
            { number: 1, title: "No Poverty", image: "/sdg/sdg-01.png", primary: true },
            { number: 3, title: "Good Health & Well-being", image: "/sdg/sdg-03.png", primary: false },
            { number: 4, title: "Quality Education", image: "/sdg/sdg-04.png", primary: false },
            { number: 5, title: "Gender Equality", image: "/sdg/sdg-05.png", primary: false },
            { number: 6, title: "Clean Water & Sanitation", image: "/sdg/sdg-06.png", primary: false },
            { number: 10, title: "Reduced Inequalities", image: "/sdg/sdg-10.png", primary: false },
            { number: 11, title: "Sustainable Cities & Communities", image: "/sdg/sdg-11.png", primary: true },
            { number: 13, title: "Climate Action", image: "/sdg/sdg-13.png", primary: true },
          ],
        },
      },
      {
        key: "final_cta",
        label: "Closing call to action",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "body", label: "Paragraph", type: "textarea" },
          { name: "primaryLabel", label: "Primary button label", type: "text" },
          { name: "primaryHref", label: "Primary button link", type: "text" },
          {
            name: "secondaryLabel",
            label: "Secondary button label",
            type: "text",
          },
          {
            name: "secondaryHref",
            label: "Secondary button link",
            type: "text",
          },
        ],
        defaults: {
          eyebrow: "Partner With TPi",
          heading: "Let us build more inclusive and resilient cities together.",
          body: "Partner with TPi to support communities, strengthen institutions and develop practical solutions for Tanzania's urban future.",
          primaryLabel: "Become a Partner",
          primaryHref: "/get-involved",
          secondaryLabel: "Contact TPi",
          secondaryHref: "/contact",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    key: "about",
    label: "About page",
    path: "/about",
    blocks: [
      pageHero(
        "About Us",
        "A national NGO advancing inclusive, sustainable and climate-responsive urban development in Tanzania."
      ),
      {
        key: "who_we_are",
        label: "Who We Are",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "body", label: "Paragraph", type: "textarea" },
          { name: "image", label: "Feature photo", type: "image" },
        ],
        defaults: {
          eyebrow: "Who We Are",
          heading: "Cities should be inclusive, safe and resilient.",
          body: "TPi is a national non-governmental organization working in Tanzania to advance inclusive urban transformation, poverty reduction and climate resilience. We believe that every person—regardless of income, gender, age, disability or social status—deserves access to opportunities, services and dignity.",
          image: "/community-development-meeting.jpg",
        },
      },
      {
        key: "vision_mission",
        label: "Vision & Mission",
        fields: [
          { name: "visionEyebrow", label: "Vision eyebrow", type: "text" },
          { name: "vision", label: "Vision statement", type: "textarea" },
          { name: "missionEyebrow", label: "Mission eyebrow", type: "text" },
          { name: "mission", label: "Mission statement", type: "textarea" },
        ],
        defaults: {
          visionEyebrow: "Our Vision",
          vision:
            "Inclusive, resilient and poverty-free urban communities in Tanzania.",
          missionEyebrow: "Our Mission",
          mission:
            "To build inclusive, resilient and poverty-free urban communities through community empowerment, policy change and innovative, evidence-based solutions.",
        },
      },
      {
        key: "values",
        label: "Core values",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "body", label: "Sub-heading", type: "textarea" },
          {
            name: "items",
            label: "Values",
            type: "list",
            itemNoun: "value",
            titleField: "title",
            fields: [
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
            ],
          },
        ],
        defaults: {
          eyebrow: "Our Values",
          heading: "The principles that guide every engagement.",
          body: "",
          items: [
            {
              title: "Dignity and Respect",
              description:
                "Every person has the right to live in decent conditions and to be treated with respect, regardless of income, gender, age, disability or social status.",
            },
            {
              title: "Equity and Inclusion",
              description:
                "We prioritise the needs and voices of vulnerable groups, including women, children, youth, persons with disabilities, older persons and marginalised households.",
            },
            {
              title: "Community Participation",
              description:
                "Communities are central to planning, implementation, monitoring and learning, so that interventions respond to real needs and are locally owned.",
            },
            {
              title: "Accountability and Transparency",
              description:
                "We are committed to the responsible use of resources, ethical practice, openness and accountability to communities, partners, donors and public institutions.",
            },
            {
              title: "Partnership and Collaboration",
              description:
                "We work with government authorities, civil society organisations, communities, development partners, private sector actors and research institutions to achieve greater impact.",
            },
          ],
        },
      },
      {
        key: "thematic_intro",
        label: "Thematic areas summary",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "body", label: "Sub-heading", type: "textarea" },
          {
            name: "items",
            label: "Areas",
            type: "list",
            itemNoun: "area",
            titleField: "title",
            fields: [
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
            ],
          },
        ],
        defaults: {
          eyebrow: "What We Do",
          heading: "Three connected thematic areas.",
          body: "",
          items: [
            {
              title: "Inclusive Urban Transformation",
              description:
                "Making cities inclusive, safe and well-governed — so residents of informal settlements and vulnerable groups can access services, opportunities and a voice in decisions.",
            },
            {
              title: "Poverty Reduction",
              description:
                "Expanding livelihoods, economic inclusion and access to basic services for low-income and marginalised urban households.",
            },
            {
              title: "Climate Resilience",
              description:
                "Helping communities and local governments prepare for, adapt to and withstand climate shocks through sustainable, climate-responsive solutions.",
            },
          ],
        },
      },
      {
        key: "team",
        label: "Team section heading",
        description:
          "Team members themselves are managed under Organisation → Team.",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "body", label: "Sub-heading", type: "textarea" },
        ],
        defaults: {
          eyebrow: "Our Team",
          heading: "The people behind TPi.",
          body: "",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    key: "what-we-do",
    label: "What We Do",
    path: "/what-we-do",
    blocks: [
      pageHero(
        "What We Do",
        "Inclusive cities, poverty reduction and climate resilience.",
        "Our programmes connect people, evidence and institutions to address the urban challenges that matter most to excluded residents."
      ),
    ],
  },
  {
    key: "projects",
    label: "Projects",
    path: "/projects",
    blocks: [
      pageHero(
        "Our Work",
        "Projects",
        "A portfolio of community-led initiatives advancing inclusive cities, poverty reduction and climate resilience across Tanzania."
      ),
    ],
  },
  {
    key: "impact",
    label: "Impact",
    path: "/impact",
    blocks: [
      pageHero(
        "Our Impact",
        "Change is visible in people, communities and institutions.",
        "We measure success not by activities delivered, but by the lasting difference our work makes in the lives of urban residents."
      ),
    ],
  },
  {
    key: "news",
    label: "News & Insights",
    path: "/news",
    blocks: [
      pageHero(
        "News & Insights",
        "Stories, ideas and updates.",
        "Follow our latest news, field insights, events and organizational announcements."
      ),
    ],
  },
  {
    key: "resources",
    label: "Resources",
    path: "/resources",
    blocks: [
      pageHero(
        "Knowledge & Resources",
        "Evidence for better cities.",
        "Explore our reports, publications and analysis — plus stories of change and the impact of our work advancing inclusive and climate-responsive urban development."
      ),
    ],
  },
  {
    key: "partners",
    label: "Partners",
    path: "/partners",
    blocks: [
      pageHero(
        "Our Partners",
        "Progress requires partnership.",
        "TPi collaborates with communities, local government authorities, civil society organizations, development partners, research institutions and private-sector actors to create lasting urban impact."
      ),
    ],
  },
  {
    key: "events",
    label: "Events",
    path: "/events",
    blocks: [
      pageHero(
        "Events",
        "News, events and opportunities.",
        "Stay connected with TPi's latest news, upcoming and past events, and the jobs and adverts shaping inclusive urban development in Tanzania."
      ),
    ],
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    blocks: [
      pageHero(
        "Contact",
        "Start a conversation with TPi.",
        "Whether you are a community, a local authority, a development partner or a researcher, we would like to hear from you. Send us a message and our team will respond promptly."
      ),
    ],
  },
  {
    key: "get-involved",
    label: "Get Involved",
    path: "/get-involved",
    blocks: [
      pageHero(
        "Get Involved",
        "Let us build more inclusive and resilient cities together.",
        "Partner with TPi to support communities, strengthen institutions and develop practical solutions for Tanzania's urban future."
      ),
      {
        key: "closing",
        label: "Closing call to action",
        fields: [
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "body", label: "Paragraph", type: "textarea" },
          { name: "buttonLabel", label: "Button label", type: "text" },
          { name: "buttonHref", label: "Button link", type: "text" },
        ],
        defaults: {
          heading: "Ready to work together?",
          body: "Tell us about your priorities and we will find the best way to collaborate.",
          buttonLabel: "Get in touch",
          buttonHref: "/contact?enquiry=Partnership",
        },
      },
    ],
  },
  {
    key: "privacy-policy",
    label: "Privacy Policy",
    path: "/privacy-policy",
    blocks: [
      {
        key: "hero",
        label: "Page header",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "text" },
          { name: "lastUpdated", label: "Last updated", type: "text" },
        ],
        defaults: {
          eyebrow: "Legal",
          heading: "Privacy Policy",
          lastUpdated: "January 2025",
        },
      },
      {
        key: "body",
        label: "Policy text",
        fields: [{ name: "html", label: "Content", type: "richtext" }],
        defaults: { html: "" },
      },
    ],
  },
  {
    key: "terms-of-use",
    label: "Terms of Use",
    path: "/terms-of-use",
    blocks: [
      {
        key: "hero",
        label: "Page header",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "heading", label: "Heading", type: "text" },
          { name: "lastUpdated", label: "Last updated", type: "text" },
        ],
        defaults: {
          eyebrow: "Legal",
          heading: "Terms of Use",
          lastUpdated: "January 2025",
        },
      },
      {
        key: "body",
        label: "Terms text",
        fields: [{ name: "html", label: "Content", type: "richtext" }],
        defaults: { html: "" },
      },
    ],
  },
];

export function findPage(pageKey: string): ContentPage | undefined {
  return CONTENT_PAGES.find((page) => page.key === pageKey);
}

export function findBlock(
  pageKey: string,
  blockKey: string
): ContentBlock | undefined {
  return findPage(pageKey)?.blocks.find((block) => block.key === blockKey);
}

/** Defaults for a block, or an empty object if the block is unknown. */
export function blockDefaults(
  pageKey: string,
  blockKey: string
): Record<string, unknown> {
  return findBlock(pageKey, blockKey)?.defaults ?? {};
}
