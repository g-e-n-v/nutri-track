import { atom, useAtom } from "jotai";

type User = {
  id: number;
  email: string;
  name: string;
  avatar: string;
  role: string;
  gender: string;
  accountType: string;
  height: number;
  dob: string;
  guid: string;
  createdAt: string;
  updatedAt: string;
};

const userAtom = atom<User | null>(null);

export const useUserStore = () => useAtom(userAtom);
