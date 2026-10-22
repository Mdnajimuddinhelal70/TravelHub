export type Tour = {
  id: string;
  title: string;
  destination: string;
  country: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  image: string;
  featured: boolean;
};

export const tours: Tour[] = [
  {
    id: "bali-escape",
    title: "Tropical Bali Escape",
    destination: "Bali",
    country: "Indonesia",
    category: "beach",
    description:
      "Discover turquoise waters, lush landscapes and the unforgettable beauty of Bali.",
    price: 499,
    duration: "5 days",
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: "swiss-alps",
    title: "Swiss Alps Adventure",
    destination: "Interlaken",
    country: "Switzerland",
    category: "nature",
    description:
      "Experience spectacular mountain views, peaceful lakes and charming alpine villages.",
    price: 699,
    duration: "7 days",
    rating: 4.9,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: "santorini-sunset",
    title: "Santorini Sunset Getaway",
    destination: "Santorini",
    country: "Greece",
    category: "cultural",
    description:
      "Explore whitewashed villages, beautiful coastal views and spectacular sunsets.",
    price: 599,
    duration: "4 days",
    rating: 4.8,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: "thailand-islands",
    title: "Thailand Island Discovery",
    destination: "Phi Phi Islands",
    country: "Thailand",
    category: "adventure",
    description:
      "Explore tropical islands, clear blue waters and exciting outdoor adventures.",
    price: 399,
    duration: "5 days",
    rating: 4.7,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=85",
    featured: false,
  },
  {
    id: "bali-jungle",
    title: "Bali Jungle Retreat",
    destination: "Ubud",
    country: "Indonesia",
    category: "nature",
    description:
      "Reconnect with nature among emerald rice terraces, tropical forests and waterfalls.",
    price: 449,
    duration: "4 days",
    rating: 4.7,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=85",
    featured: false,
  },
  {
    id: "nepal-trekking",
    title: "Himalayan Adventure",
    destination: "Pokhara",
    country: "Nepal",
    category: "adventure",
    description:
      "Discover dramatic mountain scenery, peaceful trails and memorable outdoor experiences.",
    price: 549,
    duration: "6 days",
    rating: 4.9,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    featured: false,
  },
];

export const tourCategories = [
  { label: "All Tours", value: "" },
  { label: "Adventure", value: "adventure" },
  { label: "Beach & Islands", value: "beach" },
  { label: "Nature", value: "nature" },
  { label: "Cultural", value: "cultural" },
];
