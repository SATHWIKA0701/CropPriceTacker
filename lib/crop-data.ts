export const TELANGANA_DISTRICTS = [
  "Adilabad",
  "Bhadradri Kothagudem",
  "Hyderabad",
  "Jagtial",
  "Jangaon",
  "Jayashankar Bhupalpally",
  "Jogulamba Gadwal",
  "Kamareddy",
  "Karimnagar",
  "Khammam",
  "Kumuram Bheem",
  "Mahabubabad",
  "Mahabubnagar",
  "Mancherial",
  "Medak",
  "Medchal-Malkajgiri",
  "Mulugu",
  "Nagarkurnool",
  "Nalgonda",
  "Narayanpet",
  "Nirmal",
  "Nizamabad",
  "Peddapalli",
  "Rajanna Sircilla",
  "Rangareddy",
  "Sangareddy",
  "Siddipet",
  "Suryapet",
  "Vikarabad",
  "Wanaparthy",
  "Warangal Rural",
  "Warangal Urban",
  "Yadadri Bhuvanagiri",
] as const;

export const MANDALS_BY_DISTRICT: Record<string, string[]> = {
  Adilabad: ["Adilabad", "Boath", "Gudihathnoor", "Ichoda", "Jainath", "Tamsi"],
  Karimnagar: ["Karimnagar", "Choppadandi", "Gangadhara", "Huzurabad", "Manakondur", "Thimmapur"],
  Khammam: ["Khammam", "Kothagudem", "Madhira", "Sathupalli", "Wyra", "Yellandu"],
  Nizamabad: ["Nizamabad", "Armoor", "Bodhan", "Banswada", "Kamareddy", "Yellareddy"],
  Warangal: ["Warangal", "Hanamkonda", "Jangaon", "Mahabubabad", "Mulugu", "Parkal"],
  Nalgonda: ["Nalgonda", "Miryalaguda", "Devarakonda", "Suryapet", "Bhongir", "Kodad"],
  Hyderabad: ["Amberpet", "Ameerpet", "Bahadurpura", "Bandlaguda", "Charminar", "Golconda"],
  Rangareddy: ["Chevella", "Ibrahimpatnam", "Maheshwaram", "Moinabad", "Rajendranagar", "Shamshabad"],
  Medak: ["Medak", "Narsapur", "Sangareddy", "Siddipet", "Toopran", "Zaheerabad"],
  Sangareddy: ["Sangareddy", "Patancheru", "Zaheerabad", "Narayankhed", "Andole", "Jogipet"],
};

export const MARKETS_BY_MANDAL: Record<string, string[]> = {
  Karimnagar: ["Karimnagar Main Market", "Karimnagar Rythu Bazaar"],
  Nizamabad: ["Nizamabad Main Market", "Nizamabad Rythu Bazaar"],
  Warangal: ["Warangal Enumamula Market", "Warangal Rythu Bazaar"],
  Khammam: ["Khammam Main Market", "Khammam Rythu Bazaar"],
  Nalgonda: ["Nalgonda Main Market", "Nalgonda Rythu Bazaar"],
  Hyderabad: ["Bowenpally Market", "Erragadda Market", "Gudimalkapur Market"],
  Amberpet: ["Amberpet Rythu Bazaar"],
  Ameerpet: ["Ameerpet Market"],
  Sangareddy: ["Sangareddy Main Market"],
  Medak: ["Medak Main Market"],
};

export const CROPS = [
  "Rice (Paddy)",
  "Wheat",
  "Maize (Corn)",
  "Jowar (Sorghum)",
  "Cotton",
  "Red Gram (Tur)",
  "Bengal Gram (Chana)",
  "Green Gram (Moong)",
  "Black Gram (Urad)",
  "Groundnut",
  "Soybean",
  "Sunflower",
  "Sesame (Til)",
  "Turmeric",
  "Red Chilli",
  "Onion",
  "Tomato",
  "Sugarcane",
  "Mango",
  "Banana",
] as const;

export interface PricePoint {
  date: string;
  price: number;
}

function generatePriceHistory(basePrice: number, days: number): PricePoint[] {
  const data: PricePoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * basePrice * 0.15;
    data.push({
      date: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      price: Math.round(basePrice + variation),
    });
  }
  return data;
}

const BASE_PRICES: Record<string, number> = {
  "Rice (Paddy)": 2200,
  Wheat: 2350,
  "Maize (Corn)": 1960,
  "Jowar (Sorghum)": 3100,
  Cotton: 6600,
  "Red Gram (Tur)": 7000,
  "Bengal Gram (Chana)": 5450,
  "Green Gram (Moong)": 8150,
  "Black Gram (Urad)": 6950,
  Groundnut: 5850,
  Soybean: 4600,
  Sunflower: 6400,
  "Sesame (Til)": 7850,
  Turmeric: 12500,
  "Red Chilli": 18000,
  Onion: 1800,
  Tomato: 2500,
  Sugarcane: 3100,
  Mango: 4500,
  Banana: 2100,
};

export function getCropPrice(crop: string): number {
  const base = BASE_PRICES[crop] || 2500;
  const variation = (Math.random() - 0.5) * base * 0.08;
  return Math.round(base + variation);
}

export function get7DayHistory(crop: string): PricePoint[] {
  const base = BASE_PRICES[crop] || 2500;
  return generatePriceHistory(base, 7);
}

export function get30DayHistory(crop: string): PricePoint[] {
  const base = BASE_PRICES[crop] || 2500;
  return generatePriceHistory(base, 30);
}

export function getPriceChange(history: PricePoint[]): {
  value: number;
  percentage: number;
  isPositive: boolean;
} {
  if (history.length < 2) return { value: 0, percentage: 0, isPositive: true };
  const latest = history[history.length - 1].price;
  const previous = history[history.length - 2].price;
  const change = latest - previous;
  const percentage = (change / previous) * 100;
  return {
    value: Math.abs(change),
    percentage: Math.abs(percentage),
    isPositive: change >= 0,
  };
}
