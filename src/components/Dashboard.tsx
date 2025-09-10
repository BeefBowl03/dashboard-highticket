import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HandHeart, 
  Lightbulb, 
  Rocket, 
  Palette, 
  Image,
  FileText,
  Globe
} from 'lucide-react';
import './Dashboard.css';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'Active' | 'Ready to Use';
  lastUsed: string;
  conversations: number;
  buttonText: string;
  buttonType: 'primary' | 'secondary';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const tools: ToolCard[] = [
    {
      id: 'niche-selector',
      title: 'Niche Selector',
      description: 'Welcome! Would you like a quick walkthrough to set up your account...',
      icon: <HandHeart size={32} />,
      status: 'Ready to Use',
      lastUsed: 'Never used',
      conversations: 0,
      buttonText: 'Start Chat',
      buttonType: 'primary'
    },
    {
      id: 'product-ideation',
      title: 'Product Ideation',
      description: "Let's explore smart product ideas and build a strategy to successfully l...",
      icon: <Lightbulb size={32} />,
      status: 'Ready to Use',
      lastUsed: 'Never used',
      conversations: 0,
      buttonText: 'Start Chat',
      buttonType: 'primary'
    },
    {
      id: 'brand-domain-search',
      title: 'Brand and Domain Search',
      description: 'Need help picking a strong brand name and domain that sets your onl...',
      icon: <Rocket size={32} />,
      status: 'Ready to Use',
      lastUsed: 'Never used',
      conversations: 0,
      buttonText: 'Start Chat',
      buttonType: 'primary'
    },
    {
      id: 'logo-generator',
      title: 'Logo Generator',
      description: 'Want a custom logo that reflects your brand identity? Let\'s design so...',
      icon: <Palette size={32} />,
      status: 'Ready to Use',
      lastUsed: 'Never used',
      conversations: 0,
      buttonText: 'Start Chat',
      buttonType: 'primary'
    },
    {
      id: 'website-image-creator',
      title: 'Website Image Creator',
      description: 'Need stunning website images for your store design? I\'ll help create vis...',
      icon: <Image size={32} />,
      status: 'Ready to Use',
      lastUsed: 'Never used',
      conversations: 0,
      buttonText: 'Start Chat',
      buttonType: 'primary'
    },
    {
      id: 'store-policy-generator',
      title: 'Store Policy Generator',
      description: 'Generate legal policies for your store including Privacy Policy, Terms of Service, and more.',
      icon: <FileText size={32} />,
      status: 'Ready to Use',
      lastUsed: 'Never used',
      conversations: 0,
      buttonText: 'Generate Policies',
      buttonType: 'primary'
    },
    {
      id: 'brand-domain-search',
      title: 'Brand and Domain Search',
      description: 'Generate premium domain names and analyze competitor branding using AI.',
      icon: <Globe size={32} />,
      status: 'Ready to Use',
      lastUsed: 'Never used',
      conversations: 0,
      buttonText: 'Start Generating',
      buttonType: 'primary'
    }
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === 'store-policy-generator') {
      navigate('/policy-generator');
    } else if (toolId === 'brand-domain-search') {
      navigate('/domain-generator');
    }
    // Add handlers for other tools here
  };

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <div className="main-logo">
            <img 
              src="https://cdn.prod.website-files.com/67692e83aa3faae2c7985fcc/679934bc5b34b807e6cac177_highticket-logo-full-white.svg" 
              alt="HighTicket.io" 
              className="logo-svg"
            />
          </div>
        </div>

        <div className="tools-section">
          <div className="tools-grid">
            {tools.map((tool) => (
              <div key={tool.id} className="tool-card">
                <div className="tool-header">
                  <div className="tool-icon">
                    {tool.icon}
                  </div>
                  <div className={`tool-status ${tool.status === 'Active' ? 'active' : 'ready'}`}>
                    {tool.status}
                  </div>
                </div>
                
                <div className="tool-content">
                  <div className="tool-meta">
                    <span className="tool-last-used">• {tool.lastUsed}</span>
                    <span className="tool-conversations">{tool.conversations} conversations</span>
                  </div>
                  
                  <h3 className="tool-title">{tool.title}</h3>
                  <p className="tool-description">{tool.description}</p>
                </div>
                
                <button 
                  className={`tool-button ${tool.buttonType}`}
                  onClick={() => handleToolClick(tool.id)}
                >
                  {tool.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
