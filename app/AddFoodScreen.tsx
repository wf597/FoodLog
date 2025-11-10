import FoodSearchItem from '@/components/FoodSearchItem';
import IconButton from '@/components/IconButton';
import SearchBar from '@/components/SearchBar';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// Test data for search
const searchResults = [
  { id: '1', title: 'Mango', subtitle: '133 Cal, 1 mango (208 g)', type: 'fruit' as const },
  { id: '2', title: 'Cheeseburger', subtitle: '553 Cal, 1 hamburger (211 g)', type: 'fastfood' as const },
  { id: '3', title: 'Apple', subtitle: '95 Cal, 1 medium apple (182 g)', type: 'fruit' as const },
  { id: '4', title: 'Pizza', subtitle: '285 Cal, 1 slice (107 g)', type: 'fastfood' as const },
];

// Type for food item
type FoodItem = {
  id: string;
  title: string;
  subtitle: string;
  type: 'fruit' | 'fastfood' | 'other';
};

export default function AddFoodScreen() {
  const [searchText, setSearchText] = useState('');
  const [mealFoods, setMealFoods] = useState<FoodItem[]>([]);

  // Extract calories from subtitle (e.g., "133 Cal, 1 mango (208 g)" -> 133)
  const extractCalories = (subtitle: string): number => {
    const match = subtitle.match(/(\d+)\s*Cal/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Calculate total calories from added foods
  const totalCalories = mealFoods.reduce((total, food) => {
    return total + extractCalories(food.subtitle);
  }, 0);

  const goalCalories = 456; // Daily goal for this meal

  // Handle adding food from search results
  const handleAddFood = (id: string) => {
    const foodToAdd = searchResults.find((item) => item.id === id);
    if (foodToAdd && !mealFoods.find((item) => item.id === id)) {
      setMealFoods((prev) => [...prev, foodToAdd]);
      setSearchText(''); // Clear search after adding
    }
  };

  // Handle removing food from meal
  const handleRemoveFood = (id: string) => {
    setMealFoods((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter search results based on search text
  const filteredSearchResults = searchText.trim()
    ? searchResults.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  // Determine which list to show
  const showSearchResults = searchText.trim().length > 0;
  const displayData = showSearchResults ? filteredSearchResults : mealFoods;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        {/* Custom Green Header Bar */}
        <View style={styles.headerBar}>
          {/* Left Section - Breakfast Info */}
          <View style={styles.breakfastInfo}>
            {/* Icon Placeholder */}
            <View style={styles.iconPlaceholder} />
            
            {/* Text Block */}
            <View style={styles.textBlock}>
              <Text style={styles.breakfastTitle}>Breakfast</Text>
              <Text style={styles.calories}>
                {totalCalories} / {goalCalories} Cal
              </Text>
            </View>
          </View>

          {/* Right Section - Close Button */}
          <IconButton
            name="close"
            size={24}
            color="#FFFFFF"
            onPress={() => router.back()}
          />
        </View>

        {/* White Content Card */}
        <View style={styles.contentCard}>
          {/* Search Bar with Camera Button */}
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search foods..."
          />

          {/* List: Search Results or Added Foods */}
          {displayData.length > 0 ? (
            <FlatList
              data={displayData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isInMeal = mealFoods.some((food) => food.id === item.id);
                return (
                  <FoodSearchItem
                    title={item.title}
                    subtitle={item.subtitle}
                    type={item.type}
                    isAdded={isInMeal}
                    onPressAdd={() => handleAddFood(item.id)}
                    onPressRemove={() => handleRemoveFood(item.id)}
                    showRemoveButton={!showSearchResults}
                  />
                );
              }}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={true}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {showSearchResults
                  ? 'No related foods found'
                  : 'No foods added yet\nUse the search bar or photo recognition to add foods'}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#28B446',
  },
  safeArea: {
    flex: 1,
  },
  headerBar: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakfastInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  textBlock: {
    marginLeft: 12,
  },
  breakfastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  calories: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  list: {
    marginTop: 16,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 24,
  },
});

