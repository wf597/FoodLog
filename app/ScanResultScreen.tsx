import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import NutritionProgressCard from '@/components/NutritionProgressCard';
import FoodItemCard from '@/components/FoodItemCard';
import PrimaryButton from '@/components/PrimaryButton';
import IconButton from '@/components/IconButton';
import { useDailyFood, MealType } from '@/context/DailyFoodContext';

// Mock data
const MOCK_DATA = {
  calories: '190 kcal',
  macros: [
    { title: 'Protein', value: '83%', progress: 0.83, color: '#5ECD8B' },
    { title: 'Carbs', value: '50%', progress: 0.5, color: '#FCD269' },
    { title: 'Fat', value: '63%', progress: 0.63, color: '#FD8F6F' },
    { title: 'Fibre', value: '10%', progress: 0.1, color: '#9D9D9D' },
  ],
  foodItems: [
    {
      id: '1',
      title: 'Avocado',
      details: '190 kcal | Protein: 2g | Carbs: 11g | Fat: 18g | Fibre: 8g',
    },
  ],
};

export default function ScanResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<typeof MOCK_DATA | null>(null);
  const [showMealModal, setShowMealModal] = useState(false);
  const { addFoodToMeal } = useDailyFood();

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setApiData(MOCK_DATA);
      setIsLoading(false);
    }, 4000);
  }, []);

  const handleAddToDiet = () => {
    setShowMealModal(true);
  };

  const handleSelectMeal = (mealType: MealType) => {
    console.log(`Adding to ${mealType}`);
    setShowMealModal(false);
    
    // Add food to the selected meal
    if (apiData && apiData.foodItems.length > 0) {
      const foodItem = apiData.foodItems[0];
      
      // Extract nutrition values from details string
      // Format: "190 kcal | Protein: 2g | Carbs: 11g | Fat: 18g | Fibre: 8g"
      const extractValue = (str: string, label: string): number => {
        const regex = new RegExp(`${label}:\\s*(\\d+(?:\\.\\d+)?)g`, 'i');
        const match = str.match(regex);
        return match ? parseFloat(match[1]) : 0;
      };
      
      const calories = parseInt(apiData.calories.replace(' kcal', ''), 10) || 0;
      const protein = extractValue(foodItem.details, 'Protein');
      const carbs = extractValue(foodItem.details, 'Carbs');
      const fat = extractValue(foodItem.details, 'Fat');
      const fibre = extractValue(foodItem.details, 'Fibre');
      
      addFoodToMeal(mealType, {
        id: foodItem.id,
        title: foodItem.title,
        calories,
        protein,
        carbs,
        fat,
        fibre,
      });
    }
    
    // Show success message
    Alert.alert('Success', `Food added to ${mealType}!`);
    
    // Navigate to home page (index tab)
    // The correct approach in Expo Router:
    // Since ScanResultScreen is a Stack screen, we can use router.replace
    // to reset the navigation stack and go directly to the home tab
    setTimeout(() => {
      // Replace the navigation stack to go directly to home tab
      // This clears ScanResultScreen from history and navigates to home
      router.replace('/(tabs)/home');
    }, 500);
  };

  const handleCloseModal = () => {
    setShowMealModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Transparent Header - Only show heart icon */}
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
          headerLeft: () => null,
          headerRight: () => (
            <IconButton name="heart-outline" onPress={() => {}} color="white" />
          ),
        }}
      />

      {/* Background Image - Covers all space except content card */}
      {imageUri ? (
        <ImageBackground
          source={{ uri: imageUri }}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          {/* Overlay for better text visibility */}
          <View style={styles.imageOverlay} />
          
          {/* Safe Area for Return Button */}
          <SafeAreaView style={styles.safeAreaTop} edges={['top']}>
            <View style={styles.topButtonContainer}>
              <IconButton
                name="chevron-back"
                onPress={() => router.back()}
                color="white"
                size={28}
              />
            </View>
          </SafeAreaView>
        </ImageBackground>
      ) : (
        <View style={[styles.imageBackground, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>No image available</Text>
          {/* Safe Area for Return Button (for placeholder) */}
          <SafeAreaView style={styles.safeAreaTop} edges={['top']}>
            <View style={[styles.topButtonContainer, styles.topButtonContainerDark]}>
              <IconButton
                name="chevron-back"
                onPress={() => router.back()}
                color="white"
                size={28}
              />
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* White Content Card (Scrollable) - Overlays on top of image */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {!imageUri ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No image found. Please try again.</Text>
          </View>
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5ECD8B" />
            <Text style={styles.loadingText}>Analyzing your meal...</Text>
          </View>
        ) : (
          apiData && (
            <>
              {/* A. Calories Card */}
              <View style={styles.caloriesCard}>
                <Text style={styles.caloriesTitle}>Calories</Text>
                <Text style={styles.caloriesValue}>{apiData.calories}</Text>
              </View>

              {/* B. Macros Grid (2x2) */}
              <View style={styles.macrosContainer}>
                {apiData.macros.map((macro, index) => (
                  <View key={index} style={styles.macroCardWrapper}>
                    <View style={styles.macroCard}>
                      <NutritionProgressCard
                        title={macro.title}
                        value={macro.value}
                        progress={macro.progress}
                        color={macro.color}
                      />
                    </View>
                  </View>
                ))}
              </View>

              {/* C. Food Items List */}
              {apiData.foodItems.map((item) => (
                <View key={item.id} style={styles.foodItemWrapper}>
                  <FoodItemCard title={item.title} details={item.details} />
                </View>
              ))}

              {/* D. Submit Button */}
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title="Add to My Diet"
                  onPress={handleAddToDiet}
                />
              </View>
            </>
          )
        )}
      </ScrollView>

      {/* Meal Selection Modal */}
      <Modal
        visible={showMealModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleCloseModal} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Meal</Text>
            <Text style={styles.modalSubtitle}>Choose which meal to add this food to:</Text>

            <View style={styles.mealOptionsContainer}>
              <TouchableOpacity
                style={styles.mealOption}
                onPress={() => handleSelectMeal('Breakfast')}
                activeOpacity={0.7}
              >
                <Text style={styles.mealOptionText}>Breakfast</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mealOption}
                onPress={() => handleSelectMeal('Lunch')}
                activeOpacity={0.7}
              >
                <Text style={styles.mealOptionText}>Lunch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mealOption}
                onPress={() => handleSelectMeal('Dinner')}
                activeOpacity={0.7}
              >
                <Text style={styles.mealOptionText}>Dinner</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mealOption}
                onPress={() => handleSelectMeal('Snack')}
                activeOpacity={0.7}
              >
                <Text style={styles.mealOptionText}>Snack</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  imagePlaceholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  safeAreaTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    marginLeft: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topButtonContainerDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '75%',
    minHeight: '50%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'gray',
  },
  caloriesCard: {
    backgroundColor: '#E8D5FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  caloriesTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  macrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  macroCard: {
    width: '100%',
    flex: 0,
  },
  foodItemWrapper: {
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  mealOptionsContainer: {
    marginBottom: 16,
  },
  mealOption: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  mealOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
