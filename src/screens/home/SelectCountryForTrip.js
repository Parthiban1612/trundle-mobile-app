import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import PrimaryHeader from '../../components/PrimaryHeader';
import Button from '../../components/Button';
import CountrySelectionGrid from '../../components/CountrySelectionGrid';
import { fetchTravelCountries, submitUserCountry } from '../../redux/travelCountriesSlice';
import useStatusBar from '../../hooks/useStatusBar';
import Toast from 'react-native-toast-message';

export default function SelectCountryForTrip() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Set status bar style
  useStatusBar('light-content', '#8B5CF6');

  const { selectedCountry, loading, submitLoading } = useSelector(
    (state) => state.travelCountries
  );

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTravelCountries(token));
  }, [token]);

  const handleContinue = async () => {

    if (selectedCountry !== null) {
      try {
        const countryId = selectedCountry.id || selectedCountry.code;
        const result = await dispatch(submitUserCountry({ token, countryId }));

        if (submitUserCountry.fulfilled.match(result)) {
          Toast.show({
            text1: result?.payload?.message,
            type: 'success',
          });
          navigation.navigate('MainTabs');
        } else {
          Toast.show({
            text1: result?.payload?.message,
            type: 'error',
          });
        }
      } catch (error) {
        console.error('Error submitting country:', error);
        Toast.show({
          text1: error?.payload?.message,
          type: 'error',
        });
      }
    } else {
      console.log('No country selected');
      Toast.show({
        text1: 'Please select a country',
        type: 'error',
      });
    }
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader
        isFullHeight={false}
        title="Start a trip"
        text1="Please select the country you're"
        text2="travelling to"
      >
        <View style={styles.content}>
          <CountrySelectionGrid />
          <View style={styles.buttonContainer}>
            <Button
              theme='dark'
              onPress={handleContinue}
              disabled={loading || submitLoading || selectedCountry === null}
              text={submitLoading ? "Submitting..." : "Continue"}
            />
          </View>
        </View>
      </PrimaryHeader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9FF',
  },
  content: {
    paddingTop: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});
