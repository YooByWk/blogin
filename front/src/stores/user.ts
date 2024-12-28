import { Account } from '@wepin/sdk-js';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface USERSTORE {
  username: string;
  accessToken: string;
  refreshToken: string;
  accounts: Account[];
  metaAddress: string;
  setMetaAddress: (newAddress: string) => void;
  setUsername: (username: string) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
}

const useUserStore = create(
  persist<USERSTORE>(
    (set) => ({
      username: '',
      accessToken: '',
      refreshToken: '',
      accounts: [],
      metaAddress: '',
      setMetaAddress: (newAddress) => {
        set((state) => ({ metaAddress: newAddress }));
      },
      setAccount: (accounts) => {
        set((state) => ({ accounts }));
      },
      setUsername: (newUsername) => {
        set((state) => ({ username: newUsername }));
      },
      setAccessToken: (newAccessToken) => {
        set((state) => ({ accessToken: newAccessToken }));
      },
      setRefreshToken: (newRefreshToken) => {
        set((state) => ({ refreshToken: newRefreshToken }));
      },

    }),
    {
      name: 'user-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지를 사용
    }
  )
);

export default useUserStore;
