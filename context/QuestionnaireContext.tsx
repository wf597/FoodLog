import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserOnboardingData {
  goal: string | null;
  gender: string | null;
  birthDateYear: string | null;
  birthDateMonth: string | null;
  birthDateDay: string | null;
  height: string | null;
  currentWeight: string | null;
  goalWeight: string | null;
  activityLevel: string | null;
}

interface QuestionnaireContextType {
  answers: UserOnboardingData;
  updateAnswer: (key: keyof UserOnboardingData, value: string) => void;
}

const initialState: UserOnboardingData = {
  goal: null,
  gender: null,
  birthDateYear: null,
  birthDateMonth: null,
  birthDateDay: null,
  height: null,
  currentWeight: null,
  goalWeight: null,
  activityLevel: null,
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

interface QuestionnaireProviderProps {
  children: ReactNode;
}

export function QuestionnaireProvider({ children }: QuestionnaireProviderProps) {
  const [answers, setAnswers] = useState<UserOnboardingData>(initialState);

  const updateAnswer = (key: keyof UserOnboardingData, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <QuestionnaireContext.Provider value={{ answers, updateAnswer }}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
}
