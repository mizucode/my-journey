import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function JawaBarat() {
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const isTablet = width >= 768;
  return (
    <View style={[styles.container, { padding: isTablet ? 48 : 24 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#E5C7B0" />
      <Image
        source={require("../assets/logojb.png")}
        style={[
          styles.imageLogo,
          {
            width: isTablet ? 220 : 140,
            height: isTablet ? 220 : 140,
            borderRadius: isTablet ? 110 : 70,
            marginBottom: isTablet ? 32 : 20,
          },
        ]}
        resizeMode="contain"
      />
      <Text
        style={[
          styles.title,
          { fontSize: isTablet ? 48 : 32, marginBottom: isTablet ? 24 : 16 },
        ]}
      >
        Jawa Barat
      </Text>
      <Text
        style={[
          styles.desc,
          { fontSize: isTablet ? 26 : 18, marginBottom: isTablet ? 48 : 32 },
        ]}
      >
        Jawa Barat adalah sebuah provinsi di Indonesia yang terletak di bagian
        barat Pulau Jawa. Provinsi ini terkenal dengan keindahan alam, budaya
        yang kaya, dan masyarakat yang ramah. Ibukotanya adalah Bandung.
      </Text>
      <Image
        source={require("../assets/peta.png")}
        style={[
          styles.image,
          {
            width: isTablet ? 400 : 240,
            height: isTablet ? 300 : 180,
            marginBottom: isTablet ? 36 : 24,
            borderRadius: isTablet ? 24 : 16,
          },
        ]}
        resizeMode="contain"
      />
      <TouchableOpacity
        style={[
          styles.button,
          {
            paddingVertical: isTablet ? 24 : 16,
            paddingHorizontal: isTablet ? 56 : 32,
            borderRadius: isTablet ? 18 : 12,
            marginTop: isTablet ? 32 : 16,
          },
        ]}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={[styles.buttonText, { fontSize: isTablet ? 26 : 18 }]}>
          Menu Utama
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5C7B0",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#B66F45",
    marginBottom: 16,
    textAlign: "center",
  },
  desc: {
    fontSize: 18,
    color: "#8B5C2A",
    textAlign: "center",
    marginBottom: 32,
  },
  image: {
    width: 240,
    height: 180,
    marginBottom: 24,
    borderRadius: 16,
    padding: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5C7B0",
  },
  imageLogo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    borderRadius: 70,
    padding: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5C7B0",
  },
  button: {
    backgroundColor: "#B66F45",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
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
});
