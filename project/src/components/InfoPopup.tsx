import React from 'react';
import { X } from 'lucide-react';

interface InfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;
