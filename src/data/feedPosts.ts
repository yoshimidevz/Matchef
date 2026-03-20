export interface FeedComment {
  id: string;
  user: { name: string; avatar: string };
  text: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  user: { name: string; avatar: string };
  createdAt: string;
  // rating e difficulty agora são opcionais
  rating?: 1 | 2 | 3 | 4 | 5;
  difficulty?: "easy" | "medium" | "hard";
  linkedRecipe: { id: string; title: string; thumbnail: string };
  photoUrl: string;
  caption: string;
  likes: number;
  liked: boolean;
  comments: FeedComment[];
}

export const mockPosts: FeedPost[] = [
  {
    id: "1",
    user: { name: "Ana Clara", avatar: "" },
    createdAt: "2h atrás",
    rating: 5,
    difficulty: "easy",
    linkedRecipe: {
      id: "52772",
      title: "Teriyaki Chicken Casserole",
      thumbnail: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    },
    photoUrl: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    caption: "Ficou incrível! Adicionei um pouco de gengibre fresco e fez toda a diferença. 🍗✨",
    likes: 24,
    liked: false,
    comments: [
      { id: "c1", user: { name: "Pedro", avatar: "" }, text: "Que bonito! Vou tentar também 🤩", createdAt: "1h atrás" },
      { id: "c2", user: { name: "Maria", avatar: "" }, text: "Gengibre é um ótimo toque!", createdAt: "45min atrás" },
    ],
  },
  {
    id: "2",
    user: { name: "Lucas Oliveira", avatar: "" },
    createdAt: "5h atrás",
    rating: 2,
    difficulty: "hard",
    linkedRecipe: {
      id: "52771",
      title: "Spicy Arrabiata Penne",
      thumbnail: "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
    },
    photoUrl: "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
    caption: "Exagerei na pimenta... ficou impossível de comer 😅🌶️ Mas aprendi a lição!",
    likes: 18,
    liked: false,
    comments: [
      { id: "c3", user: { name: "Fernanda", avatar: "" }, text: "Hahaha acontece com todo mundo!", createdAt: "4h atrás" },
    ],
  },
  {
    id: "3",
    user: { name: "Juliana Costa", avatar: "" },
    createdAt: "1d atrás",
    rating: 5,
    difficulty: "medium",
    linkedRecipe: {
      id: "52773",
      title: "Honey Teriyaki Salmon",
      thumbnail: "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg",
    },
    photoUrl: "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg",
    caption: "Primeira vez fazendo salmão e estou orgulhosa! A receita do MatchChef é perfeita. 🐟💕",
    likes: 42,
    liked: false,
    comments: [],
  },
  {
    id: "4",
    user: { name: "Rafael Santos", avatar: "" },
    createdAt: "2d atrás",
    // sem rating nem difficulty — post livre
    linkedRecipe: {
      id: "52774",
      title: "Pad See Ew",
      thumbnail: "https://www.themealdb.com/images/media/meals/uuuspp1468263334.jpg",
    },
    photoUrl: "https://www.themealdb.com/images/media/meals/uuuspp1468263334.jpg",
    caption: "Pad See Ew caseiro! Nunca mais peço delivery 🍜",
    likes: 31,
    liked: false,
    comments: [
      { id: "c4", user: { name: "Thiago", avatar: "" }, text: "Receita salva! Vou fazer amanhã", createdAt: "1d atrás" },
    ],
  },
];