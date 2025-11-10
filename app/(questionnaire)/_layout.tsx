import { Stack, router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function QuestionnaireLayout() {
  return (
    <Stack
      screenOptions={{
        title: '', // 没有标题
        headerShadowVisible: false, // 没有阴影
        headerStyle: { backgroundColor: 'white' }, // 白色背景
        headerLeft: () => null, // 隐藏返回按钮
        headerRight: () => (
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
            <Text style={{ color: 'gray', fontSize: 16, marginRight: 10 }}>
              SKIP
            </Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
}

