import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { saveData } from "../utils/storage";

interface OnboardingPage {
  title: string;
  description: string;
  icon: ImageSourcePropType;
}

const onboardingPages: OnboardingPage[] = [
  {
    title: "PEMBELAJARAN\nILMU PENGETAHUAN ALAM DAN SOSIAL (IPAS)",
    description: "GAME BASED LEARNING GEN AI",
    icon: require("../assets/iconnew.png"),
  },
  {
    title: "BELAJAR BARENG AI",
    description:
      "Yuk, kita selami serunya IPAS, bahasa daerah, dan budaya Jawa Barat bareng AI pintar kita!",
    icon: require("../assets/robot2.png"),
  },
  {
    title: "AYO MULAI",
    description:
      "Asyik! Tinggal klik tombol di bawah, dan petualangan seru kita langsung dimulai!",
    icon: require("../assets/iconpencil.png"),
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.8)).current;

  const isTablet = width > 600;
  const isLandscape = width > height;
  const styles = getStyles({ isTablet, isLandscape, width, height });

  useEffect(() => {
    Animated.spring(iconScaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const goToNextPage = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      slideAnim.setValue(width);
      iconScaleAnim.setValue(0.8);
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
      await saveData("onboardingCompleted", "true");
      router.replace("/login");
    } catch (e) {
      router.replace("/login");
    }
  };

  const currentPage = onboardingPages[currentIndex];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground
        source={require("../assets/bg.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.contentWrapper,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
              <Image source={currentPage.icon} style={styles.logoImage} />
            </Animated.View>
            <Text style={styles.titleText}>{currentPage.title}</Text>
            <Text style={styles.descriptionText}>
              {currentPage.description}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex < onboardingPages.length - 1 ? (
            <TouchableOpacity style={styles.button} onPress={goToNextPage}>
              <Text style={styles.buttonText}>LANJUT</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
              <Text style={styles.buttonText}>MULAI PETUALANGAN!</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = ({ isTablet, isLandscape, width, height }) => {
  const imageSize = isTablet
    ? width * 0.3
    : isLandscape
    ? height * 0.5
    : width * 0.8;

  return StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "space-between",
    },
    progressContainer: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: isTablet ? 32 : 32,
      paddingTop: isTablet ? 8 : 50,
      marginTop: isTablet ? 0 : 20,
    },
    progressDot: {
      marginHorizontal: isTablet ? 12 : 6,
      height: isTablet ? 8 : 8,
      width: isTablet ? 40 : 28,
      borderRadius: isTablet ? 6 : 4,
    },
    activeDot: {
      backgroundColor: "#8B5C2A",
    },
    inactiveDot: {
      backgroundColor: "#D2A679",
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: isTablet ? 24 : 24,
      paddingVertical: 0,
    },
    contentWrapper: {
      width: "100%",
      alignItems: "center",
    },
    logoImage: {
      width: imageSize,
      height: imageSize,
      marginBottom: isTablet ? 0 : 24,
      resizeMode: "contain",
    },
    titleText: {
      textAlign: "center",
      fontSize: isTablet ? 26 : 26,
      fontWeight: "bold",
      color: "white",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: isTablet ? 24 : 16,
      maxWidth: "90%",
    },
    descriptionText: {
      textAlign: "center",
      fontSize: isTablet ? 24 : 16,
      fontWeight: "500",
      color: "#B66F45",
      lineHeight: isTablet ? 34 : 24,
      maxWidth: "95%",
    },
    buttonContainer: {
      width: "100%",
      paddingHorizontal: isTablet ? 64 : 24,
      paddingBottom: isTablet ? 60 : 40,
      paddingTop: 20,
    },
    button: {
      backgroundColor: "#8B5C2A",
      borderRadius: 16,
      paddingVertical: isTablet ? 10 : 16,
      shadowColor: "#8B5C2A",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    buttonText: {
      textAlign: "center",
      fontSize: isTablet ? 28 : 18,
      fontWeight: "bold",
      color: "white",
      letterSpacing: 1,
    },
  });
};

export default OnboardingScreen;
