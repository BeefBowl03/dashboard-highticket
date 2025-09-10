export interface EmailFormData {
  storeName: string;
  niche: string;
  targetDemographic: string;
  contactFirstName: string;
  marketingExperience?: string;
  nicheExperience?: string;
  whyNicheImportant?: string;
  supplierName?: string;
}

export interface SubjectLine {
  text: string;
  type: 'collaboration' | 'partnership' | 'teaming';
}

export interface EmailTemplate {
  subjectLine: SubjectLine;
  coreEmail: string;
  firstFollowUp: string;
  secondFollowUp: string;
  reasoning: {
    subjectLine: string[];
    coreEmail: string[];
    followUps: {
      first: string[];
      second: string[];
    };
  };
}

export interface GeneratedEmail {
  id: string;
  timestamp: Date;
  formData: EmailFormData;
  template: EmailTemplate;
  aiGenerated?: {
    customSubject?: string;
    enhancedCore?: string;
    additionalTips?: string[];
  };
}

export const SUBJECT_LINE_OPTIONS: SubjectLine[] = [
  { text: "collaboration request", type: "collaboration" },
  { text: "partnership request", type: "partnership" },
  { text: "teaming up", type: "teaming" },
  { text: "partnering up", type: "partnership" },
];

export const FOLLOW_UP_OPTIONS = {
  first: [
    "Just following up to see if you had a chance to review my earlier note?",
    "I wanted to circle back and check if you've had the chance to look over my email.",
    "Have you had an opportunity to take a look at my message yet?",
    "I know things can get busy, so I wanted to gently follow up regarding my last email.",
    "Did you happen to see my previous email?"
  ],
  second: ["👀", "☝️"]
};
