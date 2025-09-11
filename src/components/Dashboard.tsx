import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  FileText,
  Globe,
  Mail,
  Sparkles
} from 'lucide-react';
import './Dashboard.css';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonType: 'primary' | 'secondary';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const tools: ToolCard[] = [
    {
      id: 'dealer-application',
      title: 'AI Dealer Application Assistant',
      description: 'Automatically generate dealer application forms and outreach messages for supplier partnerships...',
      icon: <Briefcase size={32} />,
      buttonText: 'Start Application',
      buttonType: 'primary'
    },
    {
      id: 'ai-cold-email',
      title: 'AI Cold Email Generator',
      description: 'Generate professional cold emails for supplier partnerships and B2B outreach...',
      icon: <Mail size={32} />,
      buttonText: 'Generate Emails',
      buttonType: 'primary'
    },
    {
      id: 'ai-logo-generator',
      title: 'AI Logo Generator',
      description: 'Create professional logos powered by AI with transparent backgrounds and modern designs...',
      icon: <Sparkles size={32} />,
      buttonText: 'Generate Logo',
      buttonType: 'primary'
    },
    {
      id: 'store-policy-generator',
      title: 'Store Policy Generator',
      description: 'Generate legal policies for your store including Privacy Policy, Terms of Service, and more.',
      icon: <FileText size={32} />,
      buttonText: 'Generate Policies',
      buttonType: 'primary'
    },
    {
      id: 'domain-generator',
      title: 'Domain Generator',
      description: 'Generate premium domain names and analyze competitor branding using AI.',
      icon: <Globe size={32} />,
      buttonText: 'Start Generating',
      buttonType: 'primary'
    }
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === 'store-policy-generator') {
      navigate('/policy-generator');
    } else if (toolId === 'domain-generator') {
      navigate('/domain-generator');
    } else if (toolId === 'ai-cold-email') {
      navigate('/ai-cold-email');
    } else if (toolId === 'ai-logo-generator') {
      navigate('/ai-logo-generator');
    } else if (toolId === 'dealer-application') {
      navigate('/dealer-application');
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
                </div>
                
                <div className="tool-content">
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
