import {
    TouchableOpacity, View, Text, StyleSheet, Image, StatusBar
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import SliderImage from "../../assets/sliderProfile.svg";
import CountrySelectionGrid from '../components/CountrySelectionGrid';
import { Surface } from 'react-native-paper';
import NextButton from '../components/NextButton';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { submitUserCountry, getAllItineraries, getSubmittedCountry } from '../redux/travelCountriesSlice';
import { setActiveIndex } from '../redux/carouselSlice';
import { fetchFavourites } from '../redux/favouriteSlice';
import { fetchCategories } from '../redux/categoriesSlice';
import { getSafeAreaTop } from '../utils/platformUtils';

const PageTwo = ({ scrollRef, indicator, parentFlatListRef }) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { selectedCountry, loading, submitLoading } = useSelector(
        (state) => state.travelCountries
    );

    const handleContinue = async () => {

        if (selectedCountry !== null) {
            try {
                const countryId = selectedCountry.id || selectedCountry.code;
                const result = await dispatch(submitUserCountry({ token, countryId }));

                if (submitUserCountry.fulfilled.match(result)) {
                    // Update Redux state
                    dispatch(setActiveIndex(0));

                    // Refresh all data after country selection
                    dispatch(getAllItineraries({ token, categoryId: null, subcategoryId: null }));
                    dispatch(fetchFavourites());
                    dispatch(fetchCategories(token));
                    dispatch(getSubmittedCountry());

                    // Trigger the slide animation by scrolling the FlatList
                    if (parentFlatListRef?.current) {
                        parentFlatListRef.current.scrollToIndex({
                            index: 0,
                            animated: true,
                        });
                    }

                    Toast.show({
                        text1: result?.payload?.message,
                        type: 'success',
                    });
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
        <>
            <View style={styles.headerContainer}>
                <View style={styles.headerTopRow}>
                    <View style={styles.sideContainer} />
                    <View />
                    <TouchableOpacity style={styles.sideContainer}>
                        <SliderImage width="28" height="28" />
                    </TouchableOpacity>
                </View>
                {indicator}
            </View>

            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                contentContainerStyle={{ paddingBottom: 80, backgroundColor: '#F5F6F9' }}
            >
                <View style={styles.imageSection}>
                    <Image source={require('../../assets/new-trip.png')} style={styles.mainImage} />
                    <View style={styles.textOverlayContainer}>
                        <Text style={styles.titleText}>Add New {'\n'}Trip</Text>
                    </View>
                    <Image source={require('../../assets/dashed.png')} style={styles.dashedOverlay} />
                </View>

                <View style={styles.bodyBackground}>
                    <Surface style={[styles.card]}>
                        <CountrySelectionGrid />

                        <View style={styles.buttonContainer}>
                            <NextButton
                                theme='dark'
                                onPress={handleContinue}
                                disabled={loading || submitLoading || selectedCountry === null}
                                text={submitLoading ? "Submitting..." : "Continue"}
                            />
                        </View>
                    </Surface>
                </View>
            </ScrollView>
        </>
    );
};

export default PageTwo;

const styles = StyleSheet.create({
    card: {
        width: '90%',
        backgroundColor: '#fff',
        marginBottom: 40,
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 2,
        justifyContent: 'flex-start',
    },
    bodyBackground: {
        flex: 1,
        backgroundColor: '#F5F6F9',
        alignItems: 'center',
        paddingTop: 0,
        width: '100%',
        paddingTop: 17,
    },
    headerContainer: {
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: '#938EA2',
        paddingVertical: 10,
        paddingTop: getSafeAreaTop(true)
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sideContainer: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContentContainer: { paddingBottom: 40 },
    imageSection: { position: 'relative' },
    mainImage: { width: '100%', height: 260, resizeMode: 'cover' },
    dashedOverlay: { width: '100%', height: 10, position: 'absolute', bottom: 0, resizeMode: 'stretch' },
    textOverlayContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    titleText: { color: '#3B3842', fontSize: 30, fontWeight: "600", textAlign: 'center', fontFamily: "ClashDisplay-Variable" },
    selectorSection: { elevation: 9, shadowColor: '#B9B7B7', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 2, backgroundColor: "#fff", borderRadius: 24, padding: 16 },
    row: { flex: 1, justifyContent: 'space-around', gap: 10, marginBottom: 16 },
    radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D1D6', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    selectedRadio: { width: 12, height: 12, borderRadius: 6 },
    countryName: { fontSize: 16, flexShrink: 1, fontFamily: "ClashDisplay-Variable", fontSize: 18 },
    cardContainer: { flex: 1, maxWidth: '48%', backgroundColor: '#F5F6F9', borderRadius: 20, padding: 10, borderColor: "#EFEDF1", borderWidth: 1 },
    cardImage: { width: '100%', height: 164, borderRadius: 12, marginBottom: 12 },
    selectionContainer: { flexDirection: 'row', alignItems: 'center' },
    cardContainerEmpty: { flex: 1, maxWidth: '48%', backgroundColor: 'transparent' },
});