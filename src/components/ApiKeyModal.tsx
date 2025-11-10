import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySet: (key: string) => void;
  currentKey: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySet,
  currentKey
}) => {
  const [apiKey, setApiKey] = useState(currentKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySet(apiKey.trim());
      onClose();
    }
  };

  const handleRemoveKey = () => {
    onKeySet('');
    setApiKey('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">🔑 Enter Gemini API Key</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get your key from{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Key
            </button>
            
            {currentKey && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Remove Key
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Security Note:</strong> Your API key is stored only in your browser and is never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
};
