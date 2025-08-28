import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchTravelCountries, setSelectedCountry } from '../redux/travelCountriesSlice';
import { useDispatch, useSelector } from 'react-redux';

// Country Card Skeleton Component
const CountryCardSkeleton = () => (
  <View style={styles.countryCardWrapper}>
    <View style={styles.countryCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.countryInfo}>
        <View style={styles.skeletonRadio} />
        <View style={styles.skeletonText} />
      </View>
    </View>
  </View>
);

const CountrySelectionGrid = ({ renderSkeleton = true }) => {
  const dispatch = useDispatch();

  const onCountrySelect = (country) => {
    dispatch(setSelectedCountry(country));
  };

  const { token } = useSelector((state) => state.auth);

  const { travelCountries, selectedCountry, loading } = useSelector(
    (state) => state.travelCountries
  );

  useEffect(() => {
    dispatch(fetchTravelCountries(token));
  }, [token]);

  // Render skeleton loader while loading
  const renderSkeletonGrid = () => {
    if (!renderSkeleton) return null;

    const skeletonCards = Array(4).fill(null).map((_, index) => (
      <CountryCardSkeleton key={`skeleton-${index}`} />
    ));

    return (
      <View style={styles.countriesGrid}>
        {skeletonCards}
      </View>
    );
  };

  if (loading) {
    return renderSkeletonGrid();
  }

  return (
    <View style={styles.countriesGrid}>
      {travelCountries?.map((country, index) => (
        <View key={index} style={styles.countryCardWrapper}>
          <TouchableRipple
            style={[
              styles.countryCard,
              selectedCountry?.id === country.id && styles.countryCardSelected
            ]}
            onPress={() => onCountrySelect(country)}
            rippleColor="#DAD8DF"
          >
            <>
              <Image
                source={{ uri: country.image }}
                style={styles.countryImage}
              />
              <View style={styles.countryInfo}>
                {selectedCountry?.id === country.id ? (
                  <Icon name="checkmark-circle" size={19} color="#000000" style={styles.radioIcon} />
                ) : (
                  <View style={styles.radioButton} />
                )}
                <Text numberOfLines={1} style={[
                  styles.countryName,
                  selectedCountry?.id === country.id && styles.countryNameSelected
                ]}>
                  {country.name.charAt(0).toUpperCase() + country.name.slice(1).toLowerCase()}
                </Text>
              </View>
            </>
          </TouchableRipple>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  countriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  countryCardWrapper: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  countryCard: {
    padding: 8,
    width: '100%',
    backgroundColor: '#F5F6F9',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryCardSelected: {
    backgroundColor: '#DAD8DF',
  },
  countryImage: {
    width: '100%',
    height: 164,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 14,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#938EA2',
    marginRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioIcon: {
    marginRight: 2,
  },
  countryName: {
    fontSize: 18,
    fontFamily: 'instrument-sans-600',
    color: '#111013',
    flex: 1,
  },
  countryNameSelected: {
    color: '#000000', // Black color when selected
  },
  // Skeleton styles
  skeletonImage: {
    width: '100%',
    height: 164,
    borderRadius: 12,
    backgroundColor: '#E1E5E9',
    marginBottom: 14,
  },
  skeletonRadio: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#E1E5E9',
    marginRight: 2,
  },
  skeletonText: {
    width: 120,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#E1E5E9',
    flex: 1,
  },
});

export default CountrySelectionGrid; 