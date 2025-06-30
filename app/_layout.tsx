import { Audio } from 'expo-av';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { getData } from '../utils/storage';

const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const status = await getData('onboardingCompleted');
      setOnboardingCompleted(status === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setOnboardingCompleted(false);
    }
  };

  useEffect(() => {
    if (segments[0] === 'login' || segments[0] === 'onboarding') {
      checkOnboardingStatus();
    }
  }, [segments]);

  useEffect(() => {
    if (isLoading || onboardingCompleted === null) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const inQuizGroup = segments[0] === 'quiz';
    const inOnboarding = segments[0] === 'onboarding';
    const inLogin = segments[0] === 'login';
    const inJawaBarat = segments[0] === 'jawabarat';

    if (!onboardingCompleted && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    if (onboardingCompleted && !user && !inLogin) {
      router.replace('/login');
      return;
    }

    if (user && !inTabsGroup && !inQuizGroup && !inJawaBarat) {
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, onboardingCompleted, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  useEffect(() => {
    let sound: Audio.Sound;
    (async () => {
      sound = new Audio.Sound();
      await sound.loadAsync(require('../assets/music/theme.mp3'));
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
    })();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}