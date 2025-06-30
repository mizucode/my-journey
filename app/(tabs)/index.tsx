import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { kabupatenJabar } from '../../constants/kabupaten';
import { useAuth } from '../../context/AuthContext';

const CARD_GAP = 12;
const CARD_COLUMNS = 2;
const CARD_WIDTH = (Dimensions.get('window').width - 16 * 2 - CARD_GAP) / CARD_COLUMNS; // padding 16 kiri-kanan

export default function Home() {
  const { user, getTotalScore, logout } = useAuth();
  const router = useRouter();
  const [totalSkor, setTotalSkor] = useState(0);

  const brown = '#8B4513'; // Classic brown color
  const lightBrown = '#D2B48C'; // Tan color
  const cream = '#FFF8DC'; // Cream color
  const darkBrown = '#654321'; // Dark brown for text

  const refreshTotalSkor = useCallback(() => {
    if (user) {
      const skor = getTotalScore();
      setTotalSkor(skor);
    }
  }, [user, getTotalScore]);

  useEffect(() => {
    refreshTotalSkor();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      refreshTotalSkor();
    }, [refreshTotalSkor])
  );

  const handleKabupatenPress = (kabupaten: any, index: number) => {
    if (user && (user.progress || 0) >= index) {
      router.push({ 
        pathname: '/(tabs)/deskripsi', 
        params: { 
          id: kabupaten.id,
          nama: kabupaten.nama 
        } 
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const renderKabupatenCard = ({ item, index }: { item: any, index: number }) => {
    const unlocked = user && index <= (user.progress || 0);
    const isBandungBarat = item.nama === 'Bandung Barat';
    const isKuningan = item.nama === 'Kuningan';
    const isCirebon = item.nama === 'Cirebon';
    const isMajalengka = item.nama === 'Majalengka';
    const isIndramayu = item.nama === 'Indramayu';
    const isBandung = item.nama === 'Bandung';

    const getLogo = () => {
      if (isBandungBarat) {
        return require('../../assets/logobdb.png');
      }
      if (isKuningan) {
        return require('../../assets/logokng.png');
      }
      if (isCirebon) {
        return require('../../assets/logocrb.png');
      }
      if (isMajalengka) {
        return require('../../assets/logomjk.png');
      }
      if (isIndramayu) {
        return require('../../assets/logoind.png');
      }
      if (isBandung) {
        return require('../../assets/logobdg.png');
      }
      return require('../../assets/logojb.png');
    }

    return (
      <TouchableOpacity
        style={[styles.card, unlocked ? styles.unlockedCard : styles.lockedCard]}
        onPress={() => handleKabupatenPress(item, index)}
        disabled={!unlocked}
      >
        <View style={styles.cardContent}>
          <Image
            source={getLogo()}
            style={{ width: 48, height: 48, marginBottom: 12 }}
            resizeMode="contain"
          />
          <Text style={[styles.cardTitle, !unlocked && styles.lockedText]}>
            {item.nama}
          </Text>
          {!unlocked && (
            <Text style={styles.lockText}>Level belum terbuka</Text>
          )}
          {unlocked && (
            <Text style={styles.unlockText}>Ayo main! 🐻</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const styles = React.useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cream,
    },
    container: {
      flex: 1,
      backgroundColor: cream,
      padding: 16,
      paddingTop: 8,
    },
    header: {
      backgroundColor: lightBrown,
      padding: 20,
      borderRadius: 20,
      marginBottom: 20,
      shadowColor: darkBrown,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 2,
      borderColor: brown,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    userInfo: {
      flex: 1,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: darkBrown,
      marginBottom: 4,
      fontFamily: 'Arial Rounded MT Bold',
    },
    classText: {
      fontSize: 16,
      color: darkBrown,
      fontWeight: '500',
      fontFamily: 'Arial Rounded MT Bold',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: cream,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: brown,
    },
    statEmoji: {
      fontSize: 24,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: darkBrown,
      fontWeight: '600',
      marginBottom: 4,
      fontFamily: 'Arial Rounded MT Bold',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: darkBrown,
      fontFamily: 'Arial Rounded MT Bold',
    },
    titleContainer: {
      marginBottom: 20,
      backgroundColor: lightBrown,
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: brown,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: darkBrown,
      marginBottom: 4,
      fontFamily: 'Arial Rounded MT Bold',
    },
    subtitle: {
      fontSize: 14,
      color: darkBrown,
      fontStyle: 'italic',
      fontFamily: 'Arial Rounded MT Bold',
    },
    listContainer: {
      paddingBottom: 20,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    card: {
      width: '100%',
      minHeight: 160,
      borderRadius: 20,
      padding: 20,
      shadowColor: darkBrown,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 2,
    },
    unlockedCard: {
      backgroundColor: '#F5DEB3', // Wheat color
      borderColor: brown,
    },
    lockedCard: {
      backgroundColor: '#E6D5B8', // Light tan
      borderColor: '#A9A9A9',
    },
    cardContent: {
      alignItems: 'center',
    },
    emojiIcon: {
      fontSize: 32,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: darkBrown,
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: 'Arial Rounded MT Bold',
    },
    lockedText: {
      color: '#696969',
    },
    lockText: {
      fontSize: 12,
      color: '#696969',
      fontWeight: '500',
      fontFamily: 'Arial Rounded MT Bold',
    },
    unlockText: {
      fontSize: 12,
      color: darkBrown,
      fontWeight: 'bold',
      fontFamily: 'Arial Rounded MT Bold',
    },
    logoutButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: cream,
      alignSelf: 'flex-start',
      marginLeft: 12,
      borderWidth: 2,
      borderColor: brown,
    },
    cardRowWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: CARD_GAP,
    },
    cardRowItem: {
      width: CARD_WIDTH,
      marginBottom: CARD_GAP,
    },
  }), []);

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" style="dark" />
      <Animatable.View animation="fadeInDown" duration={800} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Animatable.View animation="fadeIn" duration={900} style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.userInfo}>
                <Animatable.Text animation="fadeInLeft" delay={200} style={styles.welcomeText}>
                  Halo, {user.nama}!
                </Animatable.Text>
                <Animatable.Text animation="fadeInLeft" delay={400} style={styles.classText}>Kelas: {user.kelas}</Animatable.Text>
              </View>
              <Animatable.View animation="bounceIn" delay={500}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                  <Ionicons name="log-out-outline" size={24} color={darkBrown} />
                </TouchableOpacity>
              </Animatable.View>
            </View>
            <Animatable.View animation="fadeInUp" delay={300} style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🏆️</Text>
                <Text style={styles.statLabel}>Total Skor</Text>
                <Text style={styles.statValue}>{totalSkor}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🏅</Text>
                <Text style={styles.statLabel}>Progress</Text>
                <Text style={styles.statValue}>{user.progress || 0}/{kabupatenJabar.length}</Text>
              </View>
            </Animatable.View>
          </Animatable.View>
          <Animatable.View animation="fadeInLeft" delay={600} style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Mengenal Kabupaten Jawa Barat</Text>
            <Text style={styles.subtitle}>Jelajahi setiap kabupaten!</Text>
          </Animatable.View>
          <Animatable.View animation="fadeIn" duration={700}>
            <View style={styles.cardRowWrap}>
              {kabupatenJabar.map((item, index) => (
                <View key={item.id} style={styles.cardRowItem}>
                  {renderKabupatenCard({ item, index })}
                </View>
              ))}
            </View>
          </Animatable.View>
        </ScrollView>
      </Animatable.View>
    </SafeAreaView>
  );
}