import React, { useEffect, useState, useRef } from "react";
import Toast from 'react-native-toast-message';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Formik } from "formik";
import Button from "../../components/Button";
import { getKeyboardAvoidingBehavior, getKeyboardVerticalOffset, getStatusBarHeight } from '../../utils/platformUtils';
import { fetchUserPreference, updatePreference } from '../../redux/updateSlices';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPreference } from '../../redux/updateSlices';
import PrimaryLayout from "../../components/PrimaryLayout";

// Skeleton Components
const SkeletonCard = ({ isPortrait }) => (
  <View
    style={[
      styles.card,
      {
        marginHorizontal: isPortrait ? 16 : 32,
        padding: isPortrait ? 24 : 28,
      },
    ]}
  >
    <View style={styles.skeletonTitle} />
    <View style={styles.skeletonContent} />
  </View>
);

const SkeletonTextInput = () => (
  <View style={styles.skeletonTextInput} />
);

const SkeletonToggleButtons = () => (
  <View style={styles.skeletonToggleContainer}>
    <View style={styles.skeletonToggleButton} />
    <View style={styles.skeletonToggleButton} />
  </View>
);

const SkeletonCheckboxList = () => (
  <View style={styles.skeletonCheckboxContainer}>
    {[1, 2, 3, 4].map((item) => (
      <View key={item} style={styles.skeletonCheckboxRow} />
    ))}
  </View>
);

const SkeletonDateInput = () => (
  <View style={styles.skeletonDateContainer}>
    <View style={styles.skeletonDateDropdown} />
  </View>
);

const SkeletonQuestionCard = ({ type, isPortrait }) => (
  <SkeletonCard isPortrait={isPortrait}>
    {type === 'TEXT' && <SkeletonTextInput />}
    {type === 'BOOL' && <SkeletonToggleButtons />}
    {type === 'MOD_MULTI' && <SkeletonCheckboxList />}
    {type === 'DATE' && <SkeletonDateInput />}
  </SkeletonCard>
);

const QuestionCard = ({ title, children, isPortrait }) => (
  <View
    style={[
      styles.card,
      {
        marginHorizontal: isPortrait ? 16 : 32,
        padding: isPortrait ? 24 : 28,
      },
    ]}
  >
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const ToggleButtons = ({ selectedValue, onSelect }) => (
  <View style={styles.toggleContainer}>
    {["Yes", "No"].map((value) => (
      <TouchableOpacity
        key={value}
        style={[
          styles.toggleButton,
          selectedValue === value && styles.toggleButtonSelected,
        ]}
        onPress={() => onSelect(value)}
      >
        <Text
          style={[
            styles.toggleButtonText,
            selectedValue === value && styles.toggleButtonTextSelected,
          ]}
        >
          {value}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const CheckboxRow = ({ label, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[styles.checkboxRow, isSelected && styles.checkboxRowSelected]}
    onPress={onSelect}
  >
    <Text
      style={[
        styles.checkboxLabel,
        isSelected && { color: "#000000", fontFamily: "instrument-sans-600" },
      ]}
    >
      {label}
    </Text>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <Icon name="check" size={16} color="#FFFFFF" />}
    </View>
  </TouchableOpacity>
);

const PersonalisedSettingsScreen = () => {

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [currentDateQuestionId, setCurrentDateQuestionId] = useState(null);

  // Format date for display (similar to DynamicQuestionSheet.js)
  const formatSelectedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Store questions and choices from API
  const [questions, setQuestions] = useState([]);

  const [choices, setChoices] = useState({});

  // Store user answers separately
  const [answers, setAnswers] = useState({});

  const formikRef = useRef(null);

  const { userPreference, userPreferenceLoading } = useSelector((state) => state.updates);

  const { token } = useSelector((state) => state.auth);

  // Render question based on type
  const renderQuestion = (questionItem, formikProps) => {
    const { id, question, user_answer } = questionItem;
    const questionChoices = choices[id] || [];
    const fieldName = `question_${id}`;
    const currentAnswer = formikProps.values[fieldName];

    // Generate a unique key for this question
    const uniqueKey = id || `question_${questionItem.id || Math.random()}`;

    let questionText = '';
    let questionType = 'TEXT';

    if (typeof question === 'object' && question !== null) {
      // Based on the API response structure, question text is in 'text' field
      questionText = question.text || question.question || question.title || question.name || '';
      questionType = question.question_type || question.type || 'TEXT';

      // If still empty, try to find any string field
      if (!questionText) {
        for (const [key, value] of Object.entries(question)) {
          if (typeof value === 'string' && value.length > 0) {
            questionText = value;
            break;
          }
        }
      }
    } else if (typeof question === 'string') {
      questionText = question;
      questionType = 'TEXT';
    } else {
      questionText = `Question ${id} (raw: ${JSON.stringify(question)})`;
      questionType = 'TEXT';
    }

    switch (questionType) {
      case 'DATE':
        return (
          <QuestionCard key={uniqueKey} title={questionText} isPortrait={isPortrait}>
            <TouchableOpacity
              style={styles.dateDropdownContainer}
              onPress={() => {
                setSelectedDate(currentAnswer || '');
                setCurrentDateQuestionId(id);
                setCalendarVisible(true);
              }}
            >
              <View style={styles.dateDropdownContent}>
                <Text style={styles.dateDropdownText}>
                  {currentAnswer ? formatSelectedDate(currentAnswer) : 'Select a date'}
                </Text>
                <Icon name="chevron-down" size={16} color="#938EA2" />
              </View>
            </TouchableOpacity>
          </QuestionCard>
        );

      case 'BOOL':
        return (
          <QuestionCard key={uniqueKey} title={questionText} isPortrait={isPortrait}>
            <ToggleButtons
              selectedValue={currentAnswer === true ? "Yes" : currentAnswer === false ? "No" : null}
              onSelect={(value) => {
                formikProps.setFieldValue(fieldName, value === "Yes");
              }}
            />
          </QuestionCard>
        );

      case 'TEXT':
        // Check if this is a name/postcode question by looking at the question text or structure
        const isNamePostcodeQuestion =
          (typeof question === 'object' && question.text &&
            (question.text.toLowerCase().includes('name') ||
              question.text.toLowerCase().includes('postcode') ||
              question.text.toLowerCase().includes('postal') ||
              question.text.toLowerCase().includes('address'))) ||
          (typeof question === 'string' &&
            (question.toLowerCase().includes('name') ||
              question.toLowerCase().includes('postcode') ||
              question.toLowerCase().includes('postal') ||
              question.toLowerCase().includes('address'))) ||
          (currentAnswer && typeof currentAnswer === 'string' && currentAnswer.includes(',')) ||
          // Check if question has specific identifiers
          (typeof question === 'object' &&
            (question.id === 'name_postcode' ||
              question.type === 'name_postcode' ||
              question.question_type === 'name_postcode'));
        if (isNamePostcodeQuestion) {

          // Show name/postcode fields for questions that are explicitly identified as name/postcode questions
          let name = '';
          let postcode = '';

          if (currentAnswer && typeof currentAnswer === 'string' && currentAnswer.includes(',')) {
            const parts = currentAnswer.split(',');
            name = parts[0] || '';
            postcode = parts[1] || '';
          }

          return (
            <QuestionCard key={uniqueKey} title={questionText} isPortrait={isPortrait}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={[styles.textInput]}
                  placeholder="Name"
                  placeholderTextColor="#A9A9A9"
                  value={name}
                  onChangeText={(text) => {
                    let postcodeValue = '';
                    if (currentAnswer && typeof currentAnswer === 'string' && currentAnswer.includes(',')) {
                      const parts = currentAnswer.split(',');
                      postcodeValue = parts[1] || '';
                    }
                    formikProps.setFieldValue(fieldName, `${text},${postcodeValue}`);
                  }}
                />
                <TextInput
                  style={[styles.textInput]}
                  placeholder="Postcode"
                  placeholderTextColor="#A9A9A9"
                  value={postcode}
                  onChangeText={(text) => {
                    let nameValue = '';
                    if (currentAnswer && typeof currentAnswer === 'string' && currentAnswer.includes(',')) {
                      const parts = currentAnswer.split(',');
                      nameValue = parts[0] || '';
                    }
                    formikProps.setFieldValue(fieldName, `${nameValue},${text}`);
                  }}
                />
              </View>
            </QuestionCard>
          );
        } else {
          // Single text input for regular TEXT questions
          return (
            <QuestionCard key={uniqueKey} title={questionText} isPortrait={isPortrait}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your answer"
                placeholderTextColor="#A9A9A9"
                value={currentAnswer || ""}
                onChangeText={(text) => {
                  formikProps.setFieldValue(fieldName, text);
                }}
                onBlur={formikProps.handleBlur(fieldName)}
                returnKeyType="next"
                blurOnSubmit={false}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </QuestionCard>
          );
        }

      case 'MOD_MULTI':
        if (questionChoices && Array.isArray(questionChoices)) {
          return (
            <QuestionCard key={uniqueKey} title={questionText} isPortrait={isPortrait}>
              <ScrollView style={styles.scrollableCheckboxContainer} nestedScrollEnabled>
                {questionChoices.map((choice, index) => {
                  const choiceText = choice.text || choice.choice || choice.label || choice.name || choice.title || `Choice ${index + 1}`;
                  const choiceId = choice.id;

                  // Handle user_answer format: array of objects with id and text
                  let isSelected = false;
                  if (Array.isArray(currentAnswer)) {
                    // Check if this choice ID exists in the user_answer array
                    isSelected = currentAnswer.some(answer => answer.id === choiceId);
                  }

                  return (
                    <CheckboxRow
                      key={choiceId || `choice_${index}`}
                      label={choiceText}
                      isSelected={isSelected}
                      onSelect={() => {
                        const currentArray = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                        const isAlreadySelected = currentArray.some(answer => answer.id === choiceId);

                        let newArray;
                        if (isAlreadySelected) {
                          newArray = currentArray.filter(answer => answer.id !== choiceId);
                        } else {
                          newArray = [...currentArray, { id: choiceId, text: choiceText }];
                        }

                        formikProps.setFieldValue(fieldName, newArray);
                      }}
                    />
                  );
                })}
              </ScrollView>
            </QuestionCard>
          );
        }

        // Fallback if no choices array
        return (
          <QuestionCard key={uniqueKey} title={questionText} isPortrait={isPortrait}>
            <Text style={styles.noDataText}>No choices available for this question</Text>
          </QuestionCard>
        );

      default:
        return (
          <QuestionCard key={uniqueKey} title={questionText} isPortrait={isPortrait}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your answer"
              placeholderTextColor="#A9A9A9"
              value={currentAnswer || ""}
              onChangeText={formikProps.handleChange(fieldName)}
            />
          </QuestionCard>
        );
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchUserPreference(token));
    } else {
    }
  }, [dispatch, token]);

  // Initialize questions, choices, and answers from API data
  useEffect(() => {
    if (userPreference?.data) {
      const questionsData = [];
      const choicesData = {};
      const answersData = {};

      userPreference.data.forEach((item, index) => {
        // Ensure we have a valid ID
        const questionId = item.id || `question_${index}`;
        // Store question data
        questionsData.push({
          id: questionId,
          question: item.question,
          user_answer: item.user_answer
        });

        // Store choices if available
        if (item.choices && Array.isArray(item.choices)) {
          choicesData[questionId] = item.choices;
        }

        // Store answers if available
        if (item.user_answer !== null && item.user_answer !== undefined) {
          answersData[questionId] = item.user_answer;
        }
      });

      setQuestions(questionsData);
      setChoices(choicesData);
      setAnswers(answersData);
    }
  }, [userPreference?.data]);

  // Check if all questions have valid answers
  const allQuestionsAnswered = (values) => {
    if (!values || !questions.length) return false;

    const allAnswered = questions.every(question => {
      const fieldName = `question_${question.id}`;
      const answer = values[fieldName];

      // Check if answer has a meaningful value
      if (answer === null || answer === undefined || answer === '') return false;
      if (Array.isArray(answer) && answer.length === 0) return false;
      if (typeof answer === 'string' && answer.trim() === '') return false;

      return true;
    });

    return allAnswered;
  };

  // Create initial values for Formik
  const createInitialValues = () => {
    const initialValues = {};
    questions.forEach(question => {
      const answer = answers[question.id] !== undefined ? answers[question.id] : question.user_answer;

      // Handle different answer types properly
      if (answer === null || answer === undefined) {
        // Set appropriate default values based on question type
        const questionType = typeof question.question === 'object' ? question.question.question_type : 'TEXT';
        switch (questionType) {
          case 'BOOL':
            // Don't set default value for BOOL questions - let them be null/undefined
            initialValues[`question_${question.id}`] = '';
            break;
          case 'MOD_MULTI':
            initialValues[`question_${question.id}`] = [];
            break;
          case 'DATE':
            initialValues[`question_${question.id}`] = '';
            break;
          default:
            initialValues[`question_${question.id}`] = '';
        }
      } else {
        initialValues[`question_${question.id}`] = answer;
      }
    });

    return initialValues;
  };

  return (
    <View style={{ flex: 1 }}>
      <PrimaryLayout title="Personalised settings" />
      <View style={{
        flex: 1, marginTop: -16,
        backgroundColor: '#F5F6F9',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={getKeyboardAvoidingBehavior()}
          keyboardVerticalOffset={getKeyboardVerticalOffset(80)}
        >
          {userPreferenceLoading ? (
            // Skeleton Loading
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{ paddingBottom: 160 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <SkeletonQuestionCard
                  key={item}
                  type={['TEXT', 'BOOL', 'MOD_MULTI', 'DATE'][item % 4]}
                  isPortrait={isPortrait}
                />
              ))}
            </ScrollView>
          ) : (
            <Formik
              key={questions.length} // Force re-render when questions change
              initialValues={createInitialValues()}
              innerRef={formikRef}
              onSubmit={async (values, { setSubmitting }) => {
                // Convert Formik values to the required format
                const formattedAnswers = [];

                // Include ALL questions from the API response, even if they don't have answers
                questions.forEach(question => {
                  const fieldName = `question_${question.id}`;
                  const answer = values[fieldName];

                  // Get the correct question_id from the question object
                  // The question_id should be from the nested question object, not the outer id
                  const questionId = question.question?.id || question.id;

                  // Format the answer based on its type
                  let formattedAnswer;
                  if (Array.isArray(answer)) {
                    // For MOD_MULTI questions, extract just the IDs
                    formattedAnswer = answer.map(item => item.id);
                  } else if (answer === null || answer === undefined || answer === '') {
                    // For empty answers, send null
                    formattedAnswer = null;
                  } else {
                    // For other types, use the value as is
                    formattedAnswer = answer;
                  }

                  formattedAnswers.push({
                    question_id: questionId,
                    answer: formattedAnswer
                  });
                });
                try {

                  const res = await dispatch(updateUserPreference(formattedAnswers));

                  if (res.payload.status === 200) {

                    dispatch(updatePreference(formattedAnswers));

                    Toast.show({
                      text1: res?.payload?.data?.message || 'User preference updated successfully',
                      type: 'success',
                    });
                  }
                } catch (error) {
                  console.error('Error updating user preference:', error);
                } finally {
                  // Reset submission state
                  setSubmitting(false);
                }
              }}
            >
              {(formikProps) => (
                <>
                  <ScrollView
                    style={styles.contentContainer}
                    contentContainerStyle={{ paddingBottom: 160 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {questions.map(question => renderQuestion(question, formikProps))}
                  </ScrollView>

                  <View style={[styles.fixedButtonContainer, { bottom: insets.bottom + 20 }]}>
                    <Button
                      theme={'dark'}
                      text={formikProps.isSubmitting ? "Updating..." : "Update"}
                      onPress={formikProps.handleSubmit}
                      disabled={formikProps.isSubmitting || !allQuestionsAnswered(formikProps.values)}
                    />
                  </View>
                </>
              )}
            </Formik>
          )}
        </KeyboardAvoidingView>
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={isCalendarVisible}
        onRequestClose={() => {
          setCalendarVisible(false);
          setCurrentDateQuestionId(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => {
            setCalendarVisible(false);
            setCurrentDateQuestionId(null);
          }}
        >
          <View style={styles.modalContent}>
            <Calendar
              startDate={new Date().toISOString().split('T')[0]}
              onDayPress={(day) => {
                const newDate = day.dateString;
                setSelectedDate(newDate);
                setCalendarVisible(false);

                // Update Formik value if we have a current date question ID
                if (currentDateQuestionId && formikRef.current && newDate) {
                  const fieldName = `question_${currentDateQuestionId}`;
                  formikRef.current.setFieldValue(fieldName, newDate);
                }
                setCurrentDateQuestionId(null);
              }}
              minDate={new Date().toISOString().split('T')[0]}
              markedDates={
                selectedDate ? {
                  [selectedDate]: {
                    selected: true,
                    selectedColor: '#8B7FD1',
                    selectedTextColor: '#FFFFFF'
                  },
                } : {}
              }
              theme={{
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#938EA2',
                selectedDayBackgroundColor: '#8B7FD1',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#8B7FD1',
                dayTextColor: '#2D3748',
                textDisabledColor: '#CBD5E0',
                dotColor: '#8B7FD1',
                selectedDotColor: '#FFFFFF',
                arrowColor: '#8B7FD1',
                monthTextColor: '#2D3748',
                indicatorColor: '#8B7FD1',
                textDayFontFamily: 'instrument-sans-500',
                textMonthFontFamily: 'clash-display-600',
                textDayHeaderFontFamily: 'instrument-sans-500',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
              style={styles.calendar}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#7F4DFF",
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: getStatusBarHeight() - 5,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 25,
  },
  headerTitle: {
    fontSize: 30,
    color: "#FFFFFF",
    marginTop: 24,
    fontFamily: "clash-display-700",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 20,
    paddingBottom: 15,
    elevation: 1,
    // 
  },
  cardTitle: {
    fontSize: 18,
    color: "#5D1F28",
    marginBottom: 20,
    fontFamily: "clash-display-600",
  },

  // New date dropdown styles matching DynamicQuestionSheet.js
  dateDropdownContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 16,
  },
  dateDropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateDropdownText: {
    fontSize: 16,
    fontFamily: 'instrument-sans-500',
    color: '#2D3748',
    flex: 1,
  },
  toggleContainer: { flexDirection: "row" },
  toggleButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 5,
  },
  toggleButtonSelected: { borderColor: "#7F4DFF", backgroundColor: "#F3EFFF" },
  toggleButtonText: { fontSize: 16, color: "#A9A9A9" },
  toggleButtonTextSelected: { fontWeight: "bold", color: "#000000" },
  textInput: {
    height: 55,
    width: '100%',
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  textInputContainer: {
    justifyContent: "space-between",
    gap: 10
  },

  scrollableCheckboxContainer: { maxHeight: 320 },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 16,
    marginBottom: 12,
  },
  checkboxRowSelected: { borderColor: "#7F4DFF", backgroundColor: "#F3EFFF" },
  checkboxLabel: { fontSize: 16, color: "#111013", fontFamily: "instrument-sans-400" },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#C4C4C4",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: { backgroundColor: "#7F4DFF", borderColor: "#7F4DFF" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  calendar: {
    borderRadius: 12,
  },
  fixedButtonContainer: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16,
    color: '#7F4DFF',
    fontWeight: '500',
  },
  testButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  testButtonText: {
    color: '#7F4DFF',
    fontSize: 12,
    fontWeight: '500',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 16,
    color: '#A9A9A9',
    textAlign: 'center',
  },
  incompleteFormText: {
    fontSize: 14,
    color: '#F57474',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'instrument-sans-500',
  },
  // Skeleton Styles
  skeletonTitle: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 20,
    width: '80%',
  },
  skeletonContent: {
    height: 55,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  skeletonTextInput: {
    height: 55,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
  },
  skeletonToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonToggleButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginHorizontal: 5,
  },
  skeletonCheckboxContainer: {
    maxHeight: 320,
  },
  skeletonCheckboxRow: {
    height: 60,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonDateDropdown: {
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    width: '100%',
  },
});

export default PersonalisedSettingsScreen;
