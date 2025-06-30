import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JawaBarat() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E5C7B0" />
      <Text style={styles.title}>Jawa Barat</Text>
      <Text style={styles.desc}>
        Jawa Barat adalah sebuah provinsi di Indonesia yang terletak di bagian barat Pulau Jawa. Provinsi ini terkenal dengan keindahan alam, budaya yang kaya, dan masyarakat yang ramah. Ibukotanya adalah Bandung.
      </Text>
      <Image source={require('../assets/peta.png')} style={styles.image} resizeMode="contain" />
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>Menu Utama</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5C7B0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B66F45',
    marginBottom: 16,
    textAlign: 'center',
  },
  desc: {
    fontSize: 18,
    color: '#8B5C2A',
    textAlign: 'center',
    marginBottom: 32,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#B66F45',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
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
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 