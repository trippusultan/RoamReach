import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.surface },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="setup-profile" />
    </Stack>
  );
}
