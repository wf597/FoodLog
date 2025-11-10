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

// Mock data
const MOCK_DATA = {
  calories: '2,230 kcal',
  macros: [
    { title: 'Protein', value: '83%', progress: 0.83, color: '#28B446' },
    { title: 'Carbs', value: '50%', progress: 0.5, color: '#FCD269' },
    { title: 'Fat', value: '63%', progress: 0.63, color: '#FD8F6F' },
  ],
  foodItems: [
    {
      id: '1',
      title: 'Grilled Chicken Strips',
      details: '220 kcal | Protein: 30g | Carbs: 0g | Fat: 5g',
    },
    {
      id: '2',
      title: 'Naan Bread',
      details: '260 kcal | Protein: 7g | Carbs: 45g | Fat: 6g',
    },
    {
      id: '3',
      title: 'Sautéed Bell Peppers (Red & Yellow)',
      details: '50 kcal | Protein: 1g | Carbs: 12g | Fat: 0.3g',
    },
  ],
};

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export default function ScanResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<typeof MOCK_DATA | null>(null);
  const [showMealModal, setShowMealModal] = useState(false);

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setApiData(MOCK_DATA);
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleAddToDiet = () => {
    setShowMealModal(true);
  };

  const handleSelectMeal = (mealType: MealType) => {
    console.log(`Adding to ${mealType}`);
    setShowMealModal(false);
    
    // TODO: Implement adding food to the selected meal
    // Here you would typically:
    // 1. Save the food data to a state management system (e.g., Zustand, Redux, Context)
    // 2. Update the meal data for the selected meal type
    // 3. Navigate to the home page to show the updated meal
    
    // Show success message
    Alert.alert('Success', `Food added to ${mealType}!`);
    
    // Navigate to home page (index tab)
    // The correct approach in Expo Router:
    // Since ScanResultScreen is a Stack screen, we can use router.replace
    // to reset the navigation stack and go directly to the home tab
    // The path '/(tabs)' will navigate to tabs, which defaults to the index (home) tab
    setTimeout(() => {
      // Replace the navigation stack to go directly to home tab
      // This clears ScanResultScreen from history and navigates to home
      router.replace('/(tabs)' as any);
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

      {/* Background Image */}
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

      {/* White Content Card (Scrollable) */}
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
            <ActivityIndicator size="large" color="#28B446" />
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
    height: '40%',
    width: '100%',
    position: 'relative',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
    flex: 1,
    backgroundColor: 'white',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
