import React, { createContext, useContext, useEffect, useState } from 'react';
import { getData, removeData, saveData } from '../utils/storage';

interface User {
  nama: string;
  kelas: string;
  skor: number;
  progress: number;
  skorPerKabupaten?: { [key: number]: number };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (nama: string, kelas: string) => Promise<void>;
  logout: () => Promise<void>;
  updateScore: (newScore: number) => Promise<void>;
  updateProgress: (newProgress: number) => Promise<void>;
  updateKabupatenScore: (kabupatenId: number, score: number) => Promise<void>;
  updateKabupatenScoreAndProgress: (kabupatenId: number, score: number, newProgress: number) => Promise<void>;
  getTotalScore: () => number;
  resetUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSkor, setTotalSkor] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getData('user');
      if (userData) {
        // Perbaiki data user jika skorPerKabupaten tidak ada
        if (!userData.skorPerKabupaten) {
          const fixedUser = { ...userData, skorPerKabupaten: {} };
          await saveData('user', fixedUser);
          setUser(fixedUser);
        } else if (Object.keys(userData.skorPerKabupaten).length === 0 && userData.skor > 0) {
          // Jika skorPerKabupaten kosong tapi ada skor, reset skor
          const fixedUser = { ...userData, skor: 0, skorPerKabupaten: {} };
          await saveData('user', fixedUser);
          setUser(fixedUser);
        } else {
          setUser(userData);
        }
        
        // Hitung total skor
        const totalSkor = Object.values(userData.skorPerKabupaten || {}).reduce((sum, skor) => sum + (skor || 0), 0);
        setTotalSkor(totalSkor);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (nama: string, kelas: string) => {
    const userData = { nama, kelas, skor: 0, progress: 0, skorPerKabupaten: {} };
    await saveData('user', userData);
    setUser(userData);
  };

  const logout = async () => {
    await removeData('user');
    setUser(null);
  };

  const updateScore = async (newScore: number) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        skor: newScore,
        skorPerKabupaten: user.skorPerKabupaten || {}
      };
      await saveData('user', updatedUser);
      setUser(updatedUser);
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (user) {
      // Pastikan mempertahankan semua data user termasuk skorPerKabupaten
      const updatedUser = { 
        ...user, 
        progress: newProgress,
        skorPerKabupaten: user.skorPerKabupaten || {}
      };
      await saveData('user', updatedUser);
      setUser(updatedUser);
    }
  };

  const updateKabupatenScore = async (kabupatenId: number, score: number) => {
    if (user) {
      const skorPerKabupaten = { ...user.skorPerKabupaten, [kabupatenId]: score };
      const totalSkor = Object.values(skorPerKabupaten).reduce((sum, skor) => sum + (skor || 0), 0);
      
      const updatedUser = { 
        ...user, 
        skorPerKabupaten,
        skor: totalSkor 
      };
      
      await saveData('user', updatedUser);
      setUser(updatedUser);
    }
  };

  // Fungsi baru untuk update skor dan progress sekaligus
  const updateKabupatenScoreAndProgress = async (kabupatenId: number, score: number, newProgress: number) => {
    if (user) {
      const skorPerKabupaten = { ...user.skorPerKabupaten, [kabupatenId]: score };
      const totalSkor = Object.values(skorPerKabupaten).reduce((sum, skor) => sum + (skor || 0), 0);
      
      const updatedUser = { 
        ...user, 
        skorPerKabupaten,
        skor: totalSkor,
        progress: newProgress
      };
      
      await saveData('user', updatedUser);
      setUser(updatedUser);
    }
  };

  const getTotalScore = () => {
    if (!user) return 0;
    if (!user.skorPerKabupaten || Object.keys(user.skorPerKabupaten).length === 0) return 0;
    // Hitung total dari semua skor kabupaten
    const total = Object.values(user.skorPerKabupaten).reduce((sum, skor) => sum + (skor || 0), 0);
    return total;
  };

  const resetUser = async () => {
    await logout();
    await loadUser();
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateScore,
    updateProgress,
    updateKabupatenScore,
    updateKabupatenScoreAndProgress,
    getTotalScore,
    resetUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 