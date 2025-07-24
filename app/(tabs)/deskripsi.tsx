import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { kabupatenJabar } from "../../constants/kabupaten";

export default function Deskripsi() {
  const { id, nama } = useLocalSearchParams();
  const router = useRouter();

  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeAllAnim = useRef(new Animated.Value(0)).current;

  const kabupaten = kabupatenJabar.find((k) => k.id === Number(id));

  const GEMINI_API_KEY = "AIzaSyCEATJTwE5tevT-RzhKgLXBxooR6NPBTC4";

  const fetchAIDescription = async (title: string) => {
    const prompt = `
      Anda adalah AI penjelas materi untuk anak SD tentang geografi di Jawa Barat.\n
      Buatkan deskripsi pembuka yang sangat lengkap, memuat seluruh rangkuman pengetahuan penting tentang kabupaten/kota ${title}.\n
      Deskripsi harus mencakup sejarah, geografi, budaya, makanan khas, tempat wisata, tokoh terkenal, flora-fauna, adat istiadat, dan fakta menarik lain yang relevan.\n
      Tulis dengan gaya ramah anak, mudah dipahami, dan memotivasi untuk belajar lebih lanjut.\n
      Panjang deskripsi maksimal 10 kata.\n
      Jawab HANYA dengan deskripsi, tanpa format JSON, tanpa kata pengantar, tanpa tanda kutip, dan tanpa kode apapun.\n  `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "text/plain" },
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  useEffect(() => {
    let isMounted = true;
    setDisplayedWords([]);
    setCurrentWordIndex(0);
    fadeAllAnim.setValue(0);
    setIsLoading(true);

    if (kabupaten) {
      fetchAIDescription(kabupaten.nama)
        .then((aiDesc) => {
          if (isMounted) {
            setGeneratedDescription(aiDesc);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setGeneratedDescription(
              `Di bagian ini kamu akan belajar hal seru tentang ${kabupaten.nama}! Kita akan menjelajahi sejarah, geografi, dan ada kuis menyenangkan di akhir. Ayo mulai petualangan! 🍪`
            );
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [kabupaten]);

  useEffect(() => {
    if (!isLoading && generatedDescription) {
      const words = generatedDescription.split(" ");
      let idx = 0;
      setDisplayedWords([]);
      setCurrentWordIndex(0);
      fadeAnim.setValue(1);
      fadeAllAnim.setValue(0);

      Animated.timing(fadeAllAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();

      const interval = setInterval(() => {
        if (idx < words.length) {
          setDisplayedWords((prev) => [...prev, words[idx]]);
          setCurrentWordIndex(idx);
          fadeAnim.setValue(0);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }).start();
          idx++;
        } else {
          clearInterval(interval);
        }
      }, 350);
      return () => clearInterval(interval);
    }
  }, [isLoading, generatedDescription]);

  const handleStartQuiz = () => {
    router.push({
      pathname: "/quiz/[id]",
      params: { id: id as string },
    });
  };

  if (!kabupaten) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFE4EC" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#AB47BC", fontFamily: "serif" }}>
            Kabupaten tidak ditemukan
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFE4EC" }}>
      {/* Pastel abstract decorations */}
      <Animatable.View
        animation="fadeIn"
        duration={900}
        style={{
          position: "absolute",
          right: 32,
          top: 40,
          height: 56,
          width: 56,
          borderRadius: 18,
          backgroundColor: "#B3E5FC", // pastel biru
          opacity: 0.22,
        }}
      />
      <Animatable.View
        animation="fadeIn"
        delay={400}
        duration={900}
        style={{
          position: "absolute",
          left: 24,
          top: 120,
          height: 32,
          width: 80,
          borderRadius: 12,
          backgroundColor: "#FFF9C4", // pastel kuning
          opacity: 0.18,
        }}
      />
      <Animatable.View
        animation="fadeIn"
        delay={700}
        duration={900}
        style={{
          position: "absolute",
          left: 60,
          top: 300,
          height: 36,
          width: 36,
          borderRadius: 18,
          backgroundColor: "#C8F7DC", // pastel hijau mint
          opacity: 0.18,
        }}
      />
      <Animatable.View
        animation="fadeIn"
        delay={1000}
        duration={900}
        style={{
          position: "absolute",
          right: 60,
          top: 200,
          height: 28,
          width: 60,
          borderRadius: 14,
          backgroundColor: "#E1BEE7", // pastel ungu
          opacity: 0.15,
        }}
      />

      <ScrollView
        style={{ flex: 1, padding: 20, paddingTop: 64 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Title with animation */}
        <Animatable.View animation="fadeInDown" duration={800}>
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="book"
                size={28}
                color="#AB47BC"
                style={{ marginRight: 8 }}
              />
              <Animatable.Text
                animation="bounceIn"
                delay={200}
                style={{
                  fontSize: 30,
                  fontWeight: "800",
                  color: "#7C4DFF",
                  fontFamily: "serif",
                  textShadowColor: "#B3E5FC",
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                {kabupaten.nama}
              </Animatable.Text>
            </View>
            <Animatable.View
              animation="fadeInLeft"
              delay={400}
              style={{
                marginTop: 8,
                height: 4,
                width: 64,
                borderRadius: 2,
                backgroundColor: "#F8BBD0", // pastel pink
                shadowColor: "#AB47BC",
                shadowOpacity: 0.3,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            />
          </View>
        </Animatable.View>

        {/* Content area */}
        {isLoading ? (
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 24,
              backgroundColor: "#FFF9C4", // pastel kuning
              padding: 32,
              borderWidth: 2,
              borderColor: "#B3E5FC", // pastel biru
              borderStyle: "dashed",
            }}
          >
            <ActivityIndicator size="large" color="#7C4DFF" />
            <Text
              style={{
                marginTop: 16,
                fontSize: 18,
                fontWeight: "600",
                color: "#7C4DFF",
                fontFamily: "serif",
              }}
            >
              Memuat Pengetahuan...
            </Text>
            <Text
              style={{
                marginTop: 8,
                color: "#26A69A", // pastel hijau mint
                fontFamily: "serif",
              }}
            >
              Tunggu sebentar ya! 🐻
            </Text>
          </Animatable.View>
        ) : (
          <Animatable.View
            animation="fadeInUp"
            duration={700}
            style={{
              opacity: fadeAllAnim,
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 20,
              minHeight: 200,
              borderWidth: 3,
              borderColor: "#B3E5FC", // pastel biru
              shadowColor: "#E1BEE7", // pastel ungu
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* Pastel abstract accent */}
            <View
              style={{
                position: "absolute",
                left: -12,
                top: -12,
                height: 18,
                width: 36,
                borderRadius: 8,
                backgroundColor: "#F8BBD0", // pastel pink
                transform: [{ rotate: "12deg" }],
                opacity: 0.18,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: -24,
                right: 32,
                height: 12,
                width: 32,
                borderRadius: 6,
                backgroundColor: "#E1BEE7", // pastel ungu
                transform: [{ rotate: "20deg" }],
                opacity: 0.15,
              }}
            />

            <View style={{ paddingBottom: 64 }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 32,
                  color: "#7C4DFF", // ungu pastel
                  fontFamily: "serif",
                  letterSpacing: 0.2,
                }}
              >
                {displayedWords.map((word, i) => {
                  if (
                    i === displayedWords.length - 1 &&
                    displayedWords.length <
                      generatedDescription.split(" ").length
                  ) {
                    return (
                      <Animatable.Text
                        key={i}
                        animation="fadeIn"
                        duration={350}
                        style={{ color: "#AB47BC" }}
                      >
                        {word + " "}
                      </Animatable.Text>
                    );
                  }
                  return word + " ";
                })}
                {displayedWords.length <
                generatedDescription.split(" ").length ? (
                  <Animatable.Text
                    animation="fadeIn"
                    iterationCount="infinite"
                    style={{ fontWeight: "800", color: "#26A69A" }}
                  >
                    |
                  </Animatable.Text>
                ) : (
                  <Text> </Text>
                )}
              </Text>
            </View>
          </Animatable.View>
        )}
      </ScrollView>

      {/* Continue button with animation */}
      {displayedWords.length === generatedDescription.split(" ").length &&
        !isLoading && (
          <Animatable.View
            animation="bounceInUp"
            duration={800}
            style={{
              position: "absolute",
              bottom: 32,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
            pointerEvents="box-none"
          >
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1800}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 50,
                  backgroundColor: "#7C4DFF", // ungu pastel
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  shadowColor: "#B3E5FC", // pastel biru
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 6,
                  borderWidth: 2,
                  borderColor: "#F8BBD0", // pastel pink
                }}
                onPress={handleStartQuiz}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "800",
                    letterSpacing: 0.5,
                    color: "#FFF",
                    fontFamily: "serif",
                    textShadowColor: "#B3E5FC",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 1,
                  }}
                >
                  Lanjutkan Petualangan
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color="#FFF"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>
        )}
    </SafeAreaView>
  );
}
