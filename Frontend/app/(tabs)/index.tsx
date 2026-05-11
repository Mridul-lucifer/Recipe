import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <View style={{ marginTop: 60, marginBottom: 30 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1a1a1a' }}>Chef AI 🍳</Text>
        <Text style={{ fontSize: 18, color: '#666', marginTop: 10 }}>
          Turn your leftover ingredients into gourmet meals in seconds.
        </Text>
      </View>

      <View style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 15, marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10 }}>How it works:</Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: '#444' }}>
          1. Enter the ingredients you have.{"\n"}
          2. Pick a flavor profile.{"\n"}
          3. Choose a dish & get cooking!
        </Text>
      </View>

      <TouchableOpacity 
        onPress={() => router.push('/get-recipe')}
        style={{ backgroundColor: '#ff6b6b', padding: 18, borderRadius: 12, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Start Cooking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}