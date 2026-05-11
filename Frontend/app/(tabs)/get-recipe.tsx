import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSuggestions, getFullRecipe } from '../services/api';

export default function GetRecipe() {
  const [ingredients, setIngredients] = useState('');
  const [flavor, setFlavor] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (!ingredients) return alert("Please enter some ingredients!");
    setLoading(true);
    try {
      const data = await getSuggestions({ ingredients, flavor: flavor || 'any', preferences: 'quick' });
      setSuggestions(data);
      setRecipe(null);
    } catch (e) {
      alert("Error fetching suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDish = async (title: string) => {
    setLoading(true);
    try {
      const data = await getFullRecipe(title);
      setRecipe(data.recipe);
    } catch (e) {
      alert("Error fetching recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: '#F8F9FA' }}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        
        {/* Header Section */}
        <View style={{ marginTop: 20, marginBottom: 25 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1A1A1A' }}>Recipe Lab 🧪</Text>
          <Text style={{ fontSize: 16, color: '#6C757D', marginTop: 5 }}>What are we working with today?</Text>
        </View>

        {/* Input Card */}
        {!recipe && (
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Ingredients</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="fast-food-outline" size={20} color="#FF6B6B" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Tomato, Cheese, Basil..."
                placeholderTextColor="#ADB5BD" // Higher visibility
                style={styles.textInput}
                value={ingredients}
                onChangeText={setIngredients}
              />
            </View>

            <Text style={styles.inputLabel}>Flavor Profile</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="flame-outline" size={20} color="#FF6B6B" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="e.g. Spicy, Mediterranean, Creamy"
                placeholderTextColor="#ADB5BD"
                style={styles.textInput}
                value={flavor}
                onChangeText={setFlavor}
              />
            </View>

            <TouchableOpacity 
              onPress={handleGetSuggestions}
              activeOpacity={0.8}
              style={styles.primaryButton}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Generate Ideas</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* AI Suggestions Section */}
        {!recipe && suggestions.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 15, color: '#343A40' }}>Try these:</Text>
            {suggestions.map((item: any) => (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => handleSelectDish(item.title)}
                style={styles.suggestionCard}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#1A1A1A' }}>{item.title}</Text>
                  <Text style={{ color: '#6C757D', marginTop: 4, fontSize: 14 }}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CED4DA" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Full Recipe Result */}
        {recipe && (
          <View style={styles.recipeContainer}>
            <TouchableOpacity onPress={() => setRecipe(null)} style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="arrow-back" size={20} color="#FF6B6B" />
              <Text style={{ color: '#FF6B6B', fontWeight: 'bold', marginLeft: 5 }}>Back to list</Text>
            </TouchableOpacity>
            
            <View style={styles.recipeContent}>
              <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 15, color: '#1A1A1A' }}>Step-by-Step Guide</Text>
              <Text style={{ fontSize: 16, lineHeight: 26, color: '#495057' }}>{recipe}</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textInput: {
    flex: 1,
    height: 50,
    color: '#212529',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    marginTop: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  suggestionCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  recipeContainer: {
    marginTop: 10,
  },
  recipeContent: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 20,
    borderLeftWidth: 8,
    borderLeftColor: '#4ECDC4',
  }
};