// useAutoSuggestions.ts - hook to provide auto-suggestions for ground and net specs

import { useState, useEffect } from 'react';
import {
  groundTitleSuggestions,
  groundDescriptionLineSuggestions,
  groundFeatureWordSuggestions,
  netTitleSuggestions,
  netDescriptionLineSuggestions,
  netFeatureWordSuggestions
} from '../utils/suggestionService';

export function useAutoSuggestions(type: 'ground' | 'net') {
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [descriptionLineSuggestions, setDescriptionLineSuggestions] = useState<string[]>([]);
  const [featureWordSuggestions, setFeatureWordSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (type === 'ground') {
      setTitleSuggestions(groundTitleSuggestions);
      setDescriptionLineSuggestions(groundDescriptionLineSuggestions);
      setFeatureWordSuggestions(groundFeatureWordSuggestions);
    } else if (type === 'net') {
      setTitleSuggestions(netTitleSuggestions);
      setDescriptionLineSuggestions(netDescriptionLineSuggestions);
      setFeatureWordSuggestions(netFeatureWordSuggestions);
    }
  }, [type]);

  return {
    titleSuggestions,
    descriptionLineSuggestions,
    featureWordSuggestions
  };
}
