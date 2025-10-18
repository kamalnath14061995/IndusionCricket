import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface Field {
  label: string;
  value: any;
  onChange: (value: any) => void;
  description: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
}

interface SpecificationsSectionProps {
  title: string;
  fields: Field[];
  sectionDescription?: string;
}

const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({ title, fields, sectionDescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [chatBoxContent, setChatBoxContent] = useState('');
  const [chatBoxPosition, setChatBoxPosition] = useState({ x: 0, y: 0 });

  const showChatBox = (description: string, event: React.MouseEvent) => {
    setChatBoxContent(description);
    setChatBoxPosition({ x: event.clientX, y: event.clientY });
    setChatBoxVisible(true);
  };

  const hideChatBox = () => {
    setChatBoxVisible(false);
  };

  return (
    <div className="border rounded-lg mb-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {sectionDescription && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showChatBox(sectionDescription, e);
              }}
              onMouseLeave={hideChatBox}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Section description"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="relative">
              <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <button
                  type="button"
                  onMouseEnter={(e) => showChatBox(field.description, e)}
                  onMouseLeave={hideChatBox}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>

              {field.type === 'text' && (
                <input
                  type="text"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              )}

              {field.type === 'select' && (
                <select
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chat Box for Definitions */}
      {chatBoxVisible && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs"
          style={{
            left: chatBoxPosition.x,
            top: chatBoxPosition.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-sm text-gray-700">{chatBoxContent}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
};

export default SpecificationsSection;
