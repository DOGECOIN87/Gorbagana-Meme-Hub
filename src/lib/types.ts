
export type Stat = {
  label: string;
  value: string | number;
};

export type ProfileLink = {
    label: string;
    url: string;
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
  links?: ProfileLink[];
};

export type Message = {
  id: string;
  text: string;
  senderId: string; // 'user-profile-01' or profile.id
  timestamp: number;
};

export type Chat = {
  id: string;
  participants: string[];
  messages: Message[];
};
