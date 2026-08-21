import { HomeScreen } from '@/components/screens/home-screen';
import { useProgress } from '@/hooks/use-progress';
import { Redirect } from 'expo-router';

export default function HomeRoute() {
  const {progress,isHydrated}=useProgress();
  if(isHydrated&&!progress.onboardingCompleto)return <Redirect href="/onboarding"/>;
  return <HomeScreen />;
}
