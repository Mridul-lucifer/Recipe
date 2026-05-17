import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  LayoutAnimation,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSuggestions, getFullRecipe } from '../services/api'; // Ensure correct path

// Definitions for the UX components
const pantryStaples = [
  "Turmeric", "Cumin", "Coriander Powder", "Chilli Powder", "Garam Masala",
  "Oil", "Salt", "Onion", "Ginger-Garlic Paste", "Atta (Flour)", "Rice", "Dal"
];

const preferenceTags = ["Quick (15 min)", "Comfort Food", "Low Oil", "Spicy", "Desi Chinese"];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function GetRecipe() {
  const [vegetables, setVegetables] = useState('');
  const [flavor, setFlavor] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [showPantry, setShowPantry] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to manage preference tags
  const togglePreference = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleGetSuggestions = async () => {
    // Combine inputs into a clean format for the AI
    const allIngredients = `Main: ${vegetables}. Stored Pantry: ${pantryStaples.join(', ')}.`;
    const finalPreferences = `${flavor}, ${preferences.join(', ')}`;

    if (!vegetables) return alert("Bhai, at least tell me what vegetable or protein you have!");
    
    setLoading(true);
    try {
      const data = await getSuggestions({ 
        ingredients: allIngredients, 
        flavor: flavor || 'Indian/Home-style', 
        preferences: finalPreferences
      });
      setSuggestions(data);
      setRecipe(null);
    } catch (e) {
      alert("Something went wrong on our end. Please try again.");
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

  const togglePantryAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPantry(!showPantry);
  };

  // Renders the input section (Inputs + Pantry + Prefs)
  const renderInputForm = () => (
    <View style={styles.card}>
      {/* 1. HERO INGREDIENT INPUT */}
      <Text style={styles.inputLabel}>Today's Main Ingredients</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="nutrition-outline" size={20} color="#FF6B6B" style={styles.inputIcon} />
        <TextInput
          placeholder="e.g. Aloo, Paneer, Spinach, Gobi..."
          placeholderTextColor="#ADB5BD"
          style={styles.textInput}
          value={vegetables}
          onChangeText={setVegetables}
        />
      </View>

      {/* 2. Pantry Staple Accordion */}
      <TouchableOpacity 
        onPress={togglePantryAccordion} 
        style={styles.accordionHeader}
        activeOpacity={0.7}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="leaf-outline" size={18} color="#6C757D" style={{marginRight: 8}} />
          <Text style={styles.accordionTitle}>Assuming you have standard Masalas/Pantry?</Text>
        </View>
        <Ionicons 
          name={showPantry ? "chevron-up" : "chevron-down"} 
          size={18} 
          color="#ADB5BD" 
        />
      </TouchableOpacity>
      {showPantry && (
        <View style={styles.accordionContent}>
          <Text style={styles.pantrySubText}>We assume you have these at home. We'll only ask for unusual ingredients in the recipe.</Text>
          <View style={styles.tagWrapper}>
            {pantryStaples.map(staple => (
              <View key={staple} style={styles.pantryStapleTag}>
                <Ionicons name="checkbox" size={14} color="#4ECDC4" style={{marginRight: 4}} />
                <Text style={styles.pantryTagText}>{staple}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 3. QUICK MEAL PREFERENCES */}
      <Text style={[styles.inputLabel, {marginTop: 15}]}>Preferences</Text>
      <View style={styles.tagWrapper}>
        {preferenceTags.map(pref => {
          const isSelected = preferences.includes(pref);
          return (
            <TouchableOpacity 
              key={pref} 
              onPress={() => togglePreference(pref)}
              style={[styles.choiceTag, isSelected && styles.choiceTagSelected]}
            >
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{pref}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. FLAVOR INPUT (optional) */}
      <Text style={[styles.inputLabel, {marginTop: 15}]}>Specific Request (optional)</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="restaurant-outline" size={20} color="#FF6B6B" style={styles.inputIcon} />
        <TextInput
          placeholder="e.g. Want something sweet, something spicy"
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
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Generate Recipes</Text>}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: '#F8F9FA' }}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Ghar Ki Rasoi AI 🍲</Text>
          <Text style={styles.headerSubtitle}>Enter your sabzi, we’ll handle the masala!</Text>
        </View>

        {/* INPUT FORM OR RESULTS */}
        {renderInputForm()}

        {/* AI Suggestions Section (Shows results) */}
        {!recipe && suggestions.length > 0 && (
          <View style={{ marginTop: 25 }}>
            <Text style={styles.resultsTitle}>Suggestions based on your ingredients:</Text>
            {suggestions.map((item: any) => (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => handleSelectDish(item.title)}
                style={styles.suggestionCard}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.dishTitle}>{item.title}</Text>
                  <Text style={styles.dishDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CED4DA" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Full Recipe Result */}
        {recipe && (
          <View style={styles.recipeContainer}>
            <TouchableOpacity onPress={() => setRecipe(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#FF6B6B" />
              <Text style={styles.backButtonText}>Back to suggestions</Text>
            </TouchableOpacity>
            
            <View style={styles.recipeContent}>
              <Text style={styles.stepTitle}>Let's Cook 👩‍🍳</Text>
              <Text style={styles.recipeText}>{recipe}</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 55,
    color: '#212529',
    fontSize: 16,
  },
  // Accordion Styles
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    marginTop: 10,
  },
  accordionTitle: {
    fontSize: 13,
    color: '#6C757D',
    fontWeight: '600',
  },
  accordionContent: {
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginBottom: 15,
  },
  pantrySubText: {
    fontSize: 12,
    color: '#adb5bd',
    marginBottom: 10,
  },
  pantryStapleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginRight: 6,
    marginBottom: 6,
  },
  pantryTagText: {
    fontSize: 12,
    color: '#495057',
  },
  // Tag Selection Styles
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choiceTag: {
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  choiceTagSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  tagText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '600',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  // Results Styles
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#343A40',
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dishTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1A1A1A',
  },
  dishDescription: {
    color: '#6C757D',
    marginTop: 4,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  recipeContainer: {
    marginTop: 10,
  },
  backButton: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  recipeContent: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 24,
    borderLeftWidth: 8,
    borderLeftColor: '#4ECDC4',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 15,
    color: '#1A1A1A',
  },
  recipeText: {
    fontSize: 15,
    lineHeight: 25,
    color: '#495057',
  }
});