import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageBackground, ImageSourcePropType, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { saveData } from '../utils/storage';

interface OnboardingPage {
  title: string;
  description: string;
  icon: string | ImageSourcePropType;
}

const onboardingPages: OnboardingPage[] = [
  {
    title: 'PEMBELAJARAN\nILMU PENGETAHUAN ALAM DAN SOSIAL (IPAS)',
    description:
      'GAME BASED LEARNING GEN AI',
    icon: require('../assets/logojb.png'),
  },
  {
    title: 'BELAJAR BARENG AI',
    description:
      'Yuk, kita selami serunya IPAS, bahasa daerah, dan budaya Jawa Barat bareng AI pintar kita!',
    icon: require('../assets/robot.png'),
  },
  {
    title: 'AYO MULAI',
    description: 'Asyik! Tinggal klik tombol di bawah, dan petualangan seru kita langsung dimulai!',
    icon: require('../assets/peta.png'),
  },
];

const OnboardingScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Initial animation for the first icon
    Animated.spring(iconScaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const goToNextPage = () => {
    // 1. Animate current content out to the left
    Animated.timing(slideAnim, {
      toValue: -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // After current content slides out:
      setCurrentIndex((prevIndex) => prevIndex + 1);

      // Position new content off-screen to the right (without animation)
      slideAnim.setValue(screenWidth);
      iconScaleAnim.setValue(0.8);

      // 2. Animate new content in from the right and scale the icon
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleGetStarted = async () => {
    try {
      await saveData('onboardingCompleted', 'true');
      router.replace('/login');
    } catch (e) {
      router.replace('/login');
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={require('../assets/bg.png')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.container}>
          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            {onboardingPages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          {/* Content Area */}
          <View style={styles.contentContainer}>
            <Animated.View
              style={[
                styles.contentWrapper,
                { transform: [{ translateX: slideAnim }] }
              ]}>
              <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
                {typeof onboardingPages[currentIndex].icon === 'string' ? (
                  <Text style={styles.iconText}>
                    {onboardingPages[currentIndex].icon}
                  </Text>
                ) : (
                  <Image source={onboardingPages[currentIndex].icon} style={styles.logoImage} />
                )}
              </Animated.View>
              <Text style={styles.titleText}>
                {onboardingPages[currentIndex].title}
              </Text>
              <Text style={styles.descriptionText}>
                {onboardingPages[currentIndex].description}
              </Text>
            </Animated.View>
          </View>

          {/* Bottom Action Button */}
          <View style={styles.buttonContainer}>
            {currentIndex < onboardingPages.length - 1 ? (
              <TouchableOpacity
                style={styles.button}
                onPress={goToNextPage}>
                <Text style={styles.buttonText}>
                  LANJUT
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleGetStarted}>
                <Text style={styles.buttonText}>
                  MULAI PETUALANGAN!
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  progressDot: {
    marginHorizontal: 6,
    height: 10,
    width: 32,
    borderRadius: 5,
  },
  activeDot: {
    backgroundColor: '#8B5C2A',
  },
  inactiveDot: {
    backgroundColor: '#D2A679',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 96,
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 120,
    marginBottom: 48,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#B66F45',
    lineHeight: 26,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  button: {
    backgroundColor: '#8B5C2A',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#8B5C2A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  logoImage: {
    width: 240,
    height: 240,
    marginBottom: 48,
    resizeMode: 'contain',
  },
});

export default OnboardingScreen; 