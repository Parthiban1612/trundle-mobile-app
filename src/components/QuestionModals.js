import React from 'react';
import { useGlobalBottomSheet } from '../context/GlobalBottomSheetContext';
import { FilterContent } from './GlobalBottomSheetContent';
import { DynamicQuestionSheet } from './DynamicQuestionSheet';

/**
 * QuestionModals Hook - A reusable hook for opening question modals
 * 
 * Usage Example:
 * ```javascript
 * import { useQuestionModals } from '../components/QuestionModals';
 * 
 * function MyComponent() {
 *   const { 
 *     openFlightTicketsModal, 
 *     openFilterModal,
 *     openDynamicQuestionSheet
 *   } = useQuestionModals();
 *   
 *   // For individual modals
 *   const handleFlightTickets = () => {
 *     openFlightTicketsModal({
 *       selectedValue: flightTickets,
 *       onSelect: setFlightTickets,
 *       onSkip: () => console.log('Skipped'),
 *       onConfirm: () => console.log('Confirmed')
 *     });
 *   };
 * 
 *   // For dynamic question sheet
 *   const handleQuestions = () => {
 *     openDynamicQuestionSheet({
 *       questions: questionsData.data,
 *       onComplete: (answers) => console.log('All answers:', answers),
 *       onSkip: () => console.log('Skipped all questions')
 *     });
 *   };
 * }
 * ```
 */

// Question Modal Functions
export const useQuestionModals = () => {
  const { openBottomSheet } = useGlobalBottomSheet(); 

  const openFilterModal = ({ onConfirm, onClear }) => {
    openBottomSheet({
      content: (
        <FilterContent
          onConfirm={onConfirm}
          onClear={onClear}
        />
      ),
      headerTitle: 'Filter',
      // snapPoints: ['70%', '85%']
    });
  };


  const openDynamicQuestionSheet = ({ questions, onComplete, onSkip, headerTitle = 'Help us personalised your recommendations' }) => {
    // Get the first question type to determine initial snap point
    const firstQuestionType = questions?.[0]?.question_type || null;

    openBottomSheet({
      content: (
        <DynamicQuestionSheet
          key={Date.now()} // Force remount on each open
          questions={questions}
          onComplete={onComplete}
          onSkip={onSkip}
        />
      ),
      headerTitle: headerTitle,
      questionType: firstQuestionType,
    });
  };

  return {
    openFilterModal, openDynamicQuestionSheet
  };
}; 