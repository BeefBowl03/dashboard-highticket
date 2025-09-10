import { PolicyData } from '../types';

/**
 * 🎉 ALL SET! - SHOPIFY INTEGRATION INSTRUCTIONS
 * ===============================================
 * 
 * Here's what to do next to add your generated policies to Shopify:
 * 
 * 1. In Shopify admin, go to Online Store → Pages
 * 2. Click Add page, name it after the policy (e.g. "Shipping Policy")
 * 3. Click the <> (Show HTML) icon in the top‑right of the editor
 * 4. Paste the generated HTML code into the HTML view
 * 5. Click <> again to return to normal view and confirm rendering
 * 6. Click Save
 * 
 * 💡 Tip: You can now copy the HTML code and follow these steps to add your policy to Shopify!
 */

/**
 * POLICY TEMPLATE INSTRUCTIONS
 * ============================
 * 
 * This file contains all the policy templates and the logic to generate dynamic HTML
 * based on user input. Here's how it works:
 * 
 * 1. TEMPLATE STRUCTURE:
 *    - Each template is defined as a PolicyTemplate object with id, name, description, and htmlTemplate
 *    - Templates use placeholders like [Your Company Name] that get replaced with actual data
 * 
 * 2. DYNAMIC DATA REPLACEMENT:
 *    - The generatePolicyHTML function replaces all placeholders with actual form data
 *    - Placeholders are mapped to PolicyData fields (e.g., [Your Company Name] → policyData.legalBusinessName)
 *    - Smart fallbacks are provided when data is missing (e.g., 'N/A' or default values)
 * 
 * 3. AUTOMATIC LINK CONVERSION:
 *    - Email addresses automatically become mailto: links
 *    - Phone numbers automatically become tel: links  
 *    - URLs automatically become clickable links with target="_blank"
 * 
 * 4. AVAILABLE TEMPLATES:
 *    - Shipping Policy: Complete shipping policy with delivery times, costs, and procedures
 *    - Billing Terms: Complete billing terms with payment methods, late fees, and subscription details
 *    - Cookie Policy: Complete cookie policy with tracking technologies and user consent information
 *    - Disclaimer: Comprehensive legal disclaimers and limitations of liability
 *    - Payment Options: Complete payment methods, security measures, and transaction procedures
 *    - Return and Refund Policy: Complete return and refund policy with timelines, conditions, and procedures
 *    - Privacy Policy: Comprehensive privacy policy with data collection, usage, and protection information
 *    - Terms of Service: Comprehensive terms of service with user rights, responsibilities, and legal obligations
 * 
 * 5. CUSTOMIZATION:
 *    - Add new templates by creating a new PolicyTemplate object
 *    - Add new placeholders to the replacements mapping in generatePolicyHTML
 *    - Modify styling by updating the CSS in the htmlTemplate strings
 * 
 * 6. USAGE:
 *    - Import generatePolicyHTML and pass a template + PolicyData
 *    - The function returns fully rendered HTML with all placeholders replaced
 *    - Use the returned HTML in your application or export to files
 */

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  htmlTemplate: string;
}

// Function to replace placeholders in HTML templates with actual form data
export const generatePolicyHTML = (template: string, policyData: PolicyData): string => {
  let html = template;
  
  // Replace all placeholders with actual data
  const replacements: { [key: string]: string } = {
    '[Insert Effective Date]': policyData.lastUpdatedDate,
    '[Your Company Name]': policyData.legalBusinessName,
    '[Your Website URL]': policyData.primaryWebsiteDomain,
    '[List of Countries/Regions]': policyData.shipToCountries,
    '[Your Country]': policyData.countryOfIncorporation,
    '[e.g., Free shipping on all orders over $50.]': policyData.domesticFreeShippingThreshold 
      ? `Free shipping on all orders over $${policyData.domesticFreeShippingThreshold}.` 
      : 'No free shipping threshold.',
    '[e.g., $5 flat rate for orders under $50.]': policyData.domesticFlatRateShippingFee 
      ? `$${policyData.domesticFlatRateShippingFee} flat rate for orders under the free shipping threshold.`
      : 'Custom (calculated at checkout).',
    '[e.g., $15 flat rate.]': policyData.internationalFlatRateShippingFee,
    '[Number of Business Days, e.g., 1-2 business days]': policyData.orderProcessingTime,
    '[Cut-Off Time, e.g., 5:00 PM EST]': policyData.dailyOrderCutoff,
    '[e.g., 3-5 business days]': policyData.domesticDeliveryEstimateStandard,
    '[e.g., 1-2 business days]': policyData.domesticDeliveryEstimateExpedited,
    '[e.g., 7-14 business days]': policyData.internationalDeliveryEstimate,
    '[e.g., USPS, UPS, FedEx]': policyData.domesticCarriers,
    '[e.g., DHL, FedEx International]': policyData.internationalCarriers,
    '[Your Website URL]/track-order': `${policyData.primaryWebsiteDomain}/track-order`,
    '[Customer Service Email]': policyData.mainContactEmail,
    '[Customer Service Phone Number]': policyData.phoneNumber,
    '[Number of Days, e.g., 7 days]': '7 days',
    '[Number of Days, e.g., 30 days]': '30 days',
    '[Number of Days, e.g., 14 days]': '14 days',
    '[Street Address]': policyData.fullStreetAddress,
    '[City, State/Province, ZIP/Postal Code]': (() => {
      if (!policyData.fullStreetAddress) return 'N/A';
      const parts = policyData.fullStreetAddress.split(',');
      if (parts.length > 1) {
        // Extract city, state, zip (skip street address and country)
        // For address like "123 Elm St, Springfield, IL 62704, USA"
        // We want "Springfield, IL 62704" (skip street and country)
        if (parts.length >= 3) {
          return parts.slice(1, -1).join(',').trim(); // Skip first (street) and last (country)
        }
        return parts.slice(1).join(',').trim(); // Fallback: just skip street
      }
      return policyData.fullStreetAddress;
    })(),
    '[Days and Hours of Operation, e.g., Monday to Friday, 9 AM to 5 PM EST]': policyData.customerServiceHours || 'Monday to Friday, 9 AM to 5 PM EST',
    '[Country]': policyData.countryOfIncorporation || 'United States',
    
    // Billing Terms specific placeholders
    '[Currency]': policyData.isoCurrencyCode || 'USD',
    '[Other Payment Methods, e.g., Apple Pay, Google Pay]': policyData.acceptedPayments || 'Apple Pay, Google Pay',
    '[List accepted payment methods, e.g., Visa, MasterCard, PayPal, etc.]': policyData.acceptedPayments || 'Visa, MasterCard, PayPal, etc.',
    '[Specify Due Date, e.g., upon receipt, within 15 days of invoice date]': 'upon receipt',
    '[Specify Billing Cycle, e.g., first day of each month]': 'first day of each month',
    '[Specify Frequency, e.g., upon order completion, monthly, annually]': 'upon order completion',
    '[Email/Online Portal]': 'email',
    '[Specify Rate, e.g., 1.5% per month or the maximum allowed by law]': '1.5% per month or the maximum allowed by law',
    '[Number of Days, e.g., 10 days]': '10 days',
    '[Number of Days, e.g., 15 days]': '15 days',
    '[Billing Contact Email/Address]': policyData.mainContactEmail || 'billing@company.com',
    '[Insert Link to Refund Policy]': policyData.returnPolicyURL || '#',
    '[Specify Payment Gateway/Processor]': 'secure payment processor',
    '[Website URL]': policyData.primaryWebsiteDomain || 'yourdomain.com',
    '[Time Period, e.g., six months]': 'six months',
    '[Your Country/State]': policyData.countryOfIncorporation || 'United States',
    '[Your Jurisdiction]': policyData.governingLawState || policyData.countryOfIncorporation || 'United States',
    '[Your Company Address]': policyData.fullStreetAddress || 'Company Address',
    '[Billing Contact Email]': policyData.mainContactEmail || 'billing@company.com',
    '[Billing Contact Phone Number]': policyData.phoneNumber || 'Phone Number',
    '[Insert Link to Terms of Service]': policyData.termsOfServicePageURL || '#',
    '[Insert Link to Privacy Policy]': policyData.contactPageURL || '#',
    '[Insert Link to Cancellation Policy]': policyData.returnPolicyURL || '#',
    
    // Cookie Policy specific placeholders
    '[Your Contact Email]': policyData.mainContactEmail || 'contact@company.com',
    '[Your Contact Phone Number]': policyData.phoneNumber || 'Phone Number',
    
    // Disclaimer specific placeholders
    '[Contact Us Page URL]': policyData.contactPageURL || '#',
    '[Affiliate Program Name]': policyData.affiliateProgramName || 'affiliate advertising program',
    '[Affiliate Website(s)]': policyData.affiliateProgramName ? 'affiliate websites' : 'affiliate websites',
    
    // Payment Policy specific placeholders
    '[WEBSITE NAME]': policyData.storeWebsiteName || 'Our Website',
    '[SELLING COUNTRIES]': policyData.sellingRegions || 'the countries we serve',
    '[CUSTOMER SERVICE EMAIL]': policyData.mainContactEmail || 'customer service email',
    '[CUSTOMER SERVICE PHONE]': policyData.phoneNumber || 'customer service phone',
    '[COMPANY ADDRESS]': policyData.fullStreetAddress || 'company address',
    '[Hours of Operation, e.g., Monday to Friday, 9 AM to 5 PM CET]': policyData.customerServiceHours || 'Monday to Friday, 9 AM to 5 PM CET',
    '[Time Frame, e.g., 1 hour]': '1 hour',
    '[Currency, e.g., Euros (€)]': (() => {
      const currency = policyData.isoCurrencyCode || 'USD';
      const currencySymbols: { [key: string]: string } = {
        'USD': 'US Dollars ($)',
        'EUR': 'Euros (€)',
        'GBP': 'British Pounds (£)',
        'CAD': 'Canadian Dollars (C$)',
        'AUD': 'Australian Dollars (A$)'
      };
      return currencySymbols[currency] || `${currency} (${currency})`;
    })(),
    '[WEBSITE URL]': policyData.primaryWebsiteDomain || 'website URL',
    '[TODAY\'S DATE, e.g., 12 November 2023]': policyData.lastUpdatedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    
    // Additional Privacy Policy specific mappings
    '[Insert Age, e.g., 13 or 16]': '18',
    
    
    // Return and Refund Policy specific placeholders
    '[Selling Countries/Regions]': policyData.shipToCountries || 'the countries we serve',
    '[Number of Days]': '14 days',
    '[Preferred Shipping Method, e.g., a trackable courier service]': 'a trackable courier service',
    '[Number of Days, e.g., 48 hours]': '48 hours',
    '[Insert FAQ Link]': policyData.faqPageURL || '#',
    '[Email]': policyData.mainContactEmail || 'contact@company.com',
    '[Phone]': policyData.phoneNumber || 'Phone Number',
    
    // Shipping Policy link placeholder
    '[Insert Link to Shipping Policy]': `${policyData.primaryWebsiteDomain}/shipping-policy`
  };

  // Apply all replacements
  Object.entries(replacements).forEach(([placeholder, value]) => {
    html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value || 'N/A');
  });

  // Convert email addresses, URLs, and phone numbers to clickable links
  html = convertToClickableLinks(html);

  return html;
};

// Function to convert email addresses, URLs, and phone numbers to clickable links
const convertToClickableLinks = (html: string): string => {
  // Convert email addresses to mailto: links
  html = html.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1" style="color: #2a4d7c; text-decoration: underline;">$1</a>'
  );

  // Convert phone numbers to tel: links (basic pattern matching)
  html = html.replace(
    /(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g,
    '<a href="tel:$1" style="color: #2a4d7c; text-decoration: underline;">$1</a>'
  );

  // Convert URLs to clickable links (but avoid converting URLs that are already in href attributes)
  html = html.replace(
    /(?<!href=["'])(https?:\/\/[^\s<>"']+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #2a4d7c; text-decoration: underline;">$1</a>'
  );

  return html;
};

export const shippingPolicyTemplate: PolicyTemplate = {
  id: 'shipping',
  name: 'Shipping Policy',
  description: 'Comprehensive shipping policy template for e-commerce businesses',
  htmlTemplate: `<style>
  /* ---------- Page-specific full-bleed wrapper ---------- */
  .sp--fullbleed {
    /* pull the block out of Shopify's padded container */
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  /* remove Shopify container padding ONLY when this block is present */
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* ---------- Typography & layout (no custom colors) ---------- */
  .shipping-policy { font-family: Arial, sans-serif; line-height: 1.6; }
  .shipping-policy * { box-sizing: border-box; }

  .shipping-policy h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .shipping-policy h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .shipping-policy h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }
  .shipping-policy h4 { font-size: 18px; margin: 1rem 0 0.5rem 0; }

  .shipping-policy p { font-size: 16px; margin: 0 0 1rem 0; }
  .shipping-policy ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .shipping-policy li { margin: 0.25rem 0; }

  .shipping-policy section { margin: 0 0 2rem 0; padding: 0; }

  /* ensure no sneaky horizontal spacing anywhere within the policy block */
  .shipping-policy, 
  .shipping-policy section, 
  .shipping-policy h1, 
  .shipping-policy h2, 
  .shipping-policy h3, 
  .shipping-policy h4 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="shipping-policy sp--fullbleed">
  <h1>Shipping Policy</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>At [Your Company Name] ("we," "us," or "our"), we aim to provide a seamless and transparent shipping experience for our customers. This Shipping Policy outlines the terms and conditions related to the delivery of products purchased from our website, [Your Website URL].</p>
  </section>

  <section>
    <h2>2. Shipping Destinations</h2>
    <h3>Countries We Ship To:</h3>
    <ul>
      <li>[List of Countries/Regions]</li>
      <li>Example: United States, Canada, United Kingdom, European Union countries, etc.</li>
    </ul>
    <h3>Future Expansion:</h3>
    <p>We are continually working to expand our shipping destinations. Please check back regularly for updates.</p>
  </section>

  <section>
    <h2>3. Shipping Costs</h2>
    <h3>Domestic Shipping ([Your Country]):</h3>
    <ul>
      <li>Standard Shipping: [e.g., Free shipping on all orders over $50.]</li>
      <li>Flat Rate Shipping: [e.g., $5 flat rate for orders under $50.]</li>
    </ul>
    <h3>International Shipping:</h3>
    <ul>
      <li>Standard International Shipping: [e.g., $15 flat rate.]</li>
    </ul>
    <h3>Customs and Duties:</h3>
    <p>International orders may be subject to customs fees, import duties, taxes, or other charges imposed by your local government. These charges are the customer's responsibility.</p>
    <h3>No Hidden Fees:</h3>
    <p>All shipping costs are calculated and displayed at checkout. There are no hidden fees.</p>
  </section>

  <section>
    <h2>4. Order Processing Time</h2>
    <h3>Processing Time:</h3>
    <p>Orders are processed within [Number of Days] (Monday to Friday, excluding holidays).</p>
    <h3>Order Cut-Off Time:</h3>
    <p>Orders placed before [Cut-Off Time, e.g., 5:00 PM EST] will begin processing the same day.</p>
    <h3>Weekend and Holiday Orders:</h3>
    <p>Orders placed on weekends or public holidays will be processed on the next business day.</p>
  </section>

  <section>
    <h2>5. Estimated Delivery Time</h2>
    <h3>Domestic Shipping:</h3>
    <ul>
      <li>Standard Shipping: [Number of Days, e.g., 15 days]</li>
      <li>Expedited Shipping: [Number of Days, e.g., 10 days]</li>
    </ul>
    <h3>International Shipping:</h3>
    <ul>
      <li>Standard International Shipping: [Number of Days]</li>
    </ul>
    <h3>Notes:</h3>
    <p>Delivery times are estimates and may vary due to factors beyond our control, such as weather conditions, customs delays, or carrier issues.</p>
  </section>

  <section>
    <h2>6. Shipping Methods and Carriers</h2>
    <h3>Reliable Carriers:</h3>
    <p>We partner with reputable carriers to ensure your package arrives safely.</p>
    <h3>Domestic Carriers:</h3>
    <ul>
      <li>[e.g., USPS, UPS, FedEx]</li>
    </ul>
    <h3>International Carriers:</h3>
    <ul>
      <li>[e.g., DHL, FedEx International]</li>
    </ul>
    <h3>Shipment Tracking:</h3>
    <p>All orders include tracking information, which will be provided via email once your order has shipped.</p>
    <h3>Insurance:</h3>
    <p>Shipments are insured against loss or damage. If you encounter any issues, please contact us promptly.</p>
  </section>

  <section>
    <h2>7. Order Tracking</h2>
    <h3>Tracking Information:</h3>
    <p>After your order has been shipped, you will receive an email containing:</p>
    <ul>
      <li>Tracking Number</li>
      <li>Carrier Name</li>
      <li>Link to Track Your Package</li>
    </ul>
    <h3>How to Track Your Order:</h3>
    <p>Visit [Your Website URL]/track-order or the carrier's website. Enter your tracking number to view the status and estimated delivery date.</p>
    <h3>Assistance:</h3>
    <p>If you have questions or need assistance with tracking, please contact our Customer Service.</p>
  </section>

  <section>
    <h2>8. Delivery Issues</h2>
    <h3>8.1 Delayed or Lost Packages</h3>
    <h4>Delayed Delivery:</h4>
    <p>If your package is delayed beyond the estimated delivery time, please contact us at [Customer Service Email] or [Customer Service Phone Number].</p>
    <h4>Lost Packages:</h4>
    <p>If your tracking information indicates that your package was delivered but you have not received it:</p>
    <ul>
      <li>Verify the shipping address provided.</li>
      <li>Check with neighbors or building management.</li>
      <li>Contact us for further assistance.</li>
    </ul>
    <h3>8.2 Damaged Packages</h3>
    <h4>Reporting Damage:</h4>
    <p>If your package arrives damaged:</p>
    <ul>
      <li>Take photos of the damaged packaging and items.</li>
      <li>Contact us within [Number of Days, e.g., 7 days] at [Customer Service Email].</li>
    </ul>
    <h4>Resolution:</h4>
    <p>We will work with you to arrange a replacement or refund as appropriate.</p>
  </section>

  <section>
    <h2>9. Missing Items</h2>
    <h3>Reporting Missing Items:</h3>
    <p>If any items are missing from your order:</p>
    <ul>
      <li>Contact us within [Number of Days, e.g., 7 days] of receiving your package.</li>
      <li>Provide your order number and details of the missing item(s).</li>
    </ul>
    <h3>Resolution:</h3>
    <p>We will investigate and resolve the issue promptly by sending the missing item(s) or offering a refund.</p>
  </section>

  <section>
    <h2>10. Return and Refund Policy</h2>
    <h3>Returns:</h3>
    <p>Returns are accepted within [Number of Days, e.g., 30 days] of receiving your order.</p>
    <h3>Conditions for Returns:</h3>
    <p>Items must be unused, undamaged, and in their original packaging. Certain items (e.g., personalized or perishable goods) may not be eligible for return.</p>
    <h3>Return Shipping Costs:</h3>
    <ul>
      <li><strong>Customer Responsibility:</strong> Return shipping costs are the customer's responsibility unless the item is defective or not as described.</li>
      <li><strong>Company Responsibility:</strong> If the return is due to our error, we will cover the return shipping costs.</li>
    </ul>
    <h3>Refunds:</h3>
    <p>Refunds are processed within [Number of Days, e.g., 14 days] after receiving the returned item. Refunds will be issued to the original payment method.</p>
    <p>For More Information: Please refer to our Return and Refund Policy for detailed information.</p>
  </section>

  <section>
    <h2>11. Incorrect Address</h2>
    <h3>Address Accuracy:</h3>
    <p>Please ensure that all shipping information is correct. We are not responsible for orders shipped to incorrect addresses provided by the customer.</p>
    <h3>Returned Packages:</h3>
    <p>If a package is returned to us due to an incorrect address:</p>
    <ul>
      <li>We will contact you to arrange reshipment.</li>
      <li>Additional shipping charges may apply.</li>
    </ul>
  </section>

  <section>
    <h2>12. International Customs and Duties</h2>
    <h3>Customs Clearance:</h3>
    <p>International shipments may require customs clearance, which can cause delays beyond our original delivery estimates.</p>
    <h3>Taxes and Duties:</h3>
    <p>Import duties, taxes, and charges are not included in the item price or shipping cost. These charges are the buyer's responsibility.</p>
    <h3>Customs Policies:</h3>
    <p>Customs policies vary widely by country. Please contact your local customs office for more information.</p>
  </section>

  <section>
    <h2>13. Contact Information</h2>
    <p>If you have any questions or concerns regarding your shipment, please contact us:</p>
    <ul>
      <li><strong>Customer Service Email:</strong> [Customer Service Email]</li>
      <li><strong>Customer Service Phone:</strong> [Customer Service Phone Number]</li>
      <li>
        <strong>Company Address:</strong>
        <ul>
          <li>[Your Company Name]</li>
          <li>[Street Address]</li>
          <li>[City, State/Province, ZIP/Postal Code]</li>
          <li>[Country]</li>
        </ul>
      </li>
    </ul>
    <p>Our customer service team is available [Days and Hours of Operation, e.g., Monday to Friday, 9 AM to 5 PM EST].</p>
  </section>

  <section>
    <h2>14. Changes to This Shipping Policy</h2>
    <p>We reserve the right to modify this Shipping Policy at any time. Changes and clarifications will take effect immediately upon posting on the website. We encourage you to review this policy periodically.</p>
  </section>

  <p>Thank you for shopping with [Your Company Name]! We appreciate your business and are committed to providing you with exceptional service.</p>
</div>
`
  }

export const billingTermsTemplate: PolicyTemplate = {
  id: 'billing',
  name: 'Billing Terms and Conditions',
  description: 'Complete billing terms with payment methods, late fees, and subscription details',
  htmlTemplate: `<style>
  /* ---------- Page-specific full-bleed wrapper ---------- */
  .sp--fullbleed {
    /* pull the block out of Shopify's padded container */
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  /* remove Shopify container padding ONLY when this block is present */
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* ---------- Typography & layout (no custom colors) ---------- */
  .billing-terms { font-family: Arial, sans-serif; line-height: 1.6; }
  .billing-terms * { box-sizing: border-box; }

  .billing-terms h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .billing-terms h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .billing-terms h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }
  .billing-terms h4 { font-size: 18px; margin: 1rem 0 0.5rem 0; }

  .billing-terms p  { font-size: 16px; margin: 0 0 1rem 0; }
  .billing-terms ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .billing-terms li { margin: 0.25rem 0; }

  .billing-terms section { margin: 0 0 2rem 0; padding: 0; }

  /* ensure no horizontal spacing sneaks in within the block */
  .billing-terms,
  .billing-terms section,
  .billing-terms h1,
  .billing-terms h2,
  .billing-terms h3,
  .billing-terms h4 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="billing-terms sp--fullbleed">
  <h1>Billing Terms and Conditions</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>These Billing Terms and Conditions ("Terms") govern the payment obligations and processes between [Your Company Name] ("Company", "we", "us", or "our") and the customer ("Customer", "you", or "your"). By accessing or using our services and purchasing our products, you agree to be bound by these Terms.</p>
  </section>

  <section>
    <h2>2. Payment Terms</h2>
    <h3>2.1 Pricing</h3>
    <ul>
      <li><strong>Prices:</strong> All prices for products and services are listed in [Currency] and are subject to change without prior notice.</li>
      <li><strong>Taxes and Fees:</strong> Prices are exclusive of applicable taxes, duties, or charges unless otherwise specified.</li>
    </ul>

    <h3>2.2 Payment Methods</h3>
    <p>We accept the following payment methods:</p>
    <ul>
      <li>Credit/Debit Cards: Visa, MasterCard, American Express, etc.</li>
      <li>Electronic Funds Transfer (EFT)/ACH Payments</li>
      <li>PayPal</li>
      <li>[Other Payment Methods, e.g., Apple Pay, Google Pay]</li>
    </ul>

    <h3>2.3 Payment Due Date</h3>
    <ul>
      <li><strong>One-Time Purchases:</strong> Payment is due [Specify Due Date, e.g., upon receipt, within 15 days of invoice date].</li>
      <li><strong>Subscription Services:</strong> Payment is due on the [Specify Billing Cycle, e.g., first day of each month].</li>
    </ul>
  </section>

  <section>
    <h2>3. Invoicing</h2>
    <h3>Invoice Issuance:</h3>
    <p>Invoices will be issued [Specify Frequency, e.g., upon order completion, monthly, annually].</p>
    <h3>Delivery Method:</h3>
    <p>Invoices will be sent electronically via [Email/Online Portal] to the contact information provided by the Customer.</p>
    <h3>Customer Responsibility:</h3>
    <p>It is your responsibility to ensure that all billing information is accurate and up-to-date.</p>
  </section>

  <section>
    <h2>4. Late Payments</h2>
    <h3>4.1 Interest on Late Payments</h3>
    <ul>
      <li><strong>Late Fee:</strong> If payment is not received by the due date, a late payment interest of [Specify Rate, e.g., 1.5% per month or the maximum allowed by law] will be charged on the outstanding balance.</li>
    </ul>

    <h3>4.2 Suspension of Services</h3>
    <ul>
      <li><strong>Service Suspension:</strong> We reserve the right to suspend or terminate services if payment is not received within [Number of Days, e.g., 10 days] after the due date.</li>
      <li><strong>Reinstatement:</strong> Services will be reinstated upon full payment of outstanding amounts, including any late fees.</li>
    </ul>
  </section>

  <section>
    <h2>5. Disputed Charges</h2>
    <h3>Notification Period:</h3>
    <p>If you dispute any charges on your invoice, you must notify us in writing within [Number of Days, e.g., 15 days] of the invoice date.</p>
    <h3>Contact Information:</h3>
    <p>Disputes should be sent to [Billing Contact Email/Address] and include the invoice number and details of the dispute.</p>
    <h3>Resolution:</h3>
    <p>We will investigate and resolve billing disputes promptly.</p>
  </section>

  <section>
    <h2>6. Refunds and Credits</h2>
    <h3>Policy Reference:</h3>
    <p>Refunds or credits are provided in accordance with our <a href="[Insert Link to Refund Policy]">Refund Policy</a>.</p>
    <h3>Processing Time:</h3>
    <p>Any approved refunds will be processed to the original payment method within [Number of Days, e.g., 14 days].</p>
  </section>

  <section>
    <h2>7. Taxes</h2>
    <h3>Customer Responsibility:</h3>
    <p>You are responsible for all applicable taxes, including but not limited to sales tax, value-added tax (VAT), goods and services tax (GST), and any other similar charges.</p>
    <h3>Tax Exemption:</h3>
    <p>If you are tax-exempt, you must provide a valid tax exemption certificate at the time of purchase.</p>
  </section>

  <section>
    <h2>8. Billing Errors</h2>
    <h3>Corrections:</h3>
    <p>If we discover a billing error, we will correct it promptly.</p>
    <h3>Overcharges:</h3>
    <p>If you have been overcharged, we will refund or credit the overcharged amount.</p>
    <h3>Undercharges:</h3>
    <p>If you have been undercharged, we will invoice you for the outstanding amount.</p>
  </section>

  <section>
    <h2>9. Subscription and Recurring Payments</h2>
    <h3>9.1 Automatic Renewal</h3>
    <h4>Renewal Terms:</h4>
    <p>Subscriptions will automatically renew at the end of each billing cycle unless canceled in accordance with our <a href="[Insert Link to Cancellation Policy]">Cancellation Policy</a>.</p>
    <h4>Notification:</h4>
    <p>We may send a reminder email prior to the renewal date.</p>

    <h3>9.2 Cancellation</h3>
    <h4>How to Cancel:</h4>
    <p>You may cancel your subscription by providing written notice to us at least [Number of Days, e.g., 30 days] before the end of the current billing cycle.</p>
    <h4>Effect of Cancellation:</h4>
    <p>Upon cancellation, you will retain access to the services until the end of the current billing period.</p>
  </section>

  <section>
    <h2>10. Payment Security</h2>
    <h3>Data Protection:</h3>
    <p>All payment information is handled securely in compliance with industry standards.</p>
    <h3>Payment Processor:</h3>
    <p>We use [Specify Payment Gateway/Processor] to process payments and do not store your credit card information on our servers.</p>
    <h3>SSL Encryption:</h3>
    <p>Transactions are secured using Secure Socket Layer (SSL) encryption technology.</p>
  </section>

  <section>
    <h2>11. Changes to Billing Terms</h2>
    <h3>Modification Rights:</h3>
    <p>We reserve the right to modify these Billing Terms and Conditions at any time.</p>
    <h3>Notification of Changes:</h3>
    <p>Changes will become effective upon posting the updated Terms on our website at [Website URL].</p>
    <h3>Acceptance of Changes:</h3>
    <p>Continued use of our services after any such changes constitutes acceptance of the new Terms.</p>
  </section>

  <section>
    <h2>12. Limitation of Liability</h2>
    <h3>No Liability for Indirect Damages:</h3>
    <p>We are not liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to these Terms.</p>
    <h3>Maximum Liability:</h3>
    <p>Our maximum liability for any claims arising under these Terms is limited to the amount paid by you for the services in the [Time Period, e.g., six months] preceding the event giving rise to the liability.</p>
  </section>

  <section>
    <h2>13. Governing Law</h2>
    <h3>Jurisdiction:</h3>
    <p>These Terms are governed by the laws of [Your Country/State], without regard to its conflict of law principles.</p>
    <h3>Venue:</h3>
    <p>Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in [Your Jurisdiction].</p>
  </section>

  <section>
    <h2>14. Contact Information</h2>
    <p>For any questions or concerns regarding billing, please contact us:</p>
    <ul>
      <li><strong>Company Name:</strong> [Your Company Name]</li>
      <li><strong>Address:</strong> [Your Company Address]</li>
      <li><strong>Email:</strong> [Billing Contact Email]</li>
      <li><strong>Phone:</strong> [Billing Contact Phone Number]</li>
      <li><strong>Website:</strong> [Your Website URL]</li>
    </ul>
  </section>

  <section>
    <h2>15. Entire Agreement</h2>
    <p>These Billing Terms and Conditions, along with our <a href="[Insert Link to Terms of Service]">Terms of Service</a> and <a href="[Insert Link to Privacy Policy]">Privacy Policy</a>, constitute the entire agreement between you and [Your Company Name] regarding billing matters and supersede all prior agreements.</p>
  </section>

  <section>
    <h2>Acknowledgment</h2>
    <p>By using our services or purchasing our products, you acknowledge that you have read, understood, and agree to these Billing Terms and Conditions.</p>
  </section>
</div>`
};

export const cookiePolicyTemplate: PolicyTemplate = {
  id: 'cookie',
  name: 'Cookie Policy',
  description: 'Complete cookie policy with tracking technologies and user consent information',
  htmlTemplate: `
      <style>
        .sp--fullbleed {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          padding-left: 20px;
          padding-right: 20px;
          box-sizing: border-box;
        }
        
        .cookie-policy {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .cookie-policy h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1.5rem;
          text-align: center;
          border-bottom: 3px solid #e2e8f0;
          padding-bottom: 1rem;
        }
        
        .cookie-policy h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          border-left: 4px solid #4299e1;
          padding-left: 1rem;
        }
        
        .cookie-policy h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #4a5568;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .cookie-policy p {
          margin-bottom: 1.25rem;
          text-align: justify;
        }
        
        .cookie-policy ul {
          margin-bottom: 1.25rem;
          padding-left: 2rem;
        }
        
        .cookie-policy li {
          margin-bottom: 0.5rem;
        }
        
        .cookie-policy strong {
          font-weight: 600;
          color: #2d3748;
        }
        
        .cookie-policy .highlight-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin: 2rem 0;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .cookie-policy .info-box {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #4299e1;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .cookie-policy .warning-box {
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-left: 4px solid #e53e3e;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .cookie-policy .contact-info {
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          border-left: 4px solid #38a169;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        @media (max-width: 768px) {
          .cookie-policy {
            padding: 20px 15px;
          }
          
          .cookie-policy h1 {
            font-size: 2rem;
          }
          
          .cookie-policy h2 {
            font-size: 1.5rem;
          }
          
          .cookie-policy h3 {
            font-size: 1.2rem;
          }
        }
      </style>
      
      <div class="cookie-policy sp--fullbleed">
        <h1>Cookie Policy</h1>
        
        <div class="highlight-box">
          <p><strong>Last Updated:</strong> [Insert Effective Date]</p>
          <p><strong>Effective Date:</strong> [Insert Effective Date]</p>
        </div>
        
        <p>This Cookie Policy ("Policy") explains how <strong>[Your Company Name]</strong> ("we," "us," "our," or "Company") uses cookies and similar tracking technologies when you visit our website at <strong>[Your Website URL]</strong> ("Website"). This Policy is part of our broader Privacy Policy and explains what cookies are, how we use them, and your choices regarding their use.</p>
        
        <div class="info-box">
          <p><strong>Quick Summary:</strong> We use cookies to enhance your browsing experience, analyze website traffic, and provide personalized content. You can control cookie settings through your browser or our cookie consent manager.</p>
        </div>
        
        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They serve various purposes:</p>
        <ul>
          <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
          <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period</li>
          <li><strong>First-Party Cookies:</strong> Cookies set by our website</li>
          <li><strong>Third-Party Cookies:</strong> Cookies set by external services we use</li>
        </ul>
        
        <h2>Types of Cookies We Use</h2>
        
        <h3>1. Essential Cookies (Strictly Necessary)</h3>
        <p>These cookies are essential for the Website to function properly and cannot be disabled. They include:</p>
        <ul>
          <li>Authentication cookies that keep you logged in</li>
          <li>Security cookies that protect against fraud</li>
          <li>Cookies that remember your cookie preferences</li>
          <li>Cookies that enable basic website functionality</li>
        </ul>
        
        <div class="warning-box">
          <p><strong>Important:</strong> Disabling essential cookies may prevent the Website from functioning properly or may cause certain features to be unavailable.</p>
        </div>
        
        <h3>2. Performance and Analytics Cookies</h3>
        <p>These cookies help us understand how visitors interact with our Website by collecting and reporting information anonymously. They include:</p>
        <ul>
          <li>Google Analytics cookies to track page views and user behavior</li>
          <li>Performance monitoring cookies to identify and fix technical issues</li>
          <li>Cookies that measure website loading speed and performance</li>
        </ul>
        
        <h3>3. Functional Cookies</h3>
        <p>These cookies enable enhanced functionality and personalization, such as:</p>
        <ul>
          <li>Language preference cookies</li>
          <li>Cookies that remember your form inputs</li>
          <li>Cookies that store your preferences and settings</li>
          <li>Cookies that enable social media integration</li>
        </ul>
        
        <h3>4. Marketing and Advertising Cookies</h3>
        <p>These cookies are used to deliver relevant advertisements and track marketing campaign effectiveness:</p>
        <ul>
          <li>Social media platform cookies (Facebook, Twitter, LinkedIn, etc.)</li>
          <li>Advertising network cookies (Google Ads, Facebook Ads, etc.)</li>
          <li>Retargeting cookies that show you relevant ads</li>
          <li>Cookies that track conversion rates and campaign performance</li>
        </ul>
        
        <h2>Specific Third-Party Services</h2>
        
        <h3>Google Analytics</h3>
        <p>We use Google Analytics to understand how visitors use our Website. Google Analytics uses cookies to collect information such as:</p>
        <ul>
          <li>Pages visited and time spent on each page</li>
          <li>Referring websites and search terms</li>
          <li>Device type and browser information</li>
          <li>Geographic location (country/region level)</li>
        </ul>
        <p>Google Analytics data is processed in accordance with Google's Privacy Policy. You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics Opt-out Browser Add-on</a>.</p>
        
        <h3>Social Media Platforms</h3>
        <p>Our Website may include social media features (such as Facebook "Like" buttons, Twitter feeds, etc.) that may set cookies. These platforms have their own privacy policies and cookie practices.</p>
        
        <h2>How Long Do Cookies Last?</h2>
        <p>The duration of cookies depends on their type:</p>
        <ul>
          <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
          <li><strong>Persistent Cookies:</strong> Remain for periods ranging from a few days to several years</li>
          <li><strong>Essential Cookies:</strong> Typically last for the duration of your session or up to 1 year</li>
          <li><strong>Analytics Cookies:</strong> Usually last 1-2 years</li>
          <li><strong>Marketing Cookies:</strong> May last up to 2 years or longer</li>
        </ul>
        
        <h2>Your Cookie Choices and Controls</h2>
        
        <h3>Browser Settings</h3>
        <p>Most web browsers allow you to control cookies through their settings. You can:</p>
        <ul>
          <li>View and delete existing cookies</li>
          <li>Block cookies from specific websites</li>
          <li>Block all cookies (though this may affect website functionality)</li>
          <li>Set your browser to ask for permission before setting cookies</li>
        </ul>
        
        <h3>Cookie Consent Manager</h3>
        <p>When you first visit our Website, you'll see a cookie consent banner that allows you to:</p>
        <ul>
          <li>Accept all cookies</li>
          <li>Reject non-essential cookies</li>
          <li>Customize your cookie preferences</li>
          <li>Learn more about our cookie practices</li>
        </ul>
        
        <div class="info-box">
          <p><strong>Note:</strong> You can change your cookie preferences at any time by clicking the "Cookie Settings" link in our website footer or by clearing your browser cookies.</p>
        </div>
        
        <h3>Opt-Out Links</h3>
        <p>For third-party cookies, you can also opt out directly through the service providers:</p>
        <ul>
          <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics Opt-out</a></li>
          <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener">Facebook Ad Preferences</a></li>
          <li><strong>Twitter:</strong> <a href="https://help.twitter.com/en/safety-and-security/privacy-controls-for-tailored-ads" target="_blank" rel="noopener">Twitter Privacy Controls</a></li>
        </ul>
        
        <h2>Do Not Track Signals</h2>
        <p>Some browsers include a "Do Not Track" feature that sends a signal to websites indicating that you don't want to be tracked. Currently, there is no standard for how websites should respond to these signals. We do not currently respond to "Do Not Track" signals.</p>
        
        <h2>Children's Privacy</h2>
        <p>Our Website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
        
        <h2>International Transfers</h2>
        <p>Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place to protect your information.</p>
        
        <h2>Updates to This Cookie Policy</h2>
        <p>We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will:</p>
        <ul>
          <li>Update the "Last Updated" date at the top of this Policy</li>
          <li>Notify you of significant changes through our Website or email</li>
          <li>Obtain your consent for any material changes to how we use cookies</li>
        </ul>
        
        <div class="warning-box">
          <p><strong>Important:</strong> Continued use of our Website after changes to this Policy constitutes acceptance of the updated Policy.</p>
        </div>
        
        <h2>Contact Us</h2>
        <p>If you have any questions about this Cookie Policy or our use of cookies, please contact us:</p>
        
        <div class="contact-info">
          <p><strong>[Your Company Name]</strong><br>
          <strong>Email:</strong> [Your Contact Email]<br>
          <strong>Phone:</strong> [Your Contact Phone Number]<br>
          <strong>Address:</strong> [Your Company Address]</p>
        </div>
        
        <p>We will respond to your inquiry within [Response Time] business days.</p>
        
        <h2>Additional Resources</h2>
        <p>For more information about cookies and online privacy, you may visit:</p>
        <ul>
          <li><a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener">All About Cookies</a></li>
          <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener">Your Online Choices</a></li>
          <li><a href="https://www.networkadvertising.org/" target="_blank" rel="noopener">Network Advertising Initiative</a></li>
        </ul>
        
        <div class="info-box">
          <p><strong>Thank you for taking the time to understand our Cookie Policy. We are committed to transparency and protecting your privacy while providing you with the best possible online experience.</strong></p>
        </div>
      </div>
    `
};

export const disclaimerTemplate: PolicyTemplate = {
  id: 'disclaimer',
  name: 'Disclaimer',
  description: 'Comprehensive legal disclaimers and limitations of liability',
  htmlTemplate: `
<style>
  /* ---------- Page-specific full-bleed wrapper ---------- */
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  /* remove Shopify container padding ONLY when this block is present */
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* ---------- Typography & layout (no custom colors) ---------- */
  .disclaimer { font-family: Arial, sans-serif; line-height: 1.6; }
  .disclaimer * { box-sizing: border-box; }

  .disclaimer h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .disclaimer h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .disclaimer h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }

  .disclaimer p  { font-size: 16px; margin: 0 0 1rem 0; }
  .disclaimer ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .disclaimer li { margin: 0.25rem 0; }

  .disclaimer section { margin: 0 0 2rem 0; padding: 0; }
  .disclaimer footer { margin-top: 2rem; font-size: 16px; }

  /* ensure no horizontal spacing sneaks in within the block */
  .disclaimer,
  .disclaimer section,
  .disclaimer h1,
  .disclaimer h2,
  .disclaimer h3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="disclaimer sp--fullbleed">
  <h1>Disclaimer</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>The information provided by [Your Company Name] ("we," "us," or "our") on [Your Website URL] (the "Site") and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application.</p>
  </section>

  <section>
    <h2>2. No Professional Advice</h2>
    <h3>2.1 No Legal Advice</h3>
    <p>The Site may contain general information related to legal matters. The information is not advice and should not be treated as such. You should not rely upon the information on the Site as a substitute for legal advice from a licensed professional.</p>
    <h3>2.2 No Financial Advice</h3>
    <p>Similarly, any financial information provided is for general informational purposes and is not intended as financial advice. Consult a licensed financial advisor before making any financial decisions.</p>
    <h3>2.3 No Medical Advice</h3>
    <p>Any health-related information is provided for general informational purposes and is not a substitute for professional medical advice. Always seek the guidance of a qualified health professional with any questions you may have regarding a medical condition.</p>
  </section>

  <section>
    <h2>3. External Links Disclaimer</h2>
    <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
    <p>We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Site or any website or feature linked in any banner or other advertising. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.</p>
  </section>

  <section>
    <h2>4. Testimonials Disclaimer</h2>
    <p>The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.</p>
    <p>Your individual results may vary.</p>
  </section>

  <section>
    <h2>5. Errors and Omissions</h2>
    <p>While we have made every attempt to ensure that the information contained on the Site is correct, [Your Company Name] is not responsible for any errors or omissions or for the results obtained from the use of this information.</p>
  </section>

  <section>
    <h2>6. Fair Use Disclaimer</h2>
    <p>The Site may contain copyrighted material that is not specifically authorized by the copyright owner. We believe that our use constitutes a "fair use" of any such copyrighted material as provided under section 107 of the U.S. Copyright Law.</p>
    <p>If you wish to use copyrighted material from the Site for purposes of your own that go beyond fair use, you must obtain permission from the copyright owner.</p>
  </section>

  <section>
    <h2>7. No Warranties</h2>
    <p>In no event shall [Your Company Name] be liable for any direct, indirect, special, incidental, or consequential damages, or any damages whatsoever, whether in an action of contract, negligence, or other tort, arising out of or in connection with the use of the Site or the contents of the Site.</p>
    <p>[Your Company Name] reserves the right to make additions, deletions, or modifications to the contents on the Site at any time without prior notice.</p>
  </section>

  <section>
    <h2>8. Affiliate Disclaimer</h2>
    <p>The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links.</p>
    <p>We are a participant in the [Affiliate Program Name], an affiliate advertising program designed to provide a means for us to earn advertising fees by linking to [Affiliate Website(s)].</p>
  </section>

  <section>
    <h2>9. Views Expressed Disclaimer</h2>
    <p>The Site may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other author, agency, organization, employer, or company, including [Your Company Name].</p>
    <p>Comments published by users are their sole responsibility and the users will take full responsibility, liability, and blame for any libel or litigation that results from something written in or as a direct result of something written in a comment.</p>
  </section>

  <section>
    <h2>10. No Responsibility</h2>
    <p>The information on the Site is provided with the understanding that [Your Company Name] is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal, or other competent advisers.</p>
  </section>

  <section>
    <h2>11. "Use at Your Own Risk" Disclaimer</h2>
    <p>All information on the Site is provided "as is," with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information, and without warranty of any kind, express or implied.</p>
    <p>[Your Company Name] will not be liable to you or anyone else for any decision made or action taken in reliance on the information given by the Site or for any consequential, special, or similar damages, even if advised of the possibility of such damages.</p>
  </section>

  <section>
    <h2>12. Contact Us</h2>
    <p>If you have any questions about this Disclaimer, you can contact us:</p>
    <ul>
      <li><strong>By email:</strong> [Your Contact Email]</li>
      <li><strong>By visiting this page on our website:</strong> [Contact Us Page URL]</li>
      <li><strong>By phone number:</strong> [Your Contact Phone Number]</li>
      <li><strong>By mail:</strong> [Your Company Address]</li>
    </ul>
  </section>

  <footer>
    <p>[Your Company Name]<br>[Your Company Address]</p>
  </footer>
</div>
  `
};

export const paymentPolicyTemplate: PolicyTemplate = {
  id: 'payment',
  name: 'Payment Policy',
  description: 'Complete payment methods, security measures, and transaction procedures',
  htmlTemplate: `
<style>
  /* ---------- Page-specific full-bleed wrapper ---------- */
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  /* remove Shopify container padding ONLY when this block is present */
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* ---------- Typography & layout (no custom colors) ---------- */
  .payment-options { font-family: Arial, sans-serif; line-height: 1.6; }
  .payment-options * { box-sizing: border-box; }

  .payment-options h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .payment-options h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .payment-options h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }
  .payment-options h4 { font-size: 18px; margin: 1rem 0 0.5rem 0; }

  .payment-options p  { font-size: 16px; margin: 0 0 1rem 0; }
  .payment-options ul,
  .payment-options ol { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .payment-options li { margin: 0.25rem 0; }

  .payment-options section { margin: 0 0 2rem 0; padding: 0; }
  .payment-options footer { margin-top: 2rem; font-size: 16px; }

  /* ensure no horizontal spacing sneaks in within the block */
  .payment-options,
  .payment-options section,
  .payment-options h1,
  .payment-options h2,
  .payment-options h3,
  .payment-options h4 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="payment-options sp--fullbleed">
  <h1>Payment Options</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>At [WEBSITE NAME], we highly value your safety and convenience. We offer a variety of secure and easy-to-use payment methods that comply with all applicable laws and regulations in [SELLING COUNTRIES].</p>
  </section>

  <section>
    <h2>2. Accepted Payment Methods</h2>

    <h3>2.1 iDEAL</h3>
    <p><strong>Secure Online Banking in the Netherlands</strong><br>iDEAL allows you to make online payments in a secure and straightforward manner within your own bank's online banking environment. It is widely used in the Netherlands.</p>
    <h4>How it Works:</h4>
    <ol>
      <li>Choose iDEAL as your payment method at checkout.</li>
      <li>Select your bank from the provided list.</li>
      <li>You will be redirected to your bank's login page to complete the payment.</li>
      <li>Follow your bank's instructions to authorize the transaction.</li>
      <li>Once the transaction is confirmed, you will be redirected back to our site, and we will send you a confirmation of your purchase.</li>
    </ol>

    <h3>2.2 Bancontact</h3>
    <p><strong>Trusted Payment Service in Belgium</strong><br>Bancontact is a reliable and established payment method in Belgium that enables safe and easy transactions.</p>
    <h4>How it Works:</h4>
    <ol>
      <li>Choose Bancontact as your payment method at checkout.</li>
      <li>Enter your card details or scan the QR code with the Bancontact app.</li>
      <li>Confirm the payment by following your bank's security procedures.</li>
      <li>After the payment is confirmed, you will be redirected back to our site to receive a confirmation.</li>
    </ol>

    <h3>2.3 SOFORT Banking</h3>
    <p><strong>Direct Banking Across Europe</strong><br>SOFORT is a payment method that allows you to make direct online transfers from your bank account. It is available in multiple European countries and is known for its safety and immediacy.</p>
    <h4>How it Works:</h4>
    <ol>
      <li>Select SOFORT Banking as your payment option at checkout.</li>
      <li>Choose your country and select your bank.</li>
      <li>Log in with your online banking credentials.</li>
      <li>Confirm the transaction using your usual authentication method (e.g., PIN or TAN).</li>
      <li>After the transaction, you will be redirected back to our site for order confirmation.</li>
    </ol>

    <h3>2.4 Credit and Debit Cards</h3>
    <p><strong>We accept all major credit and debit cards:</strong><br>Visa, Mastercard, American Express</p>
    <h4>How it Works:</h4>
    <ol>
      <li>Select your preferred card option at checkout.</li>
      <li>Enter your card details, including the card number, expiration date, and CVV code.</li>
      <li>Your payment will be securely processed through our encrypted payment gateway.</li>
      <li>Once approved, you will receive an order confirmation via email.</li>
    </ol>

    <h3>2.5 PayPal</h3>
    <p><strong>Secure Online Payments Worldwide</strong><br>Pay quickly and securely using your PayPal account.</p>
    <h4>How it Works:</h4>
    <ol>
      <li>Choose PayPal as your payment method at checkout.</li>
      <li>You will be redirected to the PayPal login page.</li>
      <li>Log in to your PayPal account and confirm the payment.</li>
      <li>After confirmation, you will be redirected back to our website with your order details.</li>
    </ol>
  </section>

  <section>
    <h2>3. Security and Data Protection</h2>
    <p>Your security is our highest priority. All transactions are encrypted and processed through secure payment gateways that comply with industry standards.</p>
    <ul>
      <li><strong>SSL Encryption:</strong> Our website uses Secure Socket Layer (SSL) encryption to protect your personal and financial information during transmission.</li>
      <li><strong>PCI Compliance:</strong> Our payment processors are Payment Card Industry Data Security Standard (PCI DSS) compliant.</li>
      <li><strong>Privacy Policy:</strong> Please refer to our Privacy Policy for detailed information on how we handle your data.</li>
    </ul>
  </section>

  <section>
    <h2>4. Customer Support</h2>
    <p>If you encounter any issues or have questions about your payment, please do not hesitate to contact our customer service team.</p>
    <ul>
      <li><strong>Email:</strong> [CUSTOMER SERVICE EMAIL]</li>
      <li><strong>Phone:</strong> [CUSTOMER SERVICE PHONE]</li>
      <li><strong>Address:</strong> [COMPANY ADDRESS]</li>
    </ul>
    <p>Our support team is available to assist you [Hours of Operation, e.g., Monday to Friday, 9 AM to 5 PM CET].</p>
  </section>

  <section>
    <h2>5. Compliance with [SELLING COUNTRIES] Legislation</h2>
    <p>All our payment methods and processes strictly comply with the laws and regulations of [SELLING COUNTRIES].</p>
  </section>

  <section>
    <h2>6. Payment Confirmation</h2>
    <p>After completing your payment, you will receive:</p>
    <ul>
      <li><strong>Order Confirmation:</strong> An email containing your order details and confirmation.</li>
      <li><strong>Receipt:</strong> A digital receipt for your records.</li>
    </ul>
    <p>If you do not receive a confirmation email within [Time Frame, e.g., 1 hour], please check your spam folder or contact our customer service.</p>
  </section>

  <section>
    <h2>7. Currency</h2>
    <p>All transactions are processed in [Currency, e.g., Euros (€)]. If your bank account is in a different currency, your bank may apply currency conversion rates and fees.</p>
  </section>

  <section>
    <h2>8. Fraud Prevention</h2>
    <p>To protect our customers and maintain a secure shopping environment:</p>
    <ul>
      <li><strong>Verification:</strong> We may perform verification checks and request additional information before accepting an order.</li>
      <li><strong>Suspicious Activity:</strong> Orders suspected of fraud or unauthorized activity will be investigated, and appropriate action will be taken, which may include cancellation of the order.</li>
    </ul>
  </section>

  <section>
    <h2>9. Changes to Payment Options</h2>
    <p>We reserve the right to add or remove payment methods at any time. Updates will be posted on this page. We encourage you to review this Payment Options page regularly.</p>
  </section>

  <section>
    <h2>10. Terms and Conditions</h2>
    <p>By making a purchase on [WEBSITE NAME], you agree to our Terms and Conditions and Return and Refund Policy.</p>
  </section>

  <footer>
    <p><strong>[WEBSITE NAME]</strong><br>
    [WEBSITE URL]<br>
    [SELLING COUNTRIES]<br>
    [TODAY'S DATE, e.g., 12 November 2023]</p>
  </footer>
</div>
  `
};

export const returnRefundPolicyTemplate: PolicyTemplate = {
  id: 'return-refund',
  name: 'Return and Refund Policy',
  description: 'Complete return and refund policy with timelines, conditions, and procedures',
  htmlTemplate: `<style>
  /* ---------- Page-specific full-bleed wrapper ---------- */
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  /* remove Shopify container padding ONLY when this block is present */
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* ---------- Typography & layout (no custom colors) ---------- */
  .return-refund { font-family: Arial, sans-serif; line-height: 1.6; }
  .return-refund * { box-sizing: border-box; }

  .return-refund h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .return-refund h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .return-refund h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }
  .return-refund h4 { font-size: 18px; margin: 1rem 0 0.5rem 0; }

  .return-refund p  { font-size: 16px; margin: 0 0 1rem 0; }
  .return-refund ul,
  .return-refund ol { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .return-refund li { margin: 0.25rem 0; }

  .return-refund section { margin: 0 0 2rem 0; padding: 0; }
  .return-refund footer { margin-top: 2rem; font-size: 16px; }

  /* ensure no horizontal spacing sneaks in within the block */
  .return-refund,
  .return-refund section,
  .return-refund h1,
  .return-refund h2,
  .return-refund h3,
  .return-refund h4 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="return-refund sp--fullbleed">
  <h1>Return and Refund Policy</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Scope and Intent</h2>
    <p>This Return and Refund Policy applies to all purchases made through the [Your Company Name] website located at [Your Website URL] ("Website").</p>
  </section>

  <section>
    <h2>2. Contact Information</h2>
    <p>For questions about returns and refunds, please contact our Customer Service team:</p>
    <ul>
      <li><strong>Email:</strong> [Customer Service Email]</li>
      <li><strong>Phone:</strong> [Customer Service Phone Number]</li>
      <li><strong>Address:</strong> [COMPANY ADDRESS]</li>
    </ul>
    <p><strong>Hours:</strong> [Days and Hours of Operation, e.g., Monday to Friday, 9 AM to 5 PM EST]</p>
  </section>

  <section>
    <h2>3. Return Eligibility</h2>
    <p>Customers in [Selling Countries/Regions] have the right to cancel their purchase and return the product within [Number of Days, e.g., 14 days] of receipt without providing any reason, subject to the conditions outlined below.</p>
    <h3>3.1 Conditions for Return</h3>
    <ul>
      <li><strong>Unused and Undamaged:</strong> The item must be unused, undamaged, and in the same condition that you received it.</li>
      <li><strong>Original Packaging:</strong> The item must be in the original packaging, with all labels and tags attached.</li>
      <li><strong>Proof of Purchase:</strong> A receipt or proof of purchase is required.</li>
    </ul>
  </section>

  <section>
    <h2>4. Return Process</h2>
    <h3>4.1 Initiating a Return</h3>
    <p>To initiate a return:</p>
    <ul>
      <li>Contact Customer Service: Email us at [Customer Service Email] or call [Customer Service Phone Number] within [Number of Days] days of receiving your order.</li>
      <li>Provide your order number and a detailed reason for the return.</li>
    </ul>
    <h3>4.2 Preparing Your Return</h3>
    <p>Package the item safely:</p>
    <ul>
      <li>Securely pack the item in its original packaging.</li>
      <li>Ensure all accessories, manuals, and free gifts are included.</li>
    </ul>
    <p>Include Documentation:</p>
    <ul>
      <li>Include the return authorization form and any necessary supporting documents or images.</li>
    </ul>
    <p>Attach Shipping Label:</p>
    <ul>
      <li>Download and print the return shipping label provided in our email.</li>
      <li>Affix the label to the outside of the package.</li>
    </ul>
    <h3>4.3 Shipping the Return</h3>
    <p>Shipping Method:</p>
    <ul>
      <li>Use [Preferred Shipping Method, e.g., a trackable courier service].</li>
    </ul>
    <p>Return Window:</p>
    <ul>
      <li>Ship the item within [Number of Days] days after receiving the return authorization.</li>
    </ul>
  </section>

  <section>
    <h2>5. Return Shipping Costs</h2>
    <p><strong>Customer Responsibility:</strong> All return shipping costs are the responsibility of the customer.</p>
  </section>

  <section>
    <h2>6. Specific Return and Refund Conditions</h2>
    <h3>6.1 Returns Due to Change of Mind</h3>
    <ul>
      <li><strong>Eligibility:</strong> Items must be unused, undamaged, and in original packaging. Return request must be made within [Number of Days] days of receipt.</li>
      <li><strong>Refund:</strong> A refund will be issued to the original payment method, minus any applicable restocking fees.</li>
    </ul>
    <h3>6.2 Defective or Damaged Goods</h3>
    <ul>
      <li><strong>Notification:</strong> Contact us within [Number of Days, e.g., 48 hours] of receiving the item.</li>
      <li><strong>Documentation:</strong> Provide photos or videos of the defect or damage.</li>
      <li><strong>Resolution:</strong> We will offer a replacement or a full refund, including return shipping costs.</li>
    </ul>
    <h3>6.3 Incorrect Product Received</h3>
    <ul>
      <li><strong>Notification:</strong> Inform us immediately upon receipt.</li>
      <li><strong>Resolution:</strong> We will arrange for the incorrect item to be returned (at our expense) and ensure you receive the correct product.</li>
    </ul>
    <h3>6.4 Product Never Arrived</h3>
    <ul>
      <li><strong>Notification:</strong> Contact us if your product does not arrive within the estimated delivery time.</li>
      <li><strong>Resolution:</strong> We will initiate an investigation with the carrier. If the product is confirmed lost, we will offer a full refund or send a replacement product.</li>
    </ul>
    <h3>6.5 Order Cancellation</h3>
    <ul>
      <li><strong>Before Shipment:</strong> You can cancel your order for a full refund if it has not yet been shipped.</li>
      <li><strong>After Shipment:</strong> If the order has already been shipped, please follow the return procedure after receiving the product.</li>
    </ul>
  </section>

  <section>
    <h2>7. Exceptions to the Return Policy</h2>
    <p>The following items are non-returnable and non-refundable:</p>
    <ul>
      <li><strong>Custom or Personalized Products:</strong> Items made to your specifications or clearly personalized.</li>
      <li><strong>Perishable Goods:</strong> Such as food, flowers, newspapers, or magazines.</li>
      <li><strong>Intimate or Sanitary Goods:</strong> Including underwear, swimwear, and personal care items, unless unopened and unused.</li>
      <li><strong>Gift Cards and Downloadable Software Products.</strong></li>
    </ul>
  </section>

  <section>
    <h2>8. Refunds</h2>
    <h3>8.1 Refund Conditions</h3>
    <ul>
      <li><strong>Approval:</strong> Refunds are issued after we receive and inspect the returned item.</li>
      <li><strong>Notification:</strong> We will notify you via email regarding the approval or rejection of your refund.</li>
      <li><strong>Condition:</strong> Items must meet the return eligibility criteria outlined in Section 3.</li>
    </ul>
    <h3>8.2 Refund Processing</h3>
    <ul>
      <li><strong>Method:</strong> Refunds will be processed to the original payment method used at the time of purchase.</li>
      <li><strong>Time Frame:</strong> It may take up to [Number of Days, e.g., 14 days] for the refund to appear in your account, depending on your bank or credit card issuer.</li>
    </ul>
    <h3>8.3 Partial Refunds</h3>
    <p>Partial refunds may be granted in certain situations:</p>
    <ul>
      <li><strong>Condition Issues:</strong> Items not in original condition, damaged, or missing parts for reasons not due to our error.</li>
      <li><strong>Late Returns:</strong> Items returned more than [Number of Days] days after delivery.</li>
    </ul>
  </section>

  <section>
    <h2>9. Exchanges</h2>
    <h3>Eligibility:</h3>
    <p>We replace items if they are defective, damaged, or incorrect.</p>
    <h3>Process:</h3>
    <p>To request an exchange, contact us at [Customer Service Email].</p>
    <h3>Shipping Costs:</h3>
    <ul>
      <li>For defective or incorrect items, we cover the shipping costs.</li>
      <li>For exchanges due to change of mind, customers are responsible for shipping costs.</li>
    </ul>
  </section>

  <section>
    <h2>10. Timelines</h2>
    <ul>
      <li><strong>Return Window:</strong> Returns must be reported and shipped within [Number of Days, e.g., 14 days] of receiving the product.</li>
      <li><strong>Return Processing:</strong> After receiving and inspecting the returned item, we will process the refund within [Number of Days, e.g., 14 days].</li>
      <li><strong>Refund Period:</strong> It may take up to [Number of Days, e.g., 14 days] for the refund to appear in your account after approval.</li>
    </ul>
  </section>

  <section>
    <h2>11. Legal Rights</h2>
    <p>This Return and Refund Policy does not affect any statutory rights you may have under applicable law.</p>
  </section>

  <section>
    <h2>12. Questions and Support</h2>
    <p>For more information, please:</p>
    <ul>
      <li>Visit our <a href="[Insert FAQ Link]">FAQ Page</a></li>
      <li>Contact our Customer Service team:
        <ul>
          <li>Email: [Customer Service Email]</li>
          <li>Phone: [Customer Service Phone Number]</li>
        </ul>
      </li>
    </ul>
  </section>

  <footer>
    <p>Note: By making a purchase on our Website, you agree to this Return and Refund Policy.</p>
    <p>[Your Company Name]<br>[Email]<br>[Phone]<br>[Your Company Address]</p>
  </footer>
</div>
`
};

export const privacyPolicyTemplate: PolicyTemplate = {
    id: 'privacy',
    name: 'Privacy Policy',
  description: 'Comprehensive privacy policy with data collection, usage, and protection information',
  htmlTemplate: `<style>
.sp--fullbleed {
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.privacy-policy {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #fff;
}

.privacy-policy h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 3px solid #3182ce;
  padding-bottom: 1rem;
}

.privacy-policy h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 2rem 0 1rem 0;
  padding: 0.5rem 0;
  border-left: 4px solid #3182ce;
  padding-left: 1rem;
}

.privacy-policy h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #4a5568;
  margin: 1.5rem 0 0.5rem 0;
}

.privacy-policy p {
  margin-bottom: 1rem;
  text-align: justify;
}

.privacy-policy ul {
  margin: 1rem 0;
  padding-left: 2rem;
}

.privacy-policy li {
  margin-bottom: 0.5rem;
}

.privacy-policy strong {
  color: #2d3748;
  font-weight: 600;
}

.privacy-policy .highlight-box {
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.privacy-policy .info-box {
  background: #f0fff4;
  border: 1px solid #c6f6d5;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.privacy-policy .warning-box {
  background: #fffaf0;
  border: 1px solid #fbd38d;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.privacy-policy .contact-info {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: center;
}

.privacy-policy .contact-info h3 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.privacy-policy .contact-info p {
  margin: 0.5rem 0;
  text-align: center;
}

.privacy-policy .contact-info a {
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
}

.privacy-policy .contact-info a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .privacy-policy {
    padding: 20px 15px;
  }
  
  .privacy-policy h1 {
    font-size: 2rem;
  }
  
  .privacy-policy h2 {
    font-size: 1.5rem;
  }
  
  .privacy-policy h3 {
    font-size: 1.2rem;
  }
}
</style>

<div class="privacy-policy sp--fullbleed">
  <h1>Privacy Policy</h1>
  
  <div class="highlight-box">
    <p><strong>Effective Date:</strong> [Insert Effective Date]</p>
    <p><strong>Last Updated:</strong> [Insert Effective Date]</p>
  </div>

  <h2>1. Introduction</h2>
  <p>[Your Company Name] ("we", "our", or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [Your Website URL] or use our services.</p>
  
  <p>By accessing or using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.</p>

  <h2>2. Information We Collect</h2>
  <h3>2.1 Personal Information</h3>
  <p>We may collect the following types of personal information:</p>
  <ul>
    <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
    <li><strong>Account Information:</strong> Username, password, and account preferences</li>
    <li><strong>Payment Information:</strong> Credit card details, billing address, and payment history</li>
    <li><strong>Order Information:</strong> Purchase history, shipping details, and product preferences</li>
    <li><strong>Communication Data:</strong> Correspondence with our customer service team</li>
  </ul>

  <h3>2.2 Automatically Collected Information</h3>
  <p>When you visit our website, we automatically collect certain information:</p>
  <ul>
    <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
    <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and navigation patterns</li>
    <li><strong>Location Data:</strong> General geographic location based on IP address</li>
    <li><strong>Cookies and Tracking:</strong> Information stored on your device to enhance your experience</li>
  </ul>

  <div class="info-box">
    <p><strong>Note:</strong> We only collect information that is necessary to provide our services and improve your experience. You can control many aspects of data collection through your browser settings and our privacy controls.</p>
  </div>

  <h2>3. How We Use Your Information</h2>
  <p>We use the collected information for the following purposes:</p>
  <ul>
    <li><strong>Service Provision:</strong> To process orders, provide customer support, and deliver products</li>
    <li><strong>Communication:</strong> To send order confirmations, shipping updates, and respond to inquiries</li>
    <li><strong>Personalization:</strong> To customize your experience and provide relevant product recommendations</li>
    <li><strong>Security:</strong> To protect against fraud, unauthorized access, and other security threats</li>
    <li><strong>Improvement:</strong> To analyze usage patterns and enhance our website and services</li>
    <li><strong>Marketing:</strong> To send promotional offers and newsletters (with your consent)</li>
  </ul>

  <h2>4. Information Sharing and Disclosure</h2>
  <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:</p>
  
  <h3>4.1 Service Providers</h3>
  <p>We work with trusted third-party service providers who assist us in operating our business:</p>
  <ul>
    <li>Payment processors for secure transaction handling</li>
    <li>Shipping partners for order fulfillment</li>
    <li>IT service providers for website maintenance and security</li>
    <li>Analytics providers for website performance insights</li>
  </ul>

  <h3>4.2 Legal Requirements</h3>
  <p>We may disclose your information when required by law or to:</p>
  <ul>
    <li>Comply with legal obligations and court orders</li>
    <li>Protect our rights, property, and safety</li>
    <li>Investigate potential violations of our terms of service</li>
    <li>Prevent fraud and security threats</li>
  </ul>

  <h3>4.3 Business Transfers</h3>
  <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction. We will notify you of any such changes and ensure your information remains protected.</p>

  <h2>5. Data Security</h2>
  <p>We implement comprehensive security measures to protect your personal information:</p>
  <ul>
    <li><strong>Encryption:</strong> All sensitive data is encrypted using industry-standard SSL/TLS protocols</li>
    <li><strong>Access Controls:</strong> Strict access controls limit who can view your personal information</li>
    <li><strong>Regular Audits:</strong> We conduct regular security assessments and updates</li>
    <li><strong>Employee Training:</strong> Our staff receives regular training on data protection practices</li>
  </ul>

  <div class="warning-box">
    <p><strong>Important:</strong> While we implement robust security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to protecting your information to the best of our ability.</p>
  </div>

  <h2>6. Cookies and Tracking Technologies</h2>
  <p>We use cookies and similar technologies to enhance your browsing experience:</p>
  
  <h3>6.1 Types of Cookies</h3>
  <ul>
    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
    <li><strong>Performance Cookies:</strong> Help us understand how visitors use our website</li>
    <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
    <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements and content</li>
  </ul>

  <h3>6.2 Managing Cookies</h3>
  <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
  <ul>
    <li>Block all cookies</li>
    <li>Delete existing cookies</li>
    <li>Set preferences for specific websites</li>
    <li>Receive notifications when cookies are set</li>
  </ul>

  <h2>7. Your Privacy Rights</h2>
  <p>Depending on your location, you may have the following rights regarding your personal information:</p>
  <ul>
    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
    <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete information</li>
    <li><strong>Deletion:</strong> Request that we delete your personal information</li>
    <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
    <li><strong>Restriction:</strong> Request that we limit how we use your information</li>
    <li><strong>Objection:</strong> Object to certain types of processing</li>
  </ul>

  <h2>8. Data Retention</h2>
  <p>We retain your personal information only for as long as necessary to:</p>
  <ul>
    <li>Provide our services and fulfill orders</li>
    <li>Comply with legal obligations</li>
    <li>Resolve disputes and enforce agreements</li>
    <li>Improve our services and user experience</li>
  </ul>
  
  <p>When we no longer need your information, we securely delete or anonymize it.</p>

  <h2>9. International Data Transfers</h2>
  <p>Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.</p>

  <h2>10. Children's Privacy</h2>
  <p>Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>

  <h2>11. Third-Party Links</h2>
  <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.</p>

  <h2>12. Changes to This Privacy Policy</h2>
  <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:</p>
  <ul>
    <li>Posting the updated policy on our website</li>
    <li>Sending an email notification to registered users</li>
    <li>Displaying a prominent notice on our website</li>
  </ul>
  
  <p>Your continued use of our services after any changes indicates your acceptance of the updated policy.</p>

  <h2>13. Contact Information</h2>
  <div class="contact-info">
    <h3>Questions About This Privacy Policy?</h3>
    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
    
    <p><strong>Email:</strong> <a href="mailto:[Your Contact Email]">[Your Contact Email]</a></p>
    <p><strong>Phone:</strong> <a href="tel:[Your Contact Phone Number]">[Your Contact Phone Number]</a></p>
    <p><strong>Address:</strong> [Your Company Address]</p>
    
    <p><strong>Data Protection Officer:</strong> [Your Contact Email]</p>
  </div>

  <div class="info-box">
    <p><strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 30 days. For urgent matters, please include "URGENT" in your subject line.</p>
  </div>
</div>`
};

export const termsOfServiceTemplate: PolicyTemplate = {
    id: 'terms',
    name: 'Terms of Service',
  description: 'Comprehensive terms of service with user rights, responsibilities, and legal obligations',
  htmlTemplate: `<style>
  /* ---------- Page-specific full-bleed wrapper ---------- */
  .sp--fullbleed {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: 0 !important;
  }
  /* remove Shopify container padding ONLY when this block is present */
  .page-width:has(.sp--fullbleed),
  .section-template--main .page-width:has(.sp--fullbleed),
  .rte:has(.sp--fullbleed) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* ---------- Typography & layout (no custom colors) ---------- */
  .tos { font-family: Arial, sans-serif; line-height: 1.6; }
  .tos * { box-sizing: border-box; }

  .tos h1 { font-size: 36px; margin: 0 0 0.75rem 0; }
  .tos h2 { font-size: 28px; margin: 2rem 0 0.75rem 0; }
  .tos h3 { font-size: 22px; margin: 1.25rem 0 0.5rem 0; }

  .tos p  { font-size: 16px; margin: 0 0 1rem 0; }
  .tos ul { font-size: 16px; margin: 0 0 1rem 1.25rem; padding: 0; }
  .tos li { margin: 0.25rem 0; }

  .tos section { margin: 0 0 2rem 0; padding: 0; }

  /* ensure no horizontal spacing sneaks in within the block */
  .tos,
  .tos section,
  .tos h1,
  .tos h2,
  .tos h3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<div class="tos sp--fullbleed">
  <h1>Terms of Service</h1>
  <p><strong>Effective Date:</strong> [Insert Effective Date]</p>

  <section>
    <h2>1. Introduction</h2>
    <p>Welcome to [WEBSITE NAME] ("Company", "we", "our", "us"). These Terms of Service ("Terms") govern your access to and use of our website located at [Your Website URL] ("Website") and any related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use our Services.</p>
  </section>

  <section>
    <h2>2. Eligibility</h2>
    <p>By using the Services, you represent and warrant that you are at least [Insert Age, e.g., 13 or 16] years old, and have the legal capacity to enter into these Terms. If you are using the Services on behalf of a company or other legal entity, you have the authority to bind that entity to these Terms.</p>
  </section>

  <section>
    <h2>3. Accounts and Registration</h2>
    <h3>3.1 Account Creation</h3>
    <p>To access certain features of the Services, you may be required to create an account. You agree to:</p>
    <ul>
      <li>Provide true, accurate, current, and complete information during the registration process.</li>
      <li>Maintain and promptly update your account information to keep it accurate and current.</li>
    </ul>

    <h3>3.2 Account Responsibilities</h3>
    <p>You are responsible for:</p>
    <ul>
      <li>Maintaining the confidentiality of your account login credentials.</li>
      <li>All activities that occur under your account.</li>
      <li>Notifying us immediately of any unauthorized use of your account.</li>
    </ul>
  </section>

  <section>
    <h2>4. Orders and Payment</h2>
    <h3>4.1 Product Availability</h3>
    <p>All products listed on the Website are subject to availability. We reserve the right to limit the quantities of any products or services that we offer.</p>

    <h3>4.2 Pricing</h3>
    <p>Prices for our products are subject to change without notice. We are not liable for any price changes, modifications, or discontinuance of products.</p>

    <h3>4.3 Payment Terms</h3>
    <ul>
      <li><strong>Accepted Payment Methods:</strong> [List accepted payment methods, e.g., Visa, MasterCard, PayPal, etc.]</li>
      <li><strong>Payment Processing:</strong> Payments are processed securely through [Payment Gateway Name].</li>
      <li><strong>Billing Information:</strong> You agree to provide current, complete, and accurate billing information.</li>
    </ul>

    <h3>4.4 Order Acceptance</h3>
    <p>We reserve the right to refuse or cancel any order for reasons including but not limited to:</p>
    <ul>
      <li>Product or service availability.</li>
      <li>Errors in the description or price of the product.</li>
      <li>Suspected fraudulent or unauthorized transactions.</li>
    </ul>
  </section>

  <section>
    <h2>5. Shipping and Delivery</h2>
    <h3>5.1 Shipping Policy</h3>
    <p>Please refer to our <a href="[Insert Link to Shipping Policy]">Shipping Policy</a> for information on our shipping policy.</p>

    <h3>5.2 Risk of Loss</h3>
    <p>All purchases are made pursuant to a shipment contract. Risk of loss and title for items pass to you upon our delivery to the carrier.</p>
  </section>

  <section>
    <h2>6. Returns and Refunds</h2>
    <p>Please refer to our <a href="[Insert Link to Refund Policy]">Return and Refund Policy</a> for information on returns, exchanges, and refunds.</p>
  </section>

  <section>
    <h2>7. Intellectual Property Rights</h2>
    <h3>7.1 Ownership</h3>
    <p>All content on the Website, including text, graphics, logos, images, and software, is the property of [WEBSITE NAME] or its content suppliers and is protected by intellectual property laws.</p>

    <h3>7.2 Limited License</h3>
    <p>We grant you a limited, non-exclusive, non-transferable license to access and use the Services for personal, non-commercial purposes.</p>

    <h3>7.3 Restrictions</h3>
    <p>You agree not to:</p>
    <ul>
      <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Services without express written permission.</li>
      <li>Use any meta tags or other hidden text using our name or trademarks without our express written consent.</li>
    </ul>
  </section>

  <section>
    <h2>8. User Content</h2>
    <h3>8.1 Submissions</h3>
    <p>If you submit or post any content ("User Content") to the Services, you grant us a non-exclusive, royalty-free, worldwide, perpetual license to use, reproduce, modify, and display such content.</p>

    <h3>8.2 Prohibited Content</h3>
    <p>You agree not to submit any User Content that:</p>
    <ul>
      <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy.</li>
      <li>Infringes on any intellectual property or other proprietary rights of any party.</li>
    </ul>
  </section>

  <section>
    <h2>9. Prohibited Activities</h2>
    <p>You agree not to engage in any of the following prohibited activities:</p>
    <ul>
      <li><strong>Violating Laws and Rights:</strong> Use the Services for any illegal purpose or in violation of any local, state, national, or international law.</li>
      <li><strong>Disruption:</strong> Interfere with or disrupt the Services or servers or networks connected to the Services.</li>
      <li><strong>Unauthorized Access:</strong> Attempt to gain unauthorized access to any portion of the Services or any other accounts, computer systems, or networks connected to the Services.</li>
    </ul>
  </section>

  <section>
    <h2>10. Disclaimers and Warranties</h2>
    <h3>10.1 "AS IS" Basis</h3>
    <p>The Services are provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the Services.</p>

    <h3>10.2 No Warranty</h3>
    <p>We do not warrant that:</p>
    <ul>
      <li>The Services will meet your specific requirements.</li>
      <li>The Services will be uninterrupted, timely, secure, or error-free.</li>
      <li>The results obtained from the use of the Services will be accurate or reliable.</li>
    </ul>
  </section>

  <section>
    <h2>11. Limitation of Liability</h2>
    <p>In no event shall [Your Company Name], its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising from:</p>
    <ul>
      <li>Your use or inability to use the Services.</li>
      <li>Any unauthorized access to or use of our servers and/or any personal information stored therein.</li>
      <li>Any interruption or cessation of transmission to or from the Services.</li>
    </ul>
  </section>

  <section>
    <h2>12. Indemnification</h2>
    <p>You agree to indemnify, defend, and hold harmless [Your Company Name] and its affiliates from any claims, damages, obligations, losses, liabilities, costs, or debt arising from:</p>
    <ul>
      <li>Your use of and access to the Services.</li>
      <li>Your violation of any term of these Terms.</li>
      <li>Your violation of any third-party right, including intellectual property or privacy rights.</li>
    </ul>
  </section>

  <section>
    <h2>13. Termination</h2>
    <p>We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason, including if you breach these Terms.</p>
  </section>

  <section>
    <h2>14. Governing Law</h2>
    <p>These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.</p>
  </section>

  <section>
    <h2>15. Dispute Resolution</h2>
    <p>[Add dispute resolution details here]</p>
  </section>

  <section>
    <h2>16. Changes to Terms</h2>
    <p>We reserve the right to modify or replace these Terms at any time. Changes will be effective immediately upon posting to the Website. It is your responsibility to review these Terms periodically.</p>
  </section>

  <section>
    <h2>17. Miscellaneous</h2>
    <h3>17.1 Severability</h3>
    <p>If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions shall remain in effect.</p>
    <h3>17.2 Entire Agreement</h3>
    <p>These Terms constitute the entire agreement between us regarding our Services and supersede any prior agreements.</p>
    <h3>17.3 Waiver</h3>
    <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
  </section>

  <section>
    <h2>18. Contact Information</h2>
    <p>If you have any questions about these Terms, please contact us:</p>
    <ul>
      <li><strong>Company Name:</strong> [Your Company Name]</li>
      <li><strong>Address:</strong> [Your Company Address]</li>
      <li><strong>Email:</strong> [Your Contact Email]</li>
      <li><strong>Phone:</strong> [Your Contact Phone Number]</li>
    </ul>
  </section>
</div>
`
};

// Export all available templates
export const policyTemplates: PolicyTemplate[] = [
  shippingPolicyTemplate,
  billingTermsTemplate,
  cookiePolicyTemplate,
  disclaimerTemplate,
  paymentPolicyTemplate,
  returnRefundPolicyTemplate,
  privacyPolicyTemplate,
  termsOfServiceTemplate
]; 