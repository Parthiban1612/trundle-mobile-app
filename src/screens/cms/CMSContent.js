import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import PrimaryLayout from '../../components/PrimaryLayout';
import SkeletonLoader from '../../components/SkeletonLoader'

// Skeleton component for favorites that matches the actual FavCard
const FavoriteSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonTextContainer}>
        <SkeletonLoader
          width={200}
          height={17}
          borderRadius={4}
          style={{ marginBottom: 12 }}
        />
        {new Array(4).fill(0).map((_, index) => (
          <SkeletonLoader
            key={index}
            width={`100%`}
            height={15}
            borderRadius={4}
            style={{ marginBottom: 4 }}
          />
        ))}
      </View>
    </View>
  </View>
);

export default function CMSContent({ title, html, loading }) {
  return (
    <PrimaryLayout title={title}>
      <View style={{ flex: 1, backgroundColor: '#F5F6F9', marginTop: -16 }}>
        {loading ? (
          <View style={{ flex: 1, paddingTop: 20 }}>
            {new Array(5).fill(0).map((_, index) => (
              <FavoriteSkeleton key={index} />
            ))}
          </View>
        ) : (
          <WebView
            source={{ html }}
            style={{ flex: 1, width: '100%' }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </PrimaryLayout>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    width: '95%',
    marginHorizontal: 'auto',
    marginVertical: 7,
  },

  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    width: '100%',
  },

  skeletonTextContainer: {
    flex: 1,
  },
});

