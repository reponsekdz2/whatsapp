import React from 'react';

interface ReplySuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

export const ReplySuggestions: React.FC<ReplySuggestionsProps> = ({ suggestions, onSelectSuggestion }) => {
  return (
    <div className="px-4 pt-2 flex flex-wrap gap-2 justify-end">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectSuggestion(suggestion)}
          className="px-3 py-1 bg-[#2A3942] text-[#E9EDEF] text-sm rounded-full hover:bg-[#34434e] transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
