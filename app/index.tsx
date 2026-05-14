import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function RootIndex() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/explore" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
