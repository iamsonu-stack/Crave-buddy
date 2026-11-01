import { useEffect, useMemo, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Clock,
  X,
  CheckCircle2,
  UtensilsCrossed,
  ArrowLeft,
} from "lucide-react";
import "./App.css";
import LoginPage, { type AuthUser } from "./LoginPage";
import { API_BASE_URL } from "./api";

type Food = {
  id: number;
  name: string;
  restaurant: string;
  category: string;
  price: number;
  rating: number;
  time: number;
  emoji: string;
  image: string;
  tag: string;
};

type CartItem = {
  food: Food;
  quantity: number;
};

type RestaurantChoice = {
  restaurant: string;
  price: number;
  rating: number;
  time: number;
};

type ThaliDish = {
  key: string;
  name: string;
  emoji: string;
  image: string;
  choices: RestaurantChoice[];
};

const foods: Food[] = [
  {
    id: 1,
    name: "Pizza",
    restaurant: "PIZZA HUB",
    category: "Fast Food",
    price: 149,
    rating: 4.7,
    time: 25,
    emoji: "",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY_OvyIU-bYODsU_KE4b5BUkzTOPx-AohpSIfmVQlXDEq8Yot_OmgCbewW&s=10",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Paneer Tikka Wrap",
    restaurant: "Urban Eats",
    category: "Wraps",
    price: 129,
    rating: 4.5,
    time: 20,
    emoji: "🌯",
    image: "https://spicecravings.com/wp-content/uploads/2020/12/Paneer-kathi-Roll-Featured-1.jpg",
    tag: "Veg",
  },
  {
    id: 3,
    name: "Aloo Pratha",
    restaurant: "Punjabi Dhaba",
    category: "Healthy",
    price: 60,
    rating: 4.8,
    time: 20,
    emoji: "🥗",
    image: "https://i0.wp.com/smithakalluraya.com/wp-content/uploads/2015/02/image.1024x1024-95.jpg?resize=720%2C972&ssl=1",
    tag: "Popular",
  },
  {
    id: 4,
    name: "Veg Thali",
    restaurant: "Spice Route",
    category: "Thali",
    price: 199,
    rating: 4.6,
    time: 30,
    emoji: "🍱",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85",
    tag: "Veg",
  },
  {
    id: 5,
    name: "Paneer Butter Masala",
    restaurant: "Punjabi Junction",
    category: "North Indian",
    price: 229,
    rating: 4.8,
    time: 30,
    emoji: "🍛",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=85",
    tag: "Bestseller",
  },
  {
    id: 6,
    name: "Hyderabadi Biryani",
    restaurant: "Deccan Dum House",
    category: "Biryani",
    price: 219,
    rating: 4.8,
    time: 30,
    emoji: "",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScn2ZJQAPGyo11tMu9hnxwy6JTWNgpF_a-lKOcx2actg&s=10",
    tag: "Popular",
  },
  {
    id: 7,
    name: "Chicken Dum Biryani",
    restaurant: "Royal Biryani",
    category: "Biryani",
    price: 249,
    rating: 4.9,
    time: 35,
    emoji: "🍗",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=85",
    tag: "Bestseller",
  },
  {
    id: 8,
    name: "Masala Dosa",
    restaurant: "South Spice",
    category: "South Indian",
    price: 119,
    rating: 4.7,
    time: 25,
    emoji: "🥞",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2020/05/Masala-Dosa.jpg",
    tag: "Veg",
  },
  {
    id: 9,
    name: "Idli Sambar",
    restaurant: "Madras Cafe",
    category: "South Indian",
    price: 89,
    rating: 4.6,
    time: 15,
    emoji: "🥘",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=85",
    tag: "Veg",
  },
  {
    id: 10,
    name: "Chole Bhature",
    restaurant: "Delhi Darbar",
    category: "North Indian",
    price: 139,
    rating: 4.7,
    time: 25,
    emoji: "🫓",
    image: "https://static.toiimg.com/thumb/53314156.cms?imgsize=1762111&width=800&height=800",
    tag: "Popular",
  },
  {
    id: 11,
    name: "Dal Makhani & Naan",
    restaurant: "Punjabi Tadka",
    category: "North Indian",
    price: 189,
    rating: 4.6,
    time: 25,
    emoji: "🫓",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-wkBIZhV0TaKaSkLnUeM9wasaQJbAfNxwTXeaktGxmQ5kvpzTypu7mfAh&s=10",
    tag: "Veg",
  },
  {
    id: 12,
    name: "Samosa Chaat",
    restaurant: "Chaat Junction",
    category: "Street Food",
    price: 79,
    rating: 4.5,
    time: 15,
    emoji: "🥙",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85",
    tag: "Popular",
  },
  {
    id: 13,
    name: "Pani Puri",
    restaurant: "Mumbai Chaat House",
    category: "Street Food",
    price: 69,
    rating: 4.4,
    time: 15,
    emoji: "🥣",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4y6JRB7XnsbqF-Qx2iY9AaYUNpSClO4YhyFs9Bz6LHg&s=10",
    tag: "Street Favourite",
  },
  {
    id: 14,
    name: "Hakka Noodles",
    restaurant: "Dragon Wok",
    category: "Chinese",
    price: 149,
    rating: 4.5,
    time: 20,
    emoji: "🍜",
    image: "https://img-cdn.publive.online/fit-in/1200x675/sanjeev-kapoor/media/media_files/2025/05/27/cZgoTRr3ss58dN9CBZzy.JPG",
    tag: "Popular",
  },
  {
    id: 15,
    name: "Veg Momos",
    restaurant: "Momo Street",
    category: "Chinese",
    price: 99,
    rating: 4.5,
    time: 20,
    emoji: "🥟",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85",
    tag: "Veg",
  },
  {
    id: 16,
    name: "Schezwan Fried Rice",
    restaurant: "Wok Express",
    category: "Chinese",
    price: 159,
    rating: 4.4,
    time: 20,
    emoji: "🍚",
    image: "https://cdn2.foodviva.com/static-content/food-images/chinese-recipes/schezwan-fried-rice/schezwan-fried-rice.jpg",
    tag: "Spicy",
  },
  {
    id: 17,
    name: "Margherita Pizza",
    restaurant: "Pizza Corner",
    category: "Italian",
    price: 199,
    rating: 4.6,
    time: 25,
    emoji: "🍕",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
    tag: "Veg",
  },
  {
    id: 18,
    name: "Creamy Alfredo Pasta",
    restaurant: "Little Italy",
    category: "Italian",
    price: 219,
    rating: 4.7,
    time: 25,
    emoji: "🍝",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIS3Z7j1g8gTFmPz0-wvsEfQHANkQk5e-YEGk54MgIcXrFY8Z_5LXMw_9T&s=10",
    tag: "Popular",
  },
  {
    id: 19,
    name: "Classic Cheese Burger",
    restaurant: "Burger Street",
    category: "Fast Food",
    price: 149,
    rating: 4.5,
    time: 20,
    emoji: "🍔",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
    tag: "Bestseller",
  },
  {
    id: 20,
    name: "Crispy French Fries",
    restaurant: "Fry Station",
    category: "Snacks",
    price: 89,
    rating: 4.4,
    time: 15,
    emoji: "🍟",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",
    tag: "Popular",
  },
  {
    id: 21,
    name: "Sushi Platter",
    restaurant: "Tokyo Bites",
    category: "Japanese",
    price: 329,
    rating: 4.7,
    time: 30,
    emoji: "🍣",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=85",
    tag: "Chef's Pick",
  },
  {
    id: 22,
    name: "Club Sandwich",
    restaurant: "Cafe Central",
    category: "Snacks",
    price: 129,
    rating: 4.4,
    time: 15,
    emoji: "🥪",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=85",
    tag: "Quick Bite",
  },
  {
    id: 23,
    name: "Chocolate Cake",
    restaurant: "Sweet Studio",
    category: "Desserts",
    price: 119,
    rating: 4.8,
    time: 15,
    emoji: "🍰",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85",
    tag: "Sweet Treat",
  },
  {
    id: 24,
    name: "Gulab Jamun",
    restaurant: "Indian Mithai House",
    category: "Desserts",
    price: 79,
    rating: 4.8,
    time: 10,
    emoji: "🍮",
    image: "https://sinfullyspicy.com/wp-content/uploads/2011/07/1200-by-1200-images-2.jpg",
    tag: "Traditional",
  },
  {
    id: 25,
    name: "Mango Shake",
    restaurant: "Shake Lab",
    category: "Drinks",
    price: 99,
    rating: 4.6,
    time: 10,
    emoji: "🥭",
    image: "https://www.funfoodfrolic.com/wp-content/uploads/2021/05/Mango-Shake-1.jpg",
    tag: "Refreshing",
  },
  {
    id: 26,
    name: "Cold Coffee",
    restaurant: "Cafe Central",
    category: "Drinks",
    price: 109,
    rating: 4.6,
    time: 10,
    emoji: "☕",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85",
    tag: "Cafe Favourite",
  },
  {
    id: 27,
    name: "Strawberry Ice Cream",
    restaurant: "Scoops & Smiles",
    category: "Desserts",
    price: 89,
    rating: 4.5,
    time: 10,
    emoji: "🍨",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=85",
    tag: "Sweet Treat",
  },
  {
    id: 28,
    name: "Tacos Fiesta",
    restaurant: "Mexican Street",
    category: "Mexican",
    price: 189,
    rating: 4.5,
    time: 20,
    emoji: "🌮",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=85",
    tag: "New",
  },
];

const categories = [
  "All",
  "North Indian",
  "South Indian",
  "Biryani",
  "Thali",
  "Wraps",
  "Street Food",
  "Chinese",
  "Italian",
  "Fast Food",
  "Snacks",
  "Healthy",
  "Japanese",
  "Desserts",
  "Drinks",
  "Mexican",
];

const thaliDishes: ThaliDish[] = [
  {
    key: "roti",
    name: "Tandoori Roti",
    emoji: "",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2023/09/tandoori-roti-recipe.jpg",
    choices: [
      { restaurant: "Punjabi Junction", price: 20, rating: 4.5, time: 15 },
      { restaurant: "Royal Punjab", price: 25, rating: 4.7, time: 18 },
      {restaurant: "Shaana Gwlior ", price :28,rating :4.5,time:17},
      {restaurant: "Rituraj", price :29,rating:4.1,time:22}
    ],
  },
  {
    key: "naan",
    name: "Butter Naan",
    emoji: "🫓",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0HQsAAiu9LVF6zk4Npp5K9lrW90g3V9s1L7qpfss5Cw&s=10",
    choices: [
      { restaurant: "Royal Punjab", price: 45, rating: 4.7, time: 15 },
      { restaurant: "Desi Zaika", price: 50, rating: 4.5, time: 20 },
    ],
  },
  {
    key: "paratha",
    name: "Lachha Paratha",
    emoji: "🫓",
    image: "https://binjalsvegkitchen.com/wp-content/uploads/2015/08/Pudina-Lachha-Paratha-H1.jpg",
    choices: [
      { restaurant: "Desi Zaika", price: 40, rating: 4.6, time: 15 },
      { restaurant: "Ghar Ka Khana", price: 45, rating: 4.4, time: 18 },
    ],
  },
  {
    key: "rice",
    name: "Jeera Rice",
    emoji: "🍚",
    image: "https://vanitascorner.com/wp-content/uploads/2023/06/Jeera-Rice-FB.jpg",
    choices: [
      { restaurant: "Spice Route", price: 99, rating: 4.6, time: 15 },
      { restaurant: "Rice Bowl House", price: 109, rating: 4.8, time: 20 },
    ],
  },
  {
    key: "steamedRice",
    name: "Steamed Rice",
    emoji: "🍚",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylhT7nhaN2wL4G51-QfsTe8Oar0zdKWPH9bMmCA7M7NEvI8V8M5g4G5g&s=10",
    choices: [
      { restaurant: "Green Kitchen", price: 79, rating: 4.4, time: 15 },
      { restaurant: "Spice Route", price: 89, rating: 4.6, time: 15 },
    ],
  },
  {
    key: "dalTadka",
    name: "Dal Tadka",
    emoji: "🥘",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlxHWCoih2MdnKyWeLIFos-ibprgeMVyLplYOHTDosKFZsU0P0FFFDXTuU&s=10",
    choices: [
      { restaurant: "Dal Darbar", price: 119, rating: 4.7, time: 20 },
      { restaurant: "Punjabi Junction", price: 129, rating: 4.5, time: 25 },
    ],
  },
  {
    key: "dalMakhani",
    name: "Dal Makhani",
    emoji: "🍲",
    image: "https://sinfullyspicy.com/wp-content/uploads/2015/03/4-1.jpg",
    choices: [
      { restaurant: "Royal Punjab", price: 159, rating: 4.8, time: 25 },
      { restaurant: "Urban Punjabi", price: 179, rating: 4.6, time: 30 },
    ],
  },
  {
    key: "paneer",
    name: "Paneer Butter Masala",
    emoji: "🍛",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2019/05/Paneer-Butter-Masala.jpg",
    choices: [
      { restaurant: "Urban Punjabi", price: 189, rating: 4.8, time: 25 },
      { restaurant: "Royal Punjab", price: 209, rating: 4.6, time: 30 },
    ],
  },
  {
    key: "shahiPaneer",
    name: "Shahi Paneer",
    emoji: "🍛",
    image: "https://static.toiimg.com/photo/52446409.cms",
    choices: [
      { restaurant: "Punjabi Junction", price: 199, rating: 4.7, time: 25 },
      { restaurant: "Desi Zaika", price: 219, rating: 4.8, time: 30 },
    ],
  },
  {
    key: "mixVeg",
    name: "Mix Veg",
    emoji: "🥦",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPcYNzaE0TlM3eB1OUQJNg8VfElzPys_yDr_WuVPobHHFH0UZxdw2sVuXI&s=10",
    choices: [
      { restaurant: "Garden Fresh", price: 139, rating: 4.4, time: 20 },
      { restaurant: "Desi Zaika", price: 149, rating: 4.6, time: 25 },
    ],
  },
  {
    key: "alooGobi",
    name: "Aloo Gobi",
    emoji: "🥔",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfJTEs3lgwy0pf83hE3uiCaF8e53JN_QC2Rp9R1m34PKmJgXrehfgQ4rub&s=10",
    choices: [
      { restaurant: "Ghar Ka Khana", price: 119, rating: 4.4, time: 20 },
      { restaurant: "Desi Zaika", price: 129, rating: 4.5, time: 25 },
    ],
  },
  {
    key: "chole",
    name: "Chole Masala",
    emoji: "🍛",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2023/04/Punjabi-Chole-Masala.jpg",
    choices: [
      { restaurant: "Delhi Darbar", price: 129, rating: 4.6, time: 20 },
      { restaurant: "Punjabi Junction", price: 139, rating: 4.5, time: 25 },
    ],
  },
  {
    key: "raita",
    name: "Boondi Raita",
    emoji: "🥣",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2022/04/Boondi-Raita.jpg",
    choices: [
      { restaurant: "Fresh Bowl", price: 59, rating: 4.5, time: 10 },
      { restaurant: "Spice Route", price: 69, rating: 4.6, time: 10 },
    ],
  },
  {
    key: "salad",
    name: "Fresh Garden Salad",
    emoji: "🥗",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGvPBm66kvttc463hPchsx0pDWgDbdWzQLch2eMWOzvc4pXp-GEkpfaa00&s=10",
    choices: [
      { restaurant: "Fit Grill", price: 49, rating: 4.6, time: 10 },
      { restaurant: "Green Kitchen", price: 59, rating: 4.7, time: 15 },
    ],
  },
  {
    key: "papad",
    name: "Roasted Papad",
    emoji: "🫓",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC2o-_tfE5rSWunJdapGYTw1dzwHa5-5fYuKzfvW_OEMhAhuIyA6NS92vb&s=10",
    choices: [
      { restaurant: "Spice Route", price: 20, rating: 4.3, time: 5 },
      { restaurant: "Punjabi Junction", price: 25, rating: 4.5, time: 5 },
    ],
  },
  {
    key: "gulabJamun",
    name: "Gulab Jamun",
    emoji: "🍮",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Gulab-jamun-wallpaper-1.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    choices: [
      { restaurant: "Sweet Studio", price: 49, rating: 4.8, time: 10 },
      { restaurant: "Indian Mithai House", price: 59, rating: 4.7, time: 10 },
    ],
  },
  {
    key: "rasmalai",
    name: "Rasmalai",
    emoji: "🍮",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7ocD3Ml4AnzEmWstqL7YUqYqCSvm1vF9DQRNgrd90YhAbRfjespSJOSVS&s=10",
    choices: [
      { restaurant: "Sweet Studio", price: 79, rating: 4.8, time: 10 },
      { restaurant: "Indian Mithai House", price: 89, rating: 4.7, time: 15 },
    ],
  },
];

const thaliOptionsByDish: Record<string, Food[]> = Object.fromEntries(
  thaliDishes.map((dish, dishIndex) => [
    dish.key,
    dish.choices.map((choice, choiceIndex) => ({
      id: 101 + dishIndex * 2 + choiceIndex,
      name: dish.name,
      restaurant: choice.restaurant,
      category: "Thali",
      price: choice.price,
      rating: choice.rating,
      time: choice.time,
      emoji: dish.emoji,
      image: dish.image,
      tag: "Thali Dish",
    })),
  ])
);

type FoodDetail = {
  description: string;
  ingredients: string[];
};

// Sample ingredient information for the demo menu. Restaurant recipes may vary.
const foodDetails: Record<number, FoodDetail> = {
  1: { description: "A freshly baked pizza topped with a savoury sauce, melted cheese and classic seasonings.", ingredients: ["Pizza base (wheat flour)", "Tomato sauce", "Mozzarella cheese", "Onion", "Capsicum", "Oregano", "Olive oil"] },
  2: { description: "A soft wrap filled with marinated paneer, vegetables and a flavourful chutney.", ingredients: ["Wheat wrap", "Paneer", "Yogurt", "Onion", "Capsicum", "Tandoori spices", "Mint chutney"] },
  3: { description: "A whole-wheat flatbread stuffed with seasoned mashed potatoes, cooked on a hot tawa.", ingredients: ["Wheat flour", "Potatoes", "Green chilli", "Fresh coriander", "Cumin", "Ghee or oil", "Salt"] },
  4: { description: "A traditional Indian meal served with a selection of comforting dishes and sides.", ingredients: ["Steamed rice", "Roti", "Dal", "Seasonal vegetable curry", "Raita", "Salad", "Pickle", "Papad"] },
  5: { description: "Paneer cubes simmered in a creamy tomato and butter-based gravy.", ingredients: ["Paneer", "Tomatoes", "Onion", "Butter", "Cream", "Cashews", "Ginger", "Garlic", "Indian spices"] },
  6: { description: "A fragrant layered rice dish cooked with aromatic biryani spices and herbs.", ingredients: ["Basmati rice", "Yogurt-based marinade", "Fried onions", "Mint", "Coriander", "Ginger-garlic", "Whole spices", "Saffron"] },
  7: { description: "A dum-cooked biryani made with marinated chicken, basmati rice and aromatic spices.", ingredients: ["Chicken", "Basmati rice", "Yogurt", "Fried onions", "Mint", "Coriander", "Ginger-garlic", "Biryani spices"] },
  8: { description: "A crisp fermented rice-and-lentil dosa filled with a spiced potato mixture.", ingredients: ["Rice", "Urad dal", "Potatoes", "Mustard seeds", "Curry leaves", "Green chilli", "Turmeric", "Oil"] },
  9: { description: "Soft steamed idlis served with a lentil and vegetable sambar.", ingredients: ["Rice", "Urad dal", "Toor dal", "Mixed vegetables", "Tamarind", "Sambar spices", "Curry leaves"] },
  10: { description: "Spiced chickpea curry served with fluffy, deep-fried bhature.", ingredients: ["Chickpeas", "Wheat flour or maida", "Yogurt", "Onion", "Tomatoes", "Ginger", "Chole masala", "Oil"] },
  11: { description: "Slow-cooked creamy black lentils served with soft naan bread.", ingredients: ["Black urad dal", "Kidney beans", "Butter", "Cream", "Tomatoes", "Ginger", "Garlic", "Wheat flour (naan)"] },
  12: { description: "Crispy samosa pieces layered with chickpeas, chutneys and chaat toppings.", ingredients: ["Samosa pastry", "Potatoes", "Green peas", "Chickpeas", "Yogurt", "Tamarind chutney", "Mint chutney", "Chaat masala"] },
  13: { description: "Crisp puris filled with potato or chickpeas and tangy flavoured water.", ingredients: ["Semolina or wheat puris", "Potatoes", "Chickpeas", "Mint", "Tamarind", "Coriander", "Chaat masala"] },
  14: { description: "Stir-fried noodles tossed with crunchy vegetables and a savoury Indo-Chinese sauce.", ingredients: ["Wheat noodles", "Cabbage", "Carrot", "Capsicum", "Spring onion", "Garlic", "Soy sauce", "Vinegar"] },
  15: { description: "Steamed dumplings filled with finely chopped vegetables and served with chutney.", ingredients: ["Wheat flour wrapper", "Cabbage", "Carrot", "Onion", "Ginger", "Garlic", "Spring onion", "Seasoning"] },
  16: { description: "Wok-tossed rice mixed with vegetables and a spicy Schezwan-style sauce.", ingredients: ["Cooked rice", "Schezwan sauce", "Capsicum", "Carrot", "Beans", "Spring onion", "Garlic", "Soy sauce"] },
  17: { description: "A classic pizza topped with tomato sauce, mozzarella and fresh basil.", ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Fresh basil", "Olive oil", "Oregano"] },
  18: { description: "Pasta coated in a rich, creamy Alfredo-style white sauce.", ingredients: ["Pasta (wheat)", "Cream", "Butter", "Cheese", "Garlic", "Black pepper", "Italian herbs"] },
  19: { description: "A classic burger layered with a patty, cheese, fresh vegetables and sauce.", ingredients: ["Burger bun (wheat)", "Patty", "Cheese", "Lettuce", "Tomato", "Onion", "Burger sauce"] },
  20: { description: "Golden, crispy potato fries lightly seasoned and served hot.", ingredients: ["Potatoes", "Vegetable oil", "Salt", "Seasoning"] },
  21: { description: "A platter of seasoned sushi rice with assorted fillings and traditional accompaniments.", ingredients: ["Sushi rice", "Rice vinegar", "Nori seaweed", "Vegetable or seafood fillings", "Soy sauce", "Wasabi", "Pickled ginger"] },
  22: { description: "A layered sandwich with fresh vegetables, cheese and a creamy spread.", ingredients: ["Bread", "Lettuce", "Tomato", "Cucumber", "Cheese", "Mayonnaise", "Sandwich filling"] },
  23: { description: "A soft chocolate-flavoured cake with a rich cocoa taste.", ingredients: ["Wheat flour", "Cocoa powder", "Sugar", "Butter or oil", "Milk", "Eggs (recipe dependent)", "Baking powder"] },
  24: { description: "Soft, deep-fried milk-solid dumplings soaked in fragrant sugar syrup.", ingredients: ["Milk solids (khoya)", "Flour", "Sugar", "Cardamom", "Ghee or oil", "Rose water"] },
  25: { description: "A chilled, creamy drink blended with ripe mangoes and milk.", ingredients: ["Mango", "Milk", "Sugar (optional)", "Ice"] },
  26: { description: "A chilled coffee drink blended with milk and a touch of sweetness.", ingredients: ["Milk", "Coffee", "Sugar", "Ice", "Chocolate syrup (optional)"] },
  27: { description: "A smooth frozen dessert with a sweet strawberry flavour.", ingredients: ["Milk or cream", "Strawberries", "Sugar", "Milk solids", "Stabilizer"] },
  28: { description: "A Mexican-style taco filled with a savoury filling, vegetables and sauce.", ingredients: ["Tortilla", "Taco filling", "Lettuce", "Tomato", "Onion", "Cheese", "Salsa"] },
};

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showThaliBuilder, setShowThaliBuilder] = useState(false);
  const [selectedThaliItem, setSelectedThaliItem] = useState<string | null>(null);
  const [draggingOverCart, setDraggingOverCart] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const text = (
        food.name + " " + food.restaurant + " " + food.category
      ).toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory = category === "All" || food.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );
  const deliveryFee = subtotal === 0 || subtotal >= 499 ? 0 : 30;
  const total = subtotal + deliveryFee;
  const amountForFreeDelivery = Math.max(0, 499 - subtotal);

  const selectedDish = thaliDishes.find(
    (dish) => dish.key === selectedThaliItem
  );
  const selectedRestaurantOptions = selectedThaliItem
    ? thaliOptionsByDish[selectedThaliItem] ?? []
    : [];

  useEffect(() => {
    if (!selectedFood) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedFood(null);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedFood]);

  useEffect(() => {
    if (!showThaliBuilder) return;
    document.getElementById("buffet-builder")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [showThaliBuilder, selectedThaliItem]);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/api/auth/me`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (!cancelled && data?.user) setAuthUser(data.user as AuthUser);
      })
      .catch(() => {
        // The frontend can still be previewed before the backend is started.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Clear the local UI even if the backend is offline.
    }

    setAuthUser(null);
    setNotice("You have been logged out.");
  }

  function addToCart(food: Food) {
    setNotice(food.name + " added to your Smart Cart.");
    setSuccessMessage("");

    setCart((previous) => {
      const existing = previous.find((item) => item.food.id === food.id);
      if (existing) {
        return previous.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...previous, { food, quantity: 1 }];
    });
  }

  function changeQuantity(foodId: number, change: number) {
    setCart((previous) =>
      previous
        .map((item) =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(foodId: number) {
    setCart((previous) => previous.filter((item) => item.food.id !== foodId));
  }

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setDraggingOverCart(true);
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setDraggingOverCart(false);

    const foodId = Number(event.dataTransfer.getData("foodId"));
    const food = [...foods, ...Object.values(thaliOptionsByDish).flat()].find(
      (item) => item.id === foodId
    );
    if (food) addToCart(food);
  }

  function openThaliBuilder() {
    setNotice("");
    setSelectedThaliItem(null);
    setShowThaliBuilder(true);
  }

  function returnToMenu() {
    setShowThaliBuilder(false);
    setSelectedThaliItem(null);
  }

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.length === 0) return;

    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    setSuccessMessage(
      "Thank you, " + customerName + "! Demo order #" + orderNumber +
        " has been placed. Total: ₹" + total +
        ". No real delivery has been requested."
    );
    setCart([]);
    setCheckoutOpen(false);
    setCustomerName("");
    setAddress("");
    setNotice("");
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home" onClick={returnToMenu}>
          <span className="brand-logo">
            <UtensilsCrossed size={27} />
          </span>
          <span>
            Crave<span className="brand-green">Buddy</span>
          </span>
        </a>

       

        <label className="nav-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search food or restaurants..."
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </label>

        {authUser ? (
          <div className="navbar-account">
            <span className="navbar-greeting">Hi, {authUser.name.split(" ")[0]}</span>
            <button type="button" className="login-button logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button type="button" className="login-button" onClick={() => setShowLoginPage(true)}>
            Login
          </button>
        )}

        <a className="location-label" href="#smart-cart">📍 Your location</a>
        <a className="nav-cart" href="#smart-cart" aria-label="Go to cart">
          <ShoppingBag size={22} />
          <span>{itemCount}</span>
        </a>
      </header>

      {showLoginPage && (
        <LoginPage
          onBack={() => setShowLoginPage(false)}
          onAuthenticated={(user) => {
            setAuthUser(user);
            setShowLoginPage(false);
            setNotice(`Welcome to CraveBuddy, ${user.name.split(" ")[0]}!`);
          }}
        />
      )}

      <main id="home">
        <section className="welcome-banner buffet-banner">
          <div className="welcome-copy buffet-banner-content">
            <span className="eyebrow">🍽️ YOUR MEAL, YOUR WAY</span>
            <h1>
              Introducing <span>Buffet Thali</span>
              <br />
              at CraveBuddy!
            </h1>
            <p>
              Choose the dishes you love, compare the same dish from different
              restaurants, and create your own meal.
            </p>
            <button
              type="button"
              className="green-button banner-button"
              onClick={openThaliBuilder}
            >
              🍛 Order Your Thali Now <span>→</span>
            </button>
            <div className="buffet-highlights">
              <span>✓ Choose your dishes</span>
              <span>✓ Compare restaurants</span>
              <span>✓ Create your own meal</span>
            </div>
          </div>
          <div className="banner-emoji buffet-emoji" aria-label="Buffet thali">🍱</div>
        </section>

        <div className="page-layout">
          <div className="menu-column">
            {showThaliBuilder ? (
              <section className="menu-section thali-flow-section" id="buffet-builder">
                {selectedThaliItem === null ? (
                  <>
                    <div className="thali-flow-heading">
                      <div>
                        <span className="eyebrow">BUILD YOUR BUFFET THALI</span>
                        <h2>Choose your favourite dishes 🍽️</h2>
                        <p>Click any dish to see it from different restaurants.</p>
                      </div>
                      <button type="button" className="builder-back" onClick={returnToMenu}>
                        <X size={16} /> Back to menu
                      </button>
                    </div>

                    <div className="thali-type-grid">
                      {thaliDishes.map((dish) => (
                        <button
                          type="button"
                          className="thali-type-card"
                          key={dish.key}
                          onClick={() => setSelectedThaliItem(dish.key)}
                        >
                          <div className="thali-type-image">
                            <span className="thali-type-emoji">{dish.emoji}</span>
                            <img
                              src={dish.image}
                              alt={dish.name}
                              loading="lazy"
                              onError={(event) => { event.currentTarget.style.display = "none"; }}
                            />
                          </div>
                          <div className="thali-type-copy">
                            <h3>{dish.name}</h3>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="thali-flow-heading">
                      <div>
                        <span className="eyebrow">COMPARE RESTAURANTS</span>
                        <h2>{selectedDish?.name}</h2>
                        <p>Choose a restaurant, then add or drag that dish to your Smart Cart.</p>
                      </div>
                      <button type="button" className="builder-back" onClick={() => setSelectedThaliItem(null)}>
                        <ArrowLeft size={16} /> All dishes
                      </button>
                    </div>

                    <div className="selected-dish-banner">
                      <div className="selected-dish-image">
                        <img
                          src={selectedDish?.image}
                          alt={selectedDish?.name ?? "Selected dish"}
                          onError={(event) => { event.currentTarget.style.display = "none"; }}
                        />
                      </div>
                      <div>
                        <span className="eyebrow">SELECTED DISH</span>
                        <h3>{selectedDish?.name}</h3>
                        <p>{selectedRestaurantOptions.length} sample restaurant options available.</p>
                      </div>
                    </div>

                    <div className="thali-restaurant-grid">
                      {selectedRestaurantOptions.map((dish) => (
                        <article
                          className="thali-restaurant-card"
                          key={dish.id}
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData("foodId", String(dish.id));
                            event.dataTransfer.effectAllowed = "copy";
                          }}
                        >
                          <div className="thali-restaurant-image">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              loading="lazy"
                              onError={(event) => { event.currentTarget.style.display = "none"; }}
                            />
                            <span className="food-tag">{dish.tag}</span>
                          </div>
                          <div className="thali-restaurant-copy">
                            <div className="food-title-row">
                              <h3>{dish.name}</h3>
                              <strong>₹{dish.price}</strong>
                            </div>
                            <p className="restaurant-name">{dish.restaurant}</p>
                            <div className="thali-option-meta">
                              <span>★ {dish.rating.toFixed(1)}</span>
                              <span><Clock size={14} /> {dish.time} min</span>
                            </div>
                            <button type="button" className="add-button thali-option-add" onClick={() => addToCart(dish)}>
                              <Plus size={16} /> Add to Smart Cart
                            </button>
                            <p className="drag-hint">⠿ Drag to Smart Cart</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                )}
              </section>
            ) : (
              <section className="menu-section" id="menu">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">FRESH PICKS</span>
                    <h2>Popular right now</h2>
                    <p>Choose your meal and add it to your Smart Cart.</p>
                  </div>
                  <span className="results-count">{filteredFoods.length} meals</span>
                </div>

                <div className="category-list">
                  {categories.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={category === item ? "category-chip active" : "category-chip"}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="food-grid">
                  {filteredFoods.map((food) => (
                    <article
                      className="food-card"
                      key={food.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("foodId", String(food.id));
                        event.dataTransfer.effectAllowed = "copy";
                      }}
                    >
                      <div className="food-image">
                        <span className="food-fallback">{food.emoji}</span>
                        <img
                          className="food-photo"
                          src={food.image}
                          alt={food.name}
                          loading="lazy"
                          onError={(event) => { event.currentTarget.style.display = "none"; }}
                        />
                        <span className="food-tag">{food.tag === "Veg" ? "🌿 Veg" : food.tag}</span>
                        <span className="food-rating">★ {food.rating}</span>
                      </div>
                      <div className="food-details">
                        <div className="food-title-row">
                          <h3>{food.name}</h3>
                          <strong>₹{food.price}</strong>
                        </div>
                        <p className="restaurant-name">{food.restaurant}</p>
                        <div className="food-meta">
                          <span>★ {food.rating}</span>
                          <span><Clock size={14} /> {food.time} min</span>
                        </div>
                        <div className="food-actions">
                          <button
                            type="button"
                            className="details-button"
                            onClick={() => {
                              setNotice("");
                              setSelectedFood(food);
                            }}
                          >
                            View Details
                          </button>
                          <button type="button" className="add-button" onClick={() => addToCart(food)}>
                            <Plus size={17} /> Add
                          </button>
                        </div>
                        <p className="drag-hint">⠿ Drag to Smart Cart</p>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredFoods.length === 0 && (
                  <div className="no-results">
                    <span>🔎</span>
                    <h3>No meals found</h3>
                    <p>Try another food name or category.</p>
                    <button type="button" className="green-button" onClick={() => { setSearch(""); setCategory("All"); }}>
                      Show all meals
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>

          <aside
            id="smart-cart"
            className={draggingOverCart ? "smart-cart drag-active" : "smart-cart"}
            onDragOver={handleDragOver}
            onDragLeave={() => setDraggingOverCart(false)}
            onDrop={handleDrop}
          >
            <div className="smart-cart-header">
              <div><ShoppingBag size={21} /><h2>Your Smart Meal</h2></div>
              <span>{itemCount}</span>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon"><ShoppingBag size={30} /></div>
                <h3>Your cart is empty</h3>
                <p>Drag food cards here or tap "Add"</p>
                <span className="empty-cart-tip">Your selected meals will appear here.</span>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.food.id}>
                      <div className="cart-food-emoji">{item.food.emoji}</div>
                      <div className="cart-food-info">
                        <h3>{item.food.name}</h3>
                        <p>{item.food.restaurant}</p>
                        <p>₹{item.food.price} each</p>
                        <div className="quantity-control">
                          <button type="button" onClick={() => changeQuantity(item.food.id, -1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => changeQuantity(item.food.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                        </div>
                      </div>
                      <div className="cart-food-price">
                        <strong>₹{item.food.price * item.quantity}</strong>
                        <button type="button" className="remove-button" onClick={() => removeItem(item.food.id)} aria-label="Remove item"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bill-summary">
                  {amountForFreeDelivery > 0 && (
                    <p className="delivery-tip">Add ₹{amountForFreeDelivery} more for free delivery.</p>
                  )}
                  <div className="bill-line"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
                  <div className="bill-line"><span>Delivery fee</span><strong>{deliveryFee === 0 ? "FREE" : "₹" + deliveryFee}</strong></div>
                  <div className="bill-line"><span>Taxes</span><strong>Included</strong></div>
                  <div className="bill-total"><span>Total bill</span><strong>₹{total}</strong></div>
                  <button type="button" className="checkout-button" onClick={() => setCheckoutOpen(!checkoutOpen)}>
                    {checkoutOpen ? "Hide Checkout" : "Proceed to Checkout"} →
                  </button>
                  <p className="demo-note">Demo checkout · No online payment</p>

                  {checkoutOpen && (
                    <form className="checkout-form" onSubmit={placeOrder}>
                      <h3>Delivery details</h3>
                      <label htmlFor="customer-name">Your name</label>
                      <input id="customer-name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Enter your name" required />
                      <label htmlFor="delivery-address">Delivery address</label>
                      <textarea id="delivery-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="House number, street, city" rows={3} required />
                      <button className="checkout-button" type="submit">Place Demo Order · ₹{total}</button>
                    </form>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      </main>

      {selectedFood && (
        <div
          className="food-detail-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedFood(null);
          }}
        >
          <section
            className="food-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="food-detail-title"
          >
            <button
              type="button"
              className="food-detail-close"
              onClick={() => setSelectedFood(null)}
              aria-label="Close food details"
            >
              <X size={20} />
            </button>

            <div className="food-detail-visual">
              <span className="food-detail-emoji">{selectedFood.emoji || "🍽️"}</span>
              <img
                src={selectedFood.image}
                alt={selectedFood.name}
                onError={(event) => { event.currentTarget.style.display = "none"; }}
              />
              <span className="food-detail-tag">{selectedFood.tag === "Veg" ? "🌿 Vegetarian" : selectedFood.tag}</span>
            </div>

            <div className="food-detail-content">
              <span className="eyebrow">FOOD DETAILS</span>
              <h2 id="food-detail-title">{selectedFood.name}</h2>
              <p className="food-detail-description">
                {foodDetails[selectedFood.id]?.description ?? "A freshly prepared dish from our restaurant menu."}
              </p>

              <div className="food-detail-facts">
                <div><span>Restaurant</span><strong>{selectedFood.restaurant}</strong></div>
                <div><span>Price</span><strong>₹{selectedFood.price}</strong></div>
                <div><span>Rating</span><strong>★ {selectedFood.rating}</strong></div>
                <div><span>Preparation time</span><strong>{selectedFood.time} min</strong></div>
              </div>

              <h3 className="food-ingredients-title">Ingredients</h3>
              <ul className="food-ingredient-list">
                {(foodDetails[selectedFood.id]?.ingredients ?? ["Ingredients vary by restaurant"]).map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
              <p className="food-detail-note">
                Ingredient list is indicative for this demo. The restaurant's actual recipe may vary. Please confirm allergens with the restaurant.
              </p>

              <button
                type="button"
                className="add-button food-detail-add"
                onClick={() => {
                  const foodToAdd = selectedFood;
                  setSelectedFood(null);
                  addToCart(foodToAdd);
                }}
              >
                <Plus size={17} /> Add to Smart Cart · ₹{selectedFood.price}
              </button>
            </div>
          </section>
        </div>
      )}

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Close message"><X size={17} /></button>
        </div>
      )}

      <footer className="footer">
        <a className="brand" href="#home" onClick={returnToMenu}>
          <span className="brand-logo"><UtensilsCrossed size={20} /></span>
          <span>Crave<span className="brand-green">Buddy</span></span>
        </a>
        <p>Made with ❤️ for food lovers.</p>
        <span>© 2026 CraveBuddy · Demo website</span>
      </footer>

      {successMessage && (
        <div className="success-overlay">
          <div className="success-card">
            <CheckCircle2 size={54} />
            <h2>Demo order placed!</h2>
            <p>{successMessage}</p>
            <button type="button" className="green-button" onClick={() => setSuccessMessage("")}>
              Continue exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
