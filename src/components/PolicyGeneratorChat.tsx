import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  User, 
  Bot, 
  Download, 
  FileText,
  CheckCircle
} from 'lucide-react';
import './PolicyGeneratorChat.css';

interface PolicyData {
  // Business Information
  legalBusinessName: string;
  storeWebsiteName: string;
  primaryWebsiteDomain: string;
  countryOfIncorporation: string;
  fullStreetAddress: string;
  mainContactEmail: string;
  phoneNumber: string;
  customerServiceHours: string;
  isoCurrencyCode: string;
  
  // Shipping Information
  domesticFreeShippingThreshold: string;
  domesticFlatRateShippingFee: string;
  internationalFlatRateShippingFee: string;
  orderProcessingTime: string;
  dailyOrderCutoff: string;
  domesticDeliveryEstimateStandard: string;
  domesticDeliveryEstimateExpedited: string;
  internationalDeliveryEstimate: string;
  
  // Returns and Policies
  returnWindowDays: string;
  shipToCountries: string;
  domesticCarriers: string;
  internationalCarriers: string;
  acceptedPayments: string;
  sellingRegions: string;
  exemptProductCategories: string;
  
  // Additional Information
  cookieList: string;
  affiliateProgramName: string;
  governingLawState: string;
  trackOrderURL: string;
  faqPageURL: string;
  returnPolicyURL: string;
  termsOfServicePageURL: string;
  contactPageURL: string;
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isQuestion?: boolean;
  questionField?: keyof PolicyData;
  options?: string[];
  inputType?: 'text' | 'email' | 'url' | 'domain' | 'select' | 'textarea';
  defaultValue?: string;
  isReview?: boolean;
  isEditing?: boolean;
  isEditedReview?: boolean;
}

interface Question {
  id: number;
  field: keyof PolicyData;
  question: string;
  guidance: string;
  type: 'text' | 'email' | 'url' | 'domain' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  group: string;
}

const PolicyGeneratorChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [policyData, setPolicyData] = useState<PolicyData>({} as PolicyData);
  const [chatPhase, setChatPhase] = useState<'intro' | 'questions' | 'review' | 'selection' | 'complete'>('intro');
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [generatedPolicies, setGeneratedPolicies] = useState<{[key: string]: string}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions: Question[] = [
    // Business Information Group
    {
      id: 1,
      field: 'legalBusinessName',
      question: 'What is your legal business name?',
      guidance: 'Please enter the exact name shown on your formation documents (for example, Sauna Haven USA LLC).',
      type: 'text',
      required: true,
      group: 'Business Information'
    },
    {
      id: 2,
      field: 'storeWebsiteName',
      question: 'What is your store / website name?',
      guidance: 'Type the public-facing brand name exactly as you want it displayed (for example, Sauna Haven USA).',
      type: 'text',
      required: true,
      group: 'Business Information'
    },
    {
      id: 3,
      field: 'primaryWebsiteDomain',
      question: 'What is your primary website domain?',
      guidance: 'Type just the domain, such as SaunaHavenUSA.com. Must include a valid domain extension (e.g., .com, .net, .org).',
      type: 'domain',
      required: true,
      group: 'Business Information'
    },
    {
      id: 4,
      field: 'countryOfIncorporation',
      question: 'In which country is the business incorporated?',
      guidance: 'For example, "United States".',
      type: 'text',
      required: true,
      group: 'Business Information'
    },
    {
      id: 5,
      field: 'fullStreetAddress',
      question: 'What is your company\'s full street address?',
      guidance: 'Provide Street, City, State/Province, ZIP/Postal Code, and Country (e.g. 123 Elm St, Springfield, IL 62704, USA).',
      type: 'textarea',
      required: true,
      group: 'Business Information'
    },
    {
      id: 6,
      field: 'mainContactEmail',
      question: 'What is your main contact e-mail address?',
      guidance: 'For example, info@saunahavenusa.com. Must be a valid email format.',
      type: 'email',
      required: true,
      group: 'Business Information'
    },
    {
      id: 7,
      field: 'phoneNumber',
      question: 'What phone number should appear in all policies?',
      guidance: 'Include country code, for example +1 555-123-4567.',
      type: 'text',
      required: true,
      group: 'Business Information'
    },
    {
      id: 8,
      field: 'customerServiceHours',
      question: 'What are your customer-service days and hours?',
      guidance: 'For example, "Mon–Fri 9 AM–5 PM EST".',
      type: 'text',
      required: true,
      defaultValue: 'Mon–Fri 9 AM–5 PM EST',
      group: 'Business Information'
    },
    {
      id: 9,
      field: 'isoCurrencyCode',
      question: 'Which ISO currency code will you use?',
      guidance: 'Type the three-letter code, for example USD.',
      type: 'text',
      required: true,
      defaultValue: 'USD',
      group: 'Business Information'
    },

    // Shipping Information Group
    {
      id: 10,
      field: 'domesticFreeShippingThreshold',
      question: 'What is your domestic free-shipping threshold?',
      guidance: 'Enter the amount in dollars (e.g. 50 means free shipping on orders over $50). Leave blank or enter 0 for no free shipping threshold.',
      type: 'text',
      required: false,
      defaultValue: '',
      group: 'Shipping Information'
    },
    {
      id: 11,
      field: 'domesticFlatRateShippingFee',
      question: 'What is your domestic flat-rate shipping fee?',
      guidance: 'Enter the fee amount in dollars. Leave blank or enter 0 for no flat rate fee.',
      type: 'text',
      required: false,
      defaultValue: '',
      group: 'Shipping Information'
    },
    {
      id: 12,
      field: 'internationalFlatRateShippingFee',
      question: 'What is your international flat-rate shipping fee?',
      guidance: 'Enter the fee amount in dollars, or leave blank to use "Custom (calculated at checkout)".',
      type: 'text',
      required: true,
      defaultValue: 'Custom (calculated at checkout)',
      group: 'Shipping Information'
    },
    {
      id: 13,
      field: 'orderProcessingTime',
      question: 'How many business days do you need to process an order?',
      guidance: 'Provide a range such as "1–2 days".',
      type: 'text',
      required: true,
      defaultValue: '1–2 days',
      group: 'Shipping Information'
    },
    {
      id: 14,
      field: 'dailyOrderCutoff',
      question: 'At what daily time and time-zone do orders stop processing?',
      guidance: 'For example "17:00 EST".',
      type: 'text',
      required: true,
      defaultValue: '17:00 EST',
      group: 'Shipping Information'
    },
    {
      id: 15,
      field: 'domesticDeliveryEstimateStandard',
      question: 'What is the delivery estimate for standard domestic shipping?',
      guidance: 'Provide a range such as "5–7 business days".',
      type: 'text',
      required: true,
      defaultValue: '5–7 business days',
      group: 'Shipping Information'
    },
    {
      id: 16,
      field: 'domesticDeliveryEstimateExpedited',
      question: 'What is the delivery estimate for expedited domestic shipping?',
      guidance: 'Provide a range such as "2–3 business days".',
      type: 'text',
      required: true,
      defaultValue: '2–3 business days',
      group: 'Shipping Information'
    },
    {
      id: 17,
      field: 'internationalDeliveryEstimate',
      question: 'What is the delivery estimate for international shipping?',
      guidance: 'Provide a range such as "7–14 business days".',
      type: 'text',
      required: true,
      defaultValue: '7–14 business days',
      group: 'Shipping Information'
    },

    // Returns and Policies Group
    {
      id: 18,
      field: 'returnWindowDays',
      question: 'How many days does a customer have to request a return?',
      guidance: 'Type a number of days.',
      type: 'text',
      required: true,
      defaultValue: '30',
      group: 'Returns and Policies'
    },
    {
      id: 19,
      field: 'shipToCountries',
      question: 'Which countries or regions do you ship to?',
      guidance: 'Enter a comma-separated list.',
      type: 'textarea',
      required: true,
      defaultValue: 'United States (excluding Puerto Rico)',
      group: 'Returns and Policies'
    },
    {
      id: 20,
      field: 'domesticCarriers',
      question: 'Which carriers handle your domestic shipments?',
      guidance: 'List the carrier names.',
      type: 'textarea',
      required: true,
      defaultValue: 'varies by product – contact us to inquire',
      group: 'Returns and Policies'
    },
    {
      id: 21,
      field: 'internationalCarriers',
      question: 'Which carriers handle your international shipments?',
      guidance: 'List the carrier names.',
      type: 'textarea',
      required: true,
      defaultValue: 'varies by product – contact us to inquire',
      group: 'Returns and Policies'
    },
    {
      id: 22,
      field: 'acceptedPayments',
      question: 'Which payment methods do you accept?',
      guidance: 'List the methods.',
      type: 'textarea',
      required: true,
      defaultValue: 'Visa, Mastercard, AmEx, PayPal, etc.',
      group: 'Returns and Policies'
    },
    {
      id: 23,
      field: 'sellingRegions',
      question: 'In which countries or regions are your products legally offered for sale?',
      guidance: 'Enter a list, or leave blank to reuse your shipping countries.',
      type: 'textarea',
      required: false,
      group: 'Returns and Policies'
    },
    {
      id: 24,
      field: 'exemptProductCategories',
      question: 'Which product categories are non-returnable?',
      guidance: 'List the categories (e.g. custom, perishable), or leave blank for "None".',
      type: 'textarea',
      required: true,
      defaultValue: 'None',
      group: 'Returns and Policies'
    },

    // Additional Information Group
    {
      id: 25,
      field: 'cookieList',
      question: 'Do you have a cookie list you would like to supply?',
      guidance: 'Paste your cookie table (name, purpose, type, expiration), or leave blank to use a standard essential + analytics set.',
      type: 'textarea',
      required: true,
      defaultValue: 'standard essential + analytics',
      group: 'Additional Information'
    },
    {
      id: 26,
      field: 'affiliateProgramName',
      question: 'Do you participate in an affiliate programme?',
      guidance: 'Provide the programme name and website(s), or leave blank for "N/A".',
      type: 'textarea',
      required: true,
      defaultValue: 'N/A',
      group: 'Additional Information'
    },
    {
      id: 27,
      field: 'governingLawState',
      question: 'Which state\'s law governs your contract if the company is US-based?',
      guidance: 'Enter the full state name or the two-letter code (e.g. Delaware or DE).',
      type: 'text',
      required: true,
      group: 'Additional Information'
    },
    {
      id: 28,
      field: 'trackOrderURL',
      question: 'How can customers track their orders?',
      guidance: 'Paste a tracking URL, or leave blank for "tracking link will be sent via email".',
      type: 'text',
      required: true,
      defaultValue: 'tracking link will be sent via email',
      group: 'Additional Information'
    },
    {
      id: 29,
      field: 'faqPageURL',
      question: 'What is the full URL of your FAQ page?',
      guidance: 'This will be auto-filled with your domain. You can modify it if needed.',
      type: 'url',
      required: true,
      defaultValue: 'AUTO_FILL',
      group: 'Additional Information'
    },
    {
      id: 30,
      field: 'returnPolicyURL',
      question: 'What is the full URL of your Return and Refund Policy?',
      guidance: 'This will be auto-filled with your domain + /return-and-refund-policy. You can modify it if needed.',
      type: 'url',
      required: true,
      defaultValue: 'AUTO_FILL',
      group: 'Additional Information'
    },
    {
      id: 31,
      field: 'termsOfServicePageURL',
      question: 'What is the full URL of your Terms of Service page?',
      guidance: 'This will be auto-filled with your domain. You can modify it if needed.',
      type: 'url',
      required: true,
      defaultValue: 'AUTO_FILL',
      group: 'Additional Information'
    },
    {
      id: 32,
      field: 'contactPageURL',
      question: 'What is the full URL of your Contact-us page?',
      guidance: 'This will be auto-filled with your domain. You can modify it if needed.',
      type: 'url',
      required: true,
      defaultValue: 'AUTO_FILL',
      group: 'Additional Information'
    }
  ];

  const policyTypes = [
    { 
      id: 'privacy', 
      name: 'Privacy Policy', 
      description: 'How you collect, use, and protect customer data',
      icon: '🔒'
    },
    { 
      id: 'terms', 
      name: 'Terms of Service', 
      description: 'Rules and guidelines for using your service',
      icon: '📋'
    },
    { 
      id: 'return', 
      name: 'Return & Refund Policy', 
      description: 'Return process and refund conditions',
      icon: '↩️'
    },
    { 
      id: 'cookie', 
      name: 'Cookie Policy', 
      description: 'Information about cookies used on your website',
      icon: '🍪'
    }
  ];

  useEffect(() => {
    // Initial greeting message
    const initialMessage: Message = {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your Legal Policy assistant. I'll help you create professional legal documents for your business with AI-powered guidance. Ready to get started?",
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    
    // Reset state to ensure clean start
    setCurrentQuestionIndex(0);
    setChatPhase('intro');
    setPolicyData({} as PolicyData);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (content: string, type: 'bot' | 'user', options?: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      ...options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDomain = (domain: string): boolean => {
    // Clean the domain: remove protocol, www., and trailing slashes
    let cleanDomain = domain.trim().replace(/^https?:\/\//i, '').replace(/^www\./, '').replace(/\/.*$/, '');
    
    // Basic domain validation - must have at least one dot and valid characters
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]{0,253}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(cleanDomain) && cleanDomain.length > 0;
  };

  const validateUrl = (url: string): boolean => {
    try {
      // Normalize the URL by adding https:// if no protocol is present
      let normalizedUrl = url.trim();
      if (!normalizedUrl.match(/^https?:\/\//i)) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      
      const urlObj = new URL(normalizedUrl);
      // Check if it's a valid HTTP/HTTPS URL with a proper domain
      return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && 
             urlObj.hostname.includes('.') &&
             urlObj.hostname.length > 0;
    } catch {
      return false;
    }
  };

  const handleSendMessage = () => {
    // For intro phase, require some input
    if (chatPhase === 'intro' && !currentInput.trim()) return;

    // For questions phase, validate based on question type and requirements
    if (chatPhase === 'questions') {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        const inputValue = currentInput.trim();
        
        // If field is required and empty, don't allow submission
        if (currentQuestion.required && !inputValue) {
          return;
        }
        
        // Validate specific field types if they have content
        if (inputValue) {
          if (currentQuestion.type === 'email' && !validateEmail(inputValue)) {
            setTimeout(() => {
              addMessage("Please enter a valid email address (e.g., user@domain.com)", 'bot');
            }, 500);
            setCurrentInput('');
            return;
          }
          
          if (currentQuestion.type === 'domain' && !validateDomain(inputValue)) {
            setTimeout(() => {
              addMessage("Please enter a valid domain with extension (e.g., example.com, www.mydomain.net)", 'bot');
            }, 500);
            setCurrentInput('');
            return;
          }
          
          if (currentQuestion.type === 'url' && !validateUrl(inputValue)) {
            setTimeout(() => {
              addMessage("Please enter a valid URL (e.g., example.com, www.example.com, https://example.com)", 'bot');
            }, 500);
            setCurrentInput('');
            return;
          }
        }
      }
    }

    // For other phases, require input
    if ((chatPhase === 'review' || chatPhase === 'selection') && !currentInput.trim()) return;

    // Add user message
    addMessage(currentInput, 'user');

    if (chatPhase === 'intro') {
      // Start the questions phase
      setChatPhase('questions');
      setCurrentQuestionIndex(0);
      setTimeout(() => {
        askNextQuestion();
      }, 1000);
    } else if (chatPhase === 'questions') {
      // Process answer and ask next question
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        const value = currentInput.trim() || currentQuestion.defaultValue || '';
        const updatedData = {
          ...policyData,
          [currentQuestion.field]: value
        };

        // Auto-fill URLs when domain is provided
        if (currentQuestion.field === 'primaryWebsiteDomain' && value) {
          const domain = value.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
          updatedData.faqPageURL = `https://${domain}/faq`;
          updatedData.returnPolicyURL = `https://${domain}/return-and-refund-policy`;
          updatedData.termsOfServicePageURL = `https://${domain}/terms-of-service`;
          updatedData.contactPageURL = `https://${domain}/contact`;
        }

        // Check if we're in editing mode
        if (editingQuestionId !== null) {
          // Prevent duplicate processing
          if (isProcessingEdit) {
            return;
          }
          setIsProcessingEdit(true);
          
          // We're editing a specific question, go back to review
          const editedQuestion = questions.find(q => q.id === editingQuestionId);
          
          // Clear editing state immediately to prevent duplicate calls
          setEditingQuestionId(null);
          
          // Clear the input field immediately
          setCurrentInput('');
          
          // Create the updated data object
          const newData = { ...policyData, ...updatedData };
          
          // Update policy data
          setPolicyData(newData);
          
          // Show the updated review after a short delay
          setTimeout(() => {
            // Remove the last review message if it exists
            setMessages(prevMessages => {
              const filteredMessages = prevMessages.filter(msg => !msg.isReview);
              return filteredMessages;
            });
            
            // Create review content with the guaranteed updated data
            let reviewContent = `✅ Updated "${editedQuestion?.question}" with your new answer.\n\nGreat! Let me review the updated information:\n\n`;
            
            questions.forEach(question => {
              const value = newData[question.field];
              if (value) {
                reviewContent += `**${question.question}**\n${value}\n\n`;
              }
            });

            reviewContent += "Does this information look correct? Type 'yes' to proceed to policy selection, or click on any answer above to edit it.";
            
            // Add the new review message after removing the old one
            setTimeout(() => {
              addMessage(reviewContent, 'bot', {
                isReview: true,
                isEditedReview: true
              });
            }, 100);
            
            // Set chat phase to review and reset processing flag
            setChatPhase('review');
            setIsProcessingEdit(false);
          }, 300);
          
          return; // Exit early to prevent normal flow
        } else {
          // Normal flow - update data first
          setPolicyData(updatedData);
          
          if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            
            setTimeout(() => {
              // Use the nextIndex directly instead of relying on state
              const nextQuestion = questions[nextIndex];
              if (nextQuestion) {
                let content = `**${nextQuestion.group}**\n\n${nextQuestion.question}`;
                if (nextQuestion.guidance) {
                  content += `\n\n*${nextQuestion.guidance}*`;
                }
                
                if (nextQuestion.defaultValue && nextQuestion.defaultValue !== 'AUTO_FILL') {
                  content += `\n\n*Default: ${nextQuestion.defaultValue}*`;
                }
                
                if (nextQuestion.type === 'select' && nextQuestion.options) {
                  content += '\n\nOptions:\n' + nextQuestion.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n');
                }

                addMessage(content, 'bot', {
                  isQuestion: true,
                  questionField: nextQuestion.field,
                  options: nextQuestion.options,
                  inputType: nextQuestion.type,
                  defaultValue: nextQuestion.defaultValue
                });

                // Auto-fill default values in the input field for the next question
                setTimeout(() => {
                  if (nextQuestion.defaultValue && nextQuestion.defaultValue !== 'AUTO_FILL') {
                    setCurrentInput(nextQuestion.defaultValue || '');
                  } else if (nextQuestion.defaultValue === 'AUTO_FILL' && nextQuestion.type === 'url') {
                    // Auto-fill URLs based on domain
                    const domain = updatedData.primaryWebsiteDomain;
                    if (domain) {
                      let autoFilledUrl = '';
                      const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
                      
                      switch (nextQuestion.field) {
                        case 'faqPageURL':
                          autoFilledUrl = `https://${cleanDomain}/faq`;
                          break;
                        case 'returnPolicyURL':
                          autoFilledUrl = `https://${cleanDomain}/return-and-refund-policy`;
                          break;
                        case 'termsOfServicePageURL':
                          autoFilledUrl = `https://${cleanDomain}/terms-of-service`;
                          break;
                        case 'contactPageURL':
                          autoFilledUrl = `https://${cleanDomain}/contact`;
                          break;
                      }
                      
                      if (autoFilledUrl) {
                        setCurrentInput(autoFilledUrl);
                      }
                    }
                  } else {
                    // Clear input for new questions without defaults
                    setCurrentInput('');
                  }
                }, 100);
              }
            }, 800);
          } else {
            // All questions answered, move to review
            setChatPhase('review');
            setTimeout(() => {
              showReview();
            }, 1000);
          }
        }
      }
    } else if (chatPhase === 'review') {
      // Move to policy selection
      setChatPhase('selection');
      setTimeout(() => {
        showPolicySelection();
      }, 1000);
    } else if (chatPhase === 'selection') {
      // Process policy selection
      const selectedIds = currentInput.toLowerCase().split(',').map(s => s.trim());
      const validPolicies = policyTypes.filter(p => 
        selectedIds.some(id => p.name.toLowerCase().includes(id) || p.id === id)
      );
      
      if (validPolicies.length > 0) {
        setSelectedPolicies(validPolicies.map(p => p.id));
        setChatPhase('complete');
        setTimeout(() => {
          generateAndShowPolicies(validPolicies.map(p => p.id));
        }, 1000);
      } else {
        setTimeout(() => {
          addMessage("I didn't understand which policies you'd like. Please try again by typing the policy names (e.g., 'privacy, terms, return')", 'bot');
        }, 1000);
      }
    }

    setCurrentInput('');
  };

  const askNextQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (question) {
      let content = `**${question.group}**\n\n${question.question}`;
      if (question.guidance) {
        content += `\n\n*${question.guidance}*`;
      }
      
      if (question.defaultValue && question.defaultValue !== 'AUTO_FILL') {
        content += `\n\n*Default: ${question.defaultValue}*`;
      }
      
      if (question.type === 'select' && question.options) {
        content += '\n\nOptions:\n' + question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n');
      }

      addMessage(content, 'bot', {
        isQuestion: true,
        questionField: question.field,
        options: question.options,
        inputType: question.type,
        defaultValue: question.defaultValue
      });

      // Auto-fill default values in the input field
      if (question.defaultValue && question.defaultValue !== 'AUTO_FILL') {
        setTimeout(() => {
          setCurrentInput(question.defaultValue || '');
        }, 100);
      } else if (question.defaultValue === 'AUTO_FILL' && question.type === 'url') {
        // Auto-fill URLs based on domain
        const domain = policyData.primaryWebsiteDomain;
        if (domain) {
          let autoFilledUrl = '';
          const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
          
          switch (question.field) {
            case 'faqPageURL':
              autoFilledUrl = `https://${cleanDomain}/faq`;
              break;
            case 'returnPolicyURL':
              autoFilledUrl = `https://${cleanDomain}/return-and-refund-policy`;
              break;
            case 'termsOfServicePageURL':
              autoFilledUrl = `https://${cleanDomain}/terms-of-service`;
              break;
            case 'contactPageURL':
              autoFilledUrl = `https://${cleanDomain}/contact`;
              break;
          }
          
          if (autoFilledUrl) {
            setTimeout(() => {
              setCurrentInput(autoFilledUrl);
            }, 100);
          }
        }
      } else {
        // Clear input for new questions without defaults
        setCurrentInput('');
      }
    }
  };

  const showReview = () => {
    let reviewContent = "Great! Let me review the information you've provided:\n\n";
    
    questions.forEach(question => {
      const value = policyData[question.field];
      if (value) {
        reviewContent += `**${question.question}**\n${value}\n\n`;
      }
    });

    reviewContent += "Does this information look correct? Type 'yes' to proceed to policy selection, or click on any answer above to edit it.";
    
    // Force a re-render by creating a new message each time
    addMessage(reviewContent, 'bot', {
      isReview: true
    });
  };

  const handleEditQuestion = (questionId: number) => {
    // Prevent multiple rapid clicks or if already editing
    if (editingQuestionId !== null) {
      return;
    }
    
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setEditingQuestionId(questionId);
      setChatPhase('questions');
      setCurrentQuestionIndex(questionId - 1); // Questions are 1-indexed, array is 0-indexed
      
      // Ask the specific question for editing
      setTimeout(() => {
        let content = `**Editing: ${question.group}**\n\n${question.question}`;
        if (question.guidance) {
          content += `\n\n*${question.guidance}*`;
        }
        
        const currentValue = policyData[question.field];
        if (currentValue) {
          content += `\n\n*Current answer: ${currentValue}*`;
        }
        
        if (question.defaultValue && question.defaultValue !== 'AUTO_FILL') {
          content += `\n\n*Default: ${question.defaultValue}*`;
        }
        
        if (question.type === 'select' && question.options) {
          content += '\n\nOptions:\n' + question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n');
        }

        addMessage(content, 'bot', {
          isQuestion: true,
          questionField: question.field,
          options: question.options,
          inputType: question.type,
          defaultValue: question.defaultValue,
          isEditing: true
        });

        // Pre-fill with current value or default
        const valueToFill = currentValue || question.defaultValue || '';
        if (valueToFill && valueToFill !== 'AUTO_FILL') {
          setTimeout(() => {
            setCurrentInput(valueToFill);
          }, 100);
        } else if (question.defaultValue === 'AUTO_FILL' && question.type === 'url') {
          // Auto-fill URLs based on domain
          const domain = policyData.primaryWebsiteDomain;
          if (domain) {
            let autoFilledUrl = '';
            const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
            
            switch (question.field) {
              case 'faqPageURL':
                autoFilledUrl = `https://${cleanDomain}/faq`;
                break;
              case 'returnPolicyURL':
                autoFilledUrl = `https://${cleanDomain}/return-and-refund-policy`;
                break;
              case 'termsOfServicePageURL':
                autoFilledUrl = `https://${cleanDomain}/terms-of-service`;
                break;
              case 'contactPageURL':
                autoFilledUrl = `https://${cleanDomain}/contact`;
                break;
            }
            
            if (autoFilledUrl) {
              setTimeout(() => {
                setCurrentInput(autoFilledUrl);
              }, 100);
            }
          }
        }
      }, 500);
    }
  };

  const showPolicySelection = () => {
    let selectionContent = "Perfect! Now, which legal policies would you like me to generate for your business?\n\n";
    
    policyTypes.forEach(policy => {
      selectionContent += `${policy.icon} **${policy.name}**\n${policy.description}\n\n`;
    });

    selectionContent += "Please type the names of the policies you'd like (e.g., 'privacy, terms, return, cookie' or just 'all' for everything):";
    
    addMessage(selectionContent, 'bot');
  };

  const generateAndShowPolicies = async (policyIds: string[]) => {
    addMessage("Excellent! I'm now generating your professional legal documents. This will take just a moment...", 'bot');

    // Simulate generation time
    setTimeout(() => {
      const policies: {[key: string]: string} = {};
      
      policyIds.forEach(policyId => {
        policies[policyId] = generatePolicyContent(policyId, policyData);
      });
      
      setGeneratedPolicies(policies);

      let completionContent = `🎉 **Policies Generated Successfully!**\n\nI've created ${policyIds.length} professional legal document${policyIds.length > 1 ? 's' : ''} for your business:\n\n`;
      
      policyIds.forEach(policyId => {
        const policyInfo = policyTypes.find(p => p.id === policyId);
        if (policyInfo) {
          completionContent += `${policyInfo.icon} ${policyInfo.name}\n`;
        }
      });

      completionContent += "\nYour documents are ready for download and use on your website. Each policy is professionally formatted and tailored to your business information.";

      addMessage(completionContent, 'bot');

      // Add download buttons
      setTimeout(() => {
        addMessage("Click the download buttons below to get your policies:", 'bot');
      }, 1500);
    }, 3000);
  };

  const generatePolicyContent = (policyType: string, data: PolicyData): string => {
    // Simplified policy generation for chat interface
    const currentDate = new Date().toLocaleDateString();
    
    const baseStyles = `
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 40px 20px;
          color: #333;
          background: #fff;
        }
        h1 { 
          color: #2c3e50; 
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        h2 { 
          color: #34495e; 
          margin-top: 30px;
          margin-bottom: 15px;
        }
      </style>
    `;
    
    switch (policyType) {
      case 'privacy':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Privacy Policy - ${data.storeWebsiteName || data.legalBusinessName}</title>
    ${baseStyles}
</head>
<body>
    <h1>Privacy Policy</h1>
    <p><strong>Effective Date:</strong> ${currentDate}</p>
    <p><strong>Last Updated:</strong> ${currentDate}</p>
    
    <h2>1. Business Information</h2>
    <p>This Privacy Policy applies to ${data.storeWebsiteName || data.legalBusinessName} (legal entity: ${data.legalBusinessName}) operating at ${data.primaryWebsiteDomain}.</p>
    
    <h2>2. Information Collection</h2>
    <p>We collect personal information necessary to provide our services and process transactions.</p>
    
    <h2>3. Cookies and Tracking</h2>
    <p>Cookie Information: ${data.cookieList}</p>
    
    <h2>4. Third-Party Services</h2>
    ${data.affiliateProgramName !== 'N/A' ? `<p>Affiliate Programs: ${data.affiliateProgramName}</p>` : ''}
    
    <h2>5. Contact Information</h2>
    <p>If you have questions about this Privacy Policy, contact us:</p>
    <p><strong>${data.legalBusinessName}</strong><br>
    Email: ${data.mainContactEmail}<br>
    Phone: ${data.phoneNumber}<br>
    Address: ${data.fullStreetAddress}<br>
    Customer Service Hours: ${data.customerServiceHours}</p>
    
    <h2>6. Governing Law</h2>
    <p>This policy is governed by the laws of ${data.governingLawState}, ${data.countryOfIncorporation}.</p>
</body>
</html>`;

      case 'terms':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Terms of Service - ${data.storeWebsiteName || data.legalBusinessName}</title>
    ${baseStyles}
</head>
<body>
    <h1>Terms of Service</h1>
    <p><strong>Effective Date:</strong> ${currentDate}</p>
    
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing ${data.primaryWebsiteDomain}, you agree to these terms and conditions.</p>
    
    <h2>2. Business Information</h2>
    <p>${data.storeWebsiteName || data.legalBusinessName} (legal entity: ${data.legalBusinessName}) is incorporated in ${data.countryOfIncorporation}.</p>
    
    <h2>3. Payment Terms</h2>
    <p>Accepted payment methods: ${data.acceptedPayments}</p>
    <p>Currency: ${data.isoCurrencyCode}</p>
    
    <h2>4. Shipping and Delivery</h2>
    <p>We ship to: ${data.shipToCountries}</p>
    <p>Processing time: ${data.orderProcessingTime}</p>
    <p>Order cutoff: ${data.dailyOrderCutoff}</p>
    <p>Domestic standard delivery: ${data.domesticDeliveryEstimateStandard}</p>
    <p>Domestic expedited delivery: ${data.domesticDeliveryEstimateExpedited}</p>
    <p>International delivery: ${data.internationalDeliveryEstimate}</p>
    
    <h2>5. Returns and Refunds</h2>
    <p>Return window: ${data.returnWindowDays} days</p>
    <p>Non-returnable categories: ${data.exemptProductCategories}</p>
    
    <h2>6. Order Tracking</h2>
    <p>Track your order: ${data.trackOrderURL}</p>
    
    <h2>7. Governing Law</h2>
    <p>These terms are governed by the laws of ${data.governingLawState}, ${data.countryOfIncorporation}.</p>
    
    <h2>8. Contact Information</h2>
    <p><strong>${data.legalBusinessName}</strong><br>
    Email: ${data.mainContactEmail}<br>
    Phone: ${data.phoneNumber}<br>
    Address: ${data.fullStreetAddress}<br>
    Customer Service Hours: ${data.customerServiceHours}</p>
</body>
</html>`;

      default:
        return `<html><body><h1>${policyType} Policy - ${data.storeWebsiteName || data.legalBusinessName}</h1><p>Generated on ${currentDate}</p></body></html>`;
    }
  };

  const downloadPolicy = (policyType: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${policyData.storeWebsiteName || policyData.legalBusinessName}_${policyType}_policy.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };


  return (
    <div className="chat-container">
      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="chat-info">
            <div className="chat-icon">
              <FileText size={24} />
            </div>
            <div className="chat-details">
              <h1>Store Policy Generator</h1>
              <p>Session: New Policy Creation Chat</p>
            </div>
          </div>
          <button className="new-chat-btn" onClick={() => window.location.reload()}>
            New Chat
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
               <div className="message-content">
                 <div className="message-text">
                   {message.isReview ? (
                     // Special rendering for review messages with clickable answers
                     <div>
                       {message.content.split('\n').map((line, idx) => {
                         if (line.startsWith('**') && line.endsWith('**')) {
                           // This is a question line - NOT clickable, just bold
                           const questionText = line.slice(2, -2);
                           return (
                             <div key={idx} className="review-question-text">
                               <strong>{questionText}</strong>
                             </div>
                           );
                         }
                         if (line.startsWith('*') && line.endsWith('*')) {
                           return <em key={idx}>{line.slice(1, -1)}</em>;
                         }
                         // Check if this line is an answer (comes after a question)
                         const prevLine = message.content.split('\n')[idx - 1];
                         if (prevLine && prevLine.startsWith('**') && prevLine.endsWith('**') && line.trim() && !line.startsWith('Does this information')) {
                           const questionText = prevLine.slice(2, -2);
                           const question = questions.find(q => q.question === questionText);
                           return (
                             <div key={idx} className="review-answer" onClick={() => question && handleEditQuestion(question.id)}>
                               {line}
                             </div>
                           );
                         }
                         return <div key={idx}>{line}</div>;
                       })}
                     </div>
                   ) : (
                     // Normal rendering for non-review messages
                     message.content.split('\n').map((line, idx) => {
                       if (line.startsWith('**') && line.endsWith('**')) {
                         return <strong key={idx}>{line.slice(2, -2)}</strong>;
                       }
                       if (line.startsWith('*') && line.endsWith('*')) {
                         return <em key={idx}>{line.slice(1, -1)}</em>;
                       }
                       return <div key={idx}>{line}</div>;
                     })
                   )}
                 </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Download buttons for generated policies */}
          {chatPhase === 'complete' && Object.keys(generatedPolicies).length > 0 && (
            <div className="download-section">
              {Object.entries(generatedPolicies).map(([policyType, content]) => {
                const policyInfo = policyTypes.find(p => p.id === policyType);
                return (
                  <button
                    key={policyType}
                    className="download-btn"
                    onClick={() => downloadPolicy(policyType, content)}
                  >
                    <Download size={16} />
                    {policyInfo?.name} HTML
                  </button>
                );
              })}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

         <div className="chat-input-area">
           <div className="input-container">
             <input
               type="text"
               value={currentInput}
               onChange={(e) => setCurrentInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
               placeholder={
                 chatPhase === 'intro' 
                   ? "Type anything to get started..." 
                   : chatPhase === 'selection'
                   ? "Type policy names (e.g., 'privacy, terms')..."
                   : chatPhase === 'questions' && questions[currentQuestionIndex] && !questions[currentQuestionIndex].required
                   ? "Type your answer or press Enter to skip..."
                   : "Type your answer..."
               }
               className="chat-input"
             />
             <button 
               onClick={handleSendMessage}
               className="send-button"
               disabled={!currentInput.trim()}
             >
               Send <Send size={16} />
             </button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default PolicyGeneratorChat;
