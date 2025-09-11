// Dealer Application Template Generator API
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { details } = req.body;

    if (!details) {
      return res.status(400).json({ error: 'Details are required' });
    }

    // Helper function to format values
    function nf(v) {
      return (v ?? '').trim().length > 0 ? v.trim() : '[Need more information]';
    }

    // Extract details with defaults
    const CONTACT_FIRST_NAME = nf(details.contactFirstName);
    const CONTACT_LAST_NAME = details.contactLastName?.trim() ? details.contactLastName.trim() : '[Need more information]';
    const CONTACT_EMAIL = nf(details.contactEmail);
    const CONTACT_PHONE = nf(details.contactPhone);
    const STORE_NAME = nf(details.storeName);
    const COMPANY_WEBSITE_DOMAIN = nf(details.websiteDomain);
    const LEGAL_STRUCTURE = details.legalStructure?.trim() || 'LLC';
    const EIN = nf(details.ein);
    const YEAR_ESTABLISHED = details.yearFounded?.trim() || '2023';
    const BUSINESS_ADDRESS = `${nf(details.businessStreet)}, ${nf(details.businessCity)}, ${nf(details.businessState)} ${nf(details.businessPostalCode)}, ${nf(details.businessCountry)}`;
    const NICHE = nf(details.niche);
    const TARGET_CUSTOMER_SEGMENT = nf(details.targetCustomerSegment);
    const ESTIMATED_SALES = details.estimatedSales?.trim() || '$700,000';
    const EMPLOYEES = nf(details.employees);
    const RESALE_CERT = nf(details.resaleCertificate);
    const BUSINESS_LICENSE = nf(details.businessLicense);
    const SUPPLIER_NAME = nf(details.supplierName);

    // Generate outreach message
    const outreach = `Hi there, I'm the founder of ${STORE_NAME}. We are an online retailer specializing in demand generation for ${NICHE} products. At the moment, we are partnering with a select group of leading suppliers in the ${NICHE}. I'm reaching out because I believe your products would be an excellent fit for the marketing campaigns we have planned over the coming weeks and months. I'm excited about the possibility of becoming an authorized dealer for your brand and contributing to the growth of ${SUPPLIER_NAME}. Best regards, ${CONTACT_FIRST_NAME}`;

    const dealerFormUrl = details.dealerFormUrl?.trim() || 'PASTE URL OF DEALER APPLICATION FORM HERE';

    // Build DETAILS & DOCUMENTS block
    const detailsBlock = `
1. Basic Contact Information
• Full Name → ${CONTACT_FIRST_NAME} / ${CONTACT_LAST_NAME}
• Business Email Address → ${CONTACT_EMAIL}
• Phone Number → ${CONTACT_PHONE}

2. Business Identity
• Company/Store Name → ${STORE_NAME}
• Business Website / Domain → ${COMPANY_WEBSITE_DOMAIN}
• Business Type → ${LEGAL_STRUCTURE}
• EIN (Tax ID) → ${EIN}
• Year Founded → ${YEAR_ESTABLISHED}
• Business Address → ${BUSINESS_ADDRESS}
• Niche → ${NICHE}

3. Sales & Marketing Channels
• Target Customer Segment → ${TARGET_CUSTOMER_SEGMENT}

4. Financial & Trade Information
• Estimated Annual Sales → ${ESTIMATED_SALES}

5. Operational Details
• Number of Employees → ${EMPLOYEES}

6. Legal & Compliance
• Resale Certificate # → ${RESALE_CERT}
• Business License # → ${BUSINESS_LICENSE}

7. Outreach / Free-Text Outreach Message → ${outreach}
`;

    const template = `**Dealer-application form URL: ${dealerFormUrl}**

### SYSTEM ###
You are a form-filling assistant for **dealer applications**.
────────────────────────────────────────
STEP 1 — Identify (or locate) the correct form
────────────────────────────────────────
1. Load the page at the URL above.
2. Decide whether the page is:
| Code | Form type | What to do |
|------|-----------|------------|
| **(a)** | Dealer / dealer-application form | ➞ Continue to Step 2 |
| **(b)** | Standard contact / lead-inquiry form | Treat as contact form: fill it out using the rules in Step 2 (esp. Outreach Message), then proceed to Step 2. |
| **(c)** | Anything else | Attempt rescue workflow (see original instructions). |
────────────────────────────────────────
STEP 2 — Populate answers (**no best-guess answers allowed**)
────────────────────────────────────────
> **Extraction pass (A)** – Build an ordered list VISIBLE_QUESTIONS[] by scanning the live form for every question label shown to the user.
> **Answering pass** – Produce the table **only for those questions, in that exact order**.
> **Validation pass (B)** – Compute the symmetric difference between VISIBLE_QUESTIONS[] and your answer rows:
> • If any extra or missing questions are detected, regenerate the table until they match exactly.
> • If the form cannot be accessed or parsed, output exactly:
> ⚠️ FORM COULD NOT BE ACCESSED OR PARSED — please upload a screenshot so I can help manually.
> **Never fabricate questions or answers.** If a data point isn't visible and no default applies, use **[Need more information]** (or [Leave blank] for credit references).
---
| Question (exact text on form) | Answer |
**Answering rules (strict)**
0. **Chronological fidelity** – Rows must mirror VISIBLE_QUESTIONS[] exactly.
1. Copy explicit data from Company profile when available.
2. Derive obvious answers when safe (e.g. Preferred language → English).
3. Street / City / State / ZIP = place of incorporation.
4. Map IDs and years as specified.
5. "Other brands carried" = 3–5 competitor brands (exclude target).
6. Credit / bank / reference fields → [Leave blank].
7. Truly missing data → [Need more information] (never invent).
8. Uncertain inference → [Not sure].
9. Store-type fields: choose Online-only options.
10. "Where will you sell [Brand]?" → Online.
11. Mandatory photo or showroom link: N/A for online-only.
12. Free-text answers: clear, casual English; no local-store claims.
13. If comments / free-text box exists: Insert Outreach Message. Shorten if needed to fit char limit. Keep email address intact. Never include line-break codes.
14. After the table, output nothing else; do not wrap the response in an extra fenced code block.
────────────────────────────────────────
OUTREACH MESSAGE (for free-text boxes):
${outreach}
────────────────────────────────────────
### DETAILS & DOCUMENTS — Paste Below
────────────────────────────────────────
${detailsBlock}`;

    const fenced = "```markdown\n" + template + "\n```";

    res.status(200).json({ 
      success: true,
      template: fenced,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Dealer template generation error:', error);
    res.status(500).json({ 
      error: 'Template generation failed',
      message: error.message
    });
  }
};
