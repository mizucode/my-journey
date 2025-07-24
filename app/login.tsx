import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { removeData } from "../utils/storage";

export default function Login() {
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const isTablet = screenWidth >= 600;

  const handleLogin = async () => {
    if (nama.trim() && kelas.trim()) {
      try {
        await login(nama.trim(), kelas.trim());
        setTimeout(() => {
          console.log("Login sukses, redirect ke /jawabarat");
          router.replace("/jawabarat");
        }, 100); // Delay 100ms agar context Auth sempat update
      } catch (error) {
        Alert.alert("Error", "Gagal melakukan login!");
        console.error(error);
      }
    } else {
      Alert.alert("Error", "Nama dan kelas harus diisi!");
    }
  };

  const handleBackToOnboarding = async () => {
    try {
      await removeData("onboardingCompleted");
      router.replace("/onboarding");
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground
        source={require("../assets/bg.png")}
        style={[styles.container, isTablet && styles.containerTablet]}
        resizeMode="cover"
      >
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <Image
            source={require("../assets/icon1.png")}
            style={[styles.logo, isTablet && styles.logoTablet]}
          />
          <Text style={styles.title}>MyJourney</Text>
          <Text style={styles.subtitle}>
            Game Based Learning Geografi Jawa Barat
          </Text>
        </View>

        <View style={[styles.form, isTablet && styles.formTablet]}>
          <Text style={styles.formTitle}>Masuk ke Petualangan</Text>

          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={nama}
            onChangeText={setNama}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#8B5C2A"
          />

          <Text style={styles.label}>Kelas</Text>
          <TextInput
            style={styles.input}
            value={kelas}
            onChangeText={setKelas}
            placeholder="Contoh: 5A, 6B"
            placeholderTextColor="#8B5C2A"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>🚀 Mulai Petualangan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToOnboarding}
          >
            <Text style={styles.backButtonText}>← Kembali ke Onboarding</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5C7B0",
    padding: 20,
    justifyContent: "center",
  },
  containerTablet: {
    padding: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerTablet: {
    marginBottom: 60,
  },
  logo: {
    width: 400,
    height: 110,
    marginBottom: 12,
  },
  logoTablet: {
    width: 420,
    height: 220,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontWeight: "500",
  },
  form: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#B66F45",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  formTablet: {
    padding: 48,
    borderRadius: 32,
    maxWidth: 500,
    alignSelf: "center",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#B66F45",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#B66F45",
  },
  input: {
    borderWidth: 2,
    borderColor: "#B66F45",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#E5C7B0",
    color: "#8B5C2A",
  },
  button: {
    backgroundColor: "#B66F45",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
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
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "#8B5C2A",
    fontSize: 14,
    fontWeight: "500",
  },
});
