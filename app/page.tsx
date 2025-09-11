'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Globe, 
  Mail, 
  Palette, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const tools = [
    {
      id: 'store-policy-generator',
      title: 'Store Policy Generator',
      description: 'Generate comprehensive legal policies for your store',
      icon: FileText,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'domain-generator',
      title: 'Domain Generator',
      description: 'Find the perfect domain for your high-ticket dropshipping store',
      icon: Globe,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'ai-cold-email',
      title: 'AI Cold Email Generator',
      description: 'Generate personalized cold emails with AI',
      icon: Mail,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'ai-logo-generator',
      title: 'AI Logo Generator',
      description: 'Create professional logos with AI',
      icon: Palette,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600'
    },
    {
      id: 'ai-humanizer',
      title: 'AI Humanizer',
      description: 'Humanize AI-generated content',
      icon: Sparkles,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  const handleToolClick = (toolId: string) => {
    setIsLoading(toolId);
    
    if (toolId === 'store-policy-generator') {
      router.push('/policy-generator');
    } else if (toolId === 'domain-generator') {
      router.push('/domain-generator');
    } else if (toolId === 'ai-cold-email') {
      router.push('/ai-cold-email');
    } else if (toolId === 'ai-logo-generator') {
      router.push('/ai-logo-generator');
    } else if (toolId === 'ai-humanizer') {
      // TODO: Add AI Humanizer route
      console.log('AI Humanizer clicked');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            High-Ticket Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one toolkit for building successful high-ticket dropshipping stores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`
                  bg-white rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300
                  hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105
                  border border-gray-100
                  ${isLoading === tool.id ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center mb-6">
                  <div className={`
                    ${tool.color} ${tool.hoverColor} 
                    p-4 rounded-xl text-white transition-colors duration-200 shadow-lg
                  `}>
                    <IconComponent size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">
                    {tool.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
                {isLoading === tool.id && (
                  <div className="mt-4 flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Loading...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
