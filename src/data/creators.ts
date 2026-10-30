export interface ReviewItem {
  id: string;
  author: string;
  initial: string;
  avatarBg: string;
  verifiedType: 'Verified Call' | 'Verified Room Chat';
  rating: number;
  timeAgo: string;
  likes: number;
  content: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  age: number;
  isLive: boolean;
  isOnline: boolean;
  rating: number;
  reviewsCount: string;
  viewsCount: string;
  verified: boolean;
  statusMessage: string;
  avatarUrl: string;
  streamPreviewUrl: string;
  vaultPhotos: string[];
  location: string;
  bio: string;
  languages: string[];
  hobbies: string[];
  followers: string;
  callMinutes: string;
}

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: '1',
    author: 'Alex M.',
    initial: 'A',
    avatarBg: 'bg-[#f43f5e]',
    verifiedType: 'Verified Call',
    rating: 5,
    timeAgo: '2 hours ago',
    likes: 42,
    content: 'She answered within 5 seconds! Olivia is so warm and engaging, best 1-on-1 video call experience ever.'
  },
  {
    id: '2',
    author: 'Marcus T.',
    initial: 'M',
    avatarBg: 'bg-[#8b5cf6]',
    verifiedType: 'Verified Room Chat',
    rating: 5,
    timeAgo: '4 hours ago',
    likes: 28,
    content: 'The private room chat felt so personal and genuine. She replies super fast and shares cute voice notes!'
  },
  {
    id: '3',
    author: 'David K.',
    initial: 'D',
    avatarBg: 'bg-[#06b6d4]',
    verifiedType: 'Verified Call',
    rating: 5,
    timeAgo: 'Yesterday',
    likes: 19,
    content: 'Voice call connection was crystal clear. We talked about travel and music for over 40 minutes.'
  },
  {
    id: '4',
    author: 'James L.',
    initial: 'J',
    avatarBg: 'bg-[#f59e0b]',
    verifiedType: 'Verified Call',
    rating: 5,
    timeAgo: '2 days ago',
    likes: 31,
    content: 'Olivia is an absolute sweetheart. 10/10 recommend checking out her live room stream!'
  }
];

export const INITIAL_CREATORS: CreatorProfile[] = [
  {
    id: 'olivia',
    name: 'Olivia Love',
    age: 22,
    isLive: true,
    isOnline: true,
    rating: 4.9,
    reviewsCount: '1842',
    viewsCount: '2.4k',
    verified: true,
    statusMessage: "Available for private video calls & chat right now! Let's talk 🔥",
    avatarUrl: '/assets/aistudio/Messenger_creation_D8C1E161-F020-4D1B-A11B-5F980346E31C_e72a518f.jpeg',
    streamPreviewUrl: '/assets/aistudio/Messenger_creation_D8C1E161-F020-4D1B-A11B-5F980346E31C_e72a518f.jpeg',
    vaultPhotos: [
      '/assets/aistudio/Messenger_creation_D8C1E161-F020-4D1B-A11B-5F980346E31C_e72a518f.jpeg',
      '/src/assets/images/sofia_vault_1_1793378101431.jpg',
      '/src/assets/images/sofia_vault_2_1793378099932.jpg',
      '/assets/aistudio/Messenger_creation_D8C1E161-F020-4D1B-A11B-5F980346E31C_e72a518f.jpeg',
    ],
    location: 'Miami, Florida',
    bio: 'Hey there! ✨ Content creator, model & dancer. I love deep 1-on-1 conversations, late night calls and sharing exclusive moments with my fans!',
    languages: ['English', 'Spanish', 'Italian'],
    hobbies: ['Dancing', 'Travel', 'Fashion', 'Beach walks'],
    followers: '148.5k',
    callMinutes: '4,200+'
  },
  {
    id: 'elena',
    name: 'Elena',
    age: 23,
    isLive: true,
    isOnline: true,
    rating: 4.8,
    reviewsCount: '1240',
    viewsCount: '3.1k',
    verified: true,
    statusMessage: 'Coffee time & chill vibes. Join my live room to say hi! ☕✨',
    avatarUrl: '/src/assets/images/elena_avatar_1793377654724.jpg',
    streamPreviewUrl: '/src/assets/images/elena_avatar_1793377654724.jpg',
    vaultPhotos: [
      '/src/assets/images/elena_avatar_1793377654724.jpg',
    ],
    location: 'Los Angeles, CA',
    bio: 'Acoustic singer & digital artist. Excited for friendly chats and acoustic song requests on cam!',
    languages: ['English', 'Spanish'],
    hobbies: ['Acoustic Guitar', 'Art', 'Coffee'],
    followers: '92.3k',
    callMinutes: '2,900+'
  },
  {
    id: 'chloe',
    name: 'Chloe',
    age: 21,
    isLive: false,
    isOnline: true,
    rating: 4.9,
    reviewsCount: '2150',
    viewsCount: '1.9k',
    verified: true,
    statusMessage: 'Online and free for instant messaging or direct audio connection 💫',
    avatarUrl: '/src/assets/images/chloe_avatar_1793377654954.jpg',
    streamPreviewUrl: '/src/assets/images/chloe_avatar_1793377654954.jpg',
    vaultPhotos: [
      '/src/assets/images/chloe_avatar_1793377654954.jpg',
    ],
    location: 'London, UK',
    bio: 'Psychology student & fitness lover. Always up for real conversations and late night talks.',
    languages: ['English', 'French'],
    hobbies: ['Fitness', 'Reading', 'Travel'],
    followers: '210.1k',
    callMinutes: '5,600+'
  }
];
