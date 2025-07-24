import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { kabupatenJabar } from '../../constants/kabupaten';
import { useAuth } from '../../context/AuthContext';

const GEMINI_API_KEY = 'AIzaSyCEATJTwE5tevT-RzhKgLXBxooR6NPBTC4';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface Soal {
  type: 'pilihan_ganda' | 'isian' | 'lengkapi_kalimat';
  pertanyaan: string;
  opsi: string[];
  jawaban: string | string[];
  penjelasan: string;
}

const TOPICS = [
  'sejarah', 'makanan khas', 'tempat wisata ikonik', 'fakta menarik', 'tarian daerah',
  'lagu daerah', 'pakaian adat', 'rumah adat', 'bahasa daerah', 'tokoh terkenal',
  'flora khas', 'fauna khas', 'perayaan adat', 'alat musik tradisional', 'geografi',
  'sungai dan danau', 'gunung dan pegunungan', 'hasil bumi', 'mata pencaharian',
  'transportasi tradisional', 'kerajinan tangan', 'permainan tradisional', 'simbol daerah',
  'kuliner unik', 'adat istiadat', 'festival daerah', 'cerita rakyat', 'olahraga tradisional',
  'kegiatan ekonomi'
];

const fetchAIQuestion = async (topic: string, kabupaten: string) => {
  const prompt = `
    Anda adalah AI pembuat kuis untuk anak SD tentang geografi di Jawa Barat.
    Buat satu pertanyaan tentang topik "${topic}" dari Kabupaten/Kota ${kabupaten}.
    Pertanyaan harus sesuai dengan topik dan kabupaten/kota yang diberikan.

    Secara acak, pilih salah satu format pertanyaan: 'isian', 'pilihan_ganda', atau 'lengkapi_kalimat'.

    Anda HARUS memberikan jawaban HANYA dalam format JSON yang valid, tanpa teks atau tanda \`\`\`json lain.
    Struktur JSON harus seperti ini:
    {
      "type": "isian" | "pilihan_ganda" | "lengkapi_kalimat",
      "pertanyaan": "Teks pertanyaan yang jelas. Untuk 'lengkapi_kalimat', gunakan '____' sebagai placeholder.",
      "opsi": ["Pilihan A", "Pilihan B", "Pilihan C"],
      "jawaban": "Jawaban benar (string)" atau ["Jawaban 1", "Jawaban 2"],
      "penjelasan": "Penjelasan singkat (2 kalimat) mengapa jawabannya benar, cocok untuk anak SD."
    }

    Aturan Penting:
    - Jika type "isian", 'jawaban' adalah string, 'opsi' adalah [].
    - Jika type "pilihan_ganda", 'jawaban' adalah string, 'opsi' berisi 3 pilihan termasuk jawaban benar.
    - Jika type "lengkapi_kalimat", 'jawaban' adalah ARRAY berisi string jawaban sesuai urutan placeholder '____'. 'opsi' adalah [].
    
    Sekarang, buatkan paket pertanyaannya.
  `;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });
    const data = await response.json();
    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } else {
      if (data.error?.message?.toLowerCase().includes('overloaded')) {
        throw new Error('Model sedang sibuk. Silakan coba beberapa saat lagi.');
      }
      throw new Error(data.error?.message || 'Gagal memproses respons dari AI.');
    }
  } catch (error) {
    console.error('Error fetching question package:', error);
    return {
      type: 'pilihan_ganda',
      pertanyaan: `Apa ibukota dari ${kabupaten}?`,
      opsi: ['Soreang', 'Bandung', 'Jakarta'],
      jawaban: 'Bandung',
      penjelasan: 'Bandung adalah ibukota Jawa Barat.',
    };
  }
};

export default function Quiz() {
  const { id } = useLocalSearchParams();
  const [soal, setSoal] = useState<Soal | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [skor, setSkor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ status: 'benar' | 'salah' | 'selesai'; penjelasan: string } | null>(null);
  const router = useRouter();
  const { user, updateScore, updateProgress, updateKabupatenScore, updateKabupatenScoreAndProgress, getTotalScore } = useAuth();

  const kabupaten = kabupatenJabar.find(k => k.id === Number(id));
  const QUESTIONS_PER_SESSION = 5;

  const fetchNewQuestion = async () => {
    if (!kabupaten) return;
    
    setLoading(true);
    setFeedback(null);
    setUserAnswers([]);
    setSoal(null);
    
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const q = await fetchAIQuestion(randomTopic, kabupaten.nama);
    
    setSoal(q);
    if (q.type === 'lengkapi_kalimat') {
      setUserAnswers(new Array((q.jawaban as string[]).length).fill(''));
    } else {
      setUserAnswers(['']);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNewQuestion();
  }, [kabupaten]);

  const handleAnswer = async (selectedAnswer?: string) => {
    if (!soal) return;
    
    let isCorrect = false;
    if (soal.type === 'pilihan_ganda') {
      isCorrect = (selectedAnswer || '').toLowerCase().trim() === (soal.jawaban as string).toLowerCase().trim();
    } else if (soal.type === 'isian') {
      isCorrect = (userAnswers[0] || '').toLowerCase().trim() === (soal.jawaban as string).toLowerCase().trim();
    } else if (soal.type === 'lengkapi_kalimat') {
      isCorrect = userAnswers.every(
        (ans, idx) => (ans || '').toLowerCase().trim() === ((soal.jawaban as string[])[idx] || '').toLowerCase().trim()
      );
    }
    
    const newTotal = step + 1;
    if (isCorrect) setSkor(prev => prev + 1);
    
    if (newTotal >= QUESTIONS_PER_SESSION) {
      // Quiz selesai, TAPI JANGAN simpan skor di sini untuk menghindari duplikasi.
      // Cukup set feedback 'selesai'. Penyimpanan akan dilakukan di handleNext.
      setFeedback({
        status: 'selesai',
        penjelasan: 'Kuis selesai! Hebat, kamu sudah menjawab semua pertanyaan.',
      });
    } else {
      setFeedback({ 
        status: isCorrect ? 'benar' : 'salah', 
        penjelasan: soal.penjelasan 
      });
    }
  };

  const handleNext = async () => {
    if (feedback?.status === 'selesai') {
      if (user) {
        // Cari index dari kabupaten saat ini untuk menghitung progres dengan benar.
        const currentIndex = kabupatenJabar.findIndex(k => k.id === Number(id));
        const newProgress = Math.max(user.progress, currentIndex + 1);
        
        // Update skor untuk kabupaten ini dan progress sekaligus
        await updateKabupatenScoreAndProgress(Number(id), skor, newProgress);
        
        // Tunggu sebentar untuk memastikan data tersimpan
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Gunakan getTotalScore untuk mendapatkan skor total yang akurat
        const totalSkor = getTotalScore();

        Alert.alert(
          'Quiz Selesai!',
          `Skor kamu: ${skor}/${QUESTIONS_PER_SESSION}\nSkor total: ${totalSkor}`,
          [
            {
              text: 'Kembali ke Home',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      }
      return;
    }
    
    setStep(prev => prev + 1);
    setFeedback(null);
    fetchNewQuestion();
  };

  const handleMultiInputChange = (text: string, idx: number) => {
    const newAns = [...userAnswers];
    newAns[idx] = text;
    setUserAnswers(newAns);
  };

  const renderCorrectAnswer = () => {
    if (!soal?.jawaban) return '';
    if (Array.isArray(soal.jawaban)) {
      return soal.jawaban.join(', ');
    }
    return soal.jawaban;
  };

  const STAR = '⭐';

  if (!kabupaten) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Kabupaten tidak ditemukan</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      {/* Dekorasi background sederhana */}
      <SafeAreaView style={styles.container}>
        {/* HEADER dihilangkan seluruhnya */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A1662F" />
                <Text style={styles.loadingText}>Memuat soal dari AI...</Text>
              </View>
            ) : (
              <>
                {soal && (
                  <Text style={styles.questionText}>
                    {soal.pertanyaan}
                  </Text>
                )}
                {/* Jawaban Section */}
                {soal && !feedback && soal.type === 'pilihan_ganda' && (
                  <View style={styles.optionsContainer}>
                    {soal.opsi.map((opsi, idx) => (
                      <View key={idx} style={styles.optionButton}>
                        <TouchableOpacity
                          style={{ width: '100%', alignItems: 'center' }}
                          onPress={() => handleAnswer(opsi)}
                          disabled={loading}>
                          <Text style={styles.optionText}>{String.fromCharCode(65 + idx)}. {opsi}</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                {soal && !feedback && soal.type === 'isian' && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ketik jawabanmu di sini"
                      value={userAnswers[0]}
                      onChangeText={(text) => setUserAnswers([text])}
                      editable={!loading}
                      placeholderTextColor="#a3a3a3"
                    />
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => handleAnswer(userAnswers[0])}
                      disabled={loading}>
                      <Text style={styles.submitButtonText}>Kirim Jawaban</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {soal && !feedback && soal.type === 'lengkapi_kalimat' && (
                  <View style={styles.inputContainer}>
                    {userAnswers.map((ans, idx) => (
                      <TextInput
                        key={idx}
                        style={styles.textInput}
                        placeholder={`Jawaban ke-${idx + 1}`}
                        value={ans}
                        onChangeText={(text) => handleMultiInputChange(text, idx)}
                        editable={!loading}
                        placeholderTextColor="#a3a3a3"
                      />
                    ))}
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => handleAnswer()}
                      disabled={loading}>
                      <Text style={styles.submitButtonText}>Kirim Jawaban</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {/* FEEDBACK */}
            {feedback && (
              <View
                style={[
                  styles.feedbackContainer,
                  feedback.status === 'benar' ? styles.feedbackCorrect :
                  feedback.status === 'salah' ? styles.feedbackWrong :
                  styles.feedbackFinish
                ]}>
                <Text style={styles.feedbackTitle}>
                  {feedback.status === 'benar' && 'Jawaban Benar!'}
                  {feedback.status === 'salah' && 'Jawaban Salah'}
                  {feedback.status === 'selesai' && 'KUIS SELESAI!'}
                </Text>
                {feedback.status !== 'selesai' && (
                  <Text style={styles.correctAnswerText}>
                    Jawaban yang benar: <Text style={styles.boldText}>{renderCorrectAnswer()}</Text>
                  </Text>
                )}
                <Text style={styles.explanationText}>{feedback.penjelasan}</Text>
                {feedback.status === 'selesai' && (
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>
                      Skor Kamu: {skor} / {QUESTIONS_PER_SESSION}
                    </Text>
                  </View>
                )}
                {feedback.status !== 'selesai' && (
                  <View style={{ alignSelf: 'stretch' }}>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                      <Text style={styles.nextButtonText}>Lanjut</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {feedback.status === 'selesai' && (
                  <View style={{ alignSelf: 'stretch' }}>
                    <TouchableOpacity style={styles.finishButton} onPress={handleNext}>
                      <Text style={styles.finishButtonText}>Selesai & Kembali</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1', // cream
    paddingBottom: 10,
  },
  header: {
    backgroundColor: '#A1662F', // coklat tua
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#BCAAA4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF8E1', // cream
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFDF7',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#D7CCC8', // coklat muda
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6D4C41', // coklat tua
    borderRadius: 6,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#A1662F',
    marginTop: 10,
    fontFamily: 'SpaceMono-Regular',
  },
  questionContainer: {
    backgroundColor: '#FFFDF7', // putih/cream terang
    borderRadius: 30,
    marginBottom: 20,
    padding: 30,
    shadowColor: '#BCAAA4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 5,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6D4C41', // coklat tua
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 25,
  },
  optionsContainer: {
    gap: 18,
  },
  optionButton: {
    backgroundColor: '#FFF8E1', // cream
    padding: 22,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#BCAAA4', // coklat muda
    alignItems: 'center',
    shadowColor: '#BCAAA4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  optionText: {
    fontSize: 20,
    color: '#6D4C41', // coklat tua
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#A1662F',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'SpaceMono-Regular',
  },
  inputContainer: {
    gap: 15,
    alignItems: 'stretch',
  },
  textInput: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#BCAAA4', // coklat muda
    borderRadius: 18,
    backgroundColor: '#FFF8E1', // cream
    color: '#6D4C41', // coklat tua
    fontSize: 18,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#A1662F', // coklat tua
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#A1662F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF8E1', // cream
  },
  feedbackContainer: {
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#BCAAA4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
  },
  feedbackCorrect: { backgroundColor: '#E8F5E9' }, // hijau pastel
  feedbackWrong: { backgroundColor: '#FFEBEE' }, // merah pastel
  feedbackFinish: { backgroundColor: '#D7CCC8' }, // coklat muda
  feedbackTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6D4C41', // coklat tua
    marginBottom: 15,
    textAlign: 'center',
  },
  correctAnswerText: {
    fontSize: 18,
    color: '#6D4C41', // coklat tua
    marginBottom: 12,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  explanationText: {
    fontSize: 17,
    color: '#6D4C41', // coklat tua
    textAlign: 'center',
    lineHeight: 24,
  },
  scoreContainer: {
    backgroundColor: 'rgba(214, 202, 200, 0.2)', // coklat muda transparan
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6D4C41', // coklat tua
  },
  nextButton: {
    backgroundColor: '#A1662F', // coklat tua
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 20,
    shadowColor: '#A1662F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF8E1', // cream
  },
  finishButton: {
    backgroundColor: '#A1662F', // coklat tua
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'stretch',
    shadowColor: '#A1662F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  finishButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF8E1', // cream
  },
});
