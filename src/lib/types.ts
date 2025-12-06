export type Stat = {
  label: string;
  value: string | number;
};

export type Profile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  image: string;
  dataAiHint: string;
  stats: Stat[];
  isRecruiter: boolean;
  isEditable?: boolean;
  isVIP?: boolean;
};

export type Message = {
  id: string;
  text: string;
  senderId: string; // 'user' or profile.id
  timestamp: number;
};

export type Chat = {
  id: string;
  profileId: string;
  messages: Message[];
};
