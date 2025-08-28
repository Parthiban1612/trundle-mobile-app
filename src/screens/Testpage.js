import { View, Text, StatusBar, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import BackIcon from '../../assets/left_arrow.svg';
import { TouchableRipple } from 'react-native-paper';
import { getStatusBarHeight } from '../utils/platformUtils';
import { useGlobalBottomSheet } from '../context/GlobalBottomSheetContext';
import SubscriptionIcon from '../../assets/subscription-badge.svg';
import CheckIcon from '../../assets/tick.svg';
import Button from '../components/Button';

const Header_Max_Height = 240;
const Header_Min_Height = 120;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({ scrollY }) => {
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, Scroll_Distance],
      [Header_Max_Height, Header_Min_Height],
      Extrapolate.CLAMP
    );

    const backgroundColor = interpolate(
      scrollY.value,
      [0, Scroll_Distance],
      [0, 0], // Keep same color, but you can change this for color transitions
      Extrapolate.CLAMP
    );

    return {
      height,
      backgroundColor: '#7F4DFF',
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, Scroll_Distance],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const animatedBackButtonStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, Scroll_Distance],
      [1, 0.9],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.header, animatedHeaderStyle]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.headerContent}>
        <Animated.View style={animatedBackButtonStyle}>
          <TouchableRipple
            borderless
            rippleColor={`rgba(197, 184, 184, 0.12)`}
            onPress={() => {
              // navigation.goBack();
              console.log('Back button pressed');
            }}
            style={styles.backButton}>
            <BackIcon />
          </TouchableRipple>
        </Animated.View>
        <Animated.Text style={[styles.headerTitle, animatedTitleStyle]}>
          Account
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const Testpage = () => {
  const { openBottomSheet, closeBottomSheet } = useGlobalBottomSheet();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const planBenefit = [
    `Add unlimited recommendations to \n your My Trips`,
    `Build your own itinerary`,
    `Get tips, updates and real-time \n notifications`,
    `Talk to our local travel experts and get \n custom made itinerary just for you`
  ]

  const handleOpenBottomSheet = () => {
    openBottomSheet({
      content: (
        <View style={{ paddingHorizontal: 20, backgroundColor: '#FFFFFF' }}>
          <View style={{ backgroundColor: "#5212C5", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, marginHorizontal: 'auto' }}>
              <SubscriptionIcon />
              <Text style={{ fontSize: 13, fontFamily: 'instrument-sans-600', color: '#EBE7FF' }}>
                Upgrade to Trundle+
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: "#F288D1", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 16 }}>
            <Text style={{ fontSize: 15, fontFamily: 'instrument-sans-400', color: '#FFFFFF', textAlign: "center", marginbotom: 4 }}>
              Unlock premium benefits{'\n'}for just
            </Text>
            <Text style={{ fontSize: 30, fontFamily: 'clash-display-700', color: '#FFFFFF', textAlign: "center" }}>
              $50
            </Text>
            <Text style={{ fontSize: 11, fontFamily: 'instrument-sans-500', color: '#FFFFFF', textAlign: "center" }}>
              per trip
            </Text>
          </View>

          <View style={{ gap: 12, padding: 24 }}>
            {planBenefit.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <CheckIcon />
                <Text style={{ fontSize: 15, fontFamily: 'instrument-sans-400', color: '#3B3842' }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <Button style={{ marginHorizontal: 24 }} theme="dark" text="Proceed to pay" onPress={() => {
            console.log('Next button pressed');
            closeBottomSheet();
          }} />

        </View>
      ),
      headerTitle: '',
      questionType: 'PLAN'
    });
  };

  return (
    <View style={styles.container}>
      <DynamicHeader scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>

        {new Array(10).fill(0).map((item, index) => (
          <View key={index} style={styles.card}>
            <Text>Testpage</Text>
          </View>
        ))}

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Testpage</Text>
            <Text style={{ fontSize: 16, fontWeight: '400', color: '#7F4DFF' }}>Testpage</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '400', color: '#7F4DFF' }}>Testpage</Text>
            <Text style={{ fontSize: 16, fontWeight: '400', color: '#7F4DFF' }}>Testpage</Text>
          </View>
        </View>

        {/* Bottom Sheet Button */}
        <View style={styles.card}>
          <Button
            onPress={handleOpenBottomSheet}
            style={{ marginHorizontal: 24 }}
            theme="dark"
            text="Open Bottom Sheet" />
        </View>

      </Animated.ScrollView>
    </View>
  )
}

export default Testpage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    paddingTop: 25,
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  headerContent: {
    paddingTop: getStatusBarHeight() + 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    width: '100%',
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: 'clash-display-700',
    color: '#FFFFFF',
    marginTop: 9.5,
    marginBottom: 23,
  },
  scrollView: {
    flex: 1,
    padding: 16,
    marginTop: Header_Max_Height,
    backgroundColor: '#F5F6F9',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
});