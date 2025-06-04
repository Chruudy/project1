import { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { searchProducts } from '../../services/kassalapp';

let lastSearchTime = 0;
const screenWidth = Dimensions.get('window').width;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;

export default function ShoppingScreen() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const now = Date.now();
    if (now - lastSearchTime < 1000) return;
    lastSearchTime = now;

    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    Keyboard.dismiss();

    try {
      const result = await searchProducts(query.trim());
      console.log('Search results:', result.data);
      setProducts(result.data ?? []);
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Browse Products</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search for a product..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{ marginVertical: 16 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 40 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: ITEM_MARGIN }}
        renderItem={({ item }) => {
          const imageSource = item.image || null;
          return (
            <TouchableOpacity style={styles.card}>
              <View style={styles.imageBox}>
                {imageSource ? (
                  <Image
                    source={{ uri: imageSource }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={{ fontSize: 24 }}>🛍️</Text>
                )}
              </View>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.brand}>{item.brand ?? 'Unknown'}</Text>
              <Text style={styles.price}>
                {item.current_price ? `NOK ${item.current_price}` : 'Price unknown'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ITEM_MARGIN,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
});
