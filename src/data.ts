import { Designer, EventSchedule } from "./types";

export const DESIGNERS: Designer[] = [
  {
    id: "d1",
    name: "Leyla Aliyeva",
    brand: "L'EAU DAZUR",
    bio: "Exquisite fluid designs inspired by the Caspian sea waves.",
    imageUrl: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&auto=format&fit=crop&q=60",
    instagramUrl: "https://instagram.com/leyla_eau",
  },
  {
    id: "d2",
    name: "Murad Huseynov",
    brand: "DEEP CURRENT",
    bio: "Avant-garde streetwear meeting oceanic elements.",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=60",
    instagramUrl: "https://instagram.com/deep_current",
  },
  {
    id: "d3",
    name: "Nargiz Rzayeva",
    brand: "AQUA GLAM",
    bio: "Haute couture featuring shimmering blue palettes and silken textures.",
    imageUrl: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=800&auto=format&fit=crop&q=60",
    instagramUrl: "https://instagram.com/nargiz_aqua",
  },
  {
    id: "d4",
    name: "Kamal Safarov",
    brand: "NEPTUNE",
    bio: "Sustainable men's fashion using eco-friendly water-based dyes.",
    imageUrl: "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=800&auto=format&fit=crop&q=60",
    instagramUrl: "https://instagram.com/neptune_mens",
  }
];

export const SCHEDULE: EventSchedule[] = [
  {
    id: "s1",
    date: "2026-10-12",
    time: "18:00",
    designerId: "d1",
    designerName: "Leyla Aliyeva",
    location: "Crystal Hall - Main Stage",
    type: "Runway Show",
    ticketAvailable: true,
  },
  {
    id: "s2",
    date: "2026-10-12",
    time: "20:00",
    designerId: "d3",
    designerName: "Nargiz Rzayeva",
    location: "Crystal Hall - Water Pavilion",
    type: "Runway Show",
    ticketAvailable: true,
  },
  {
    id: "s3",
    date: "2026-10-13",
    time: "17:00",
    designerId: "d4",
    designerName: "Kamal Safarov",
    location: "Flame Towers Expo Gala",
    type: "Presentation",
    ticketAvailable: false,
  },
  {
    id: "s4",
    date: "2026-10-13",
    time: "19:30",
    designerId: "d2",
    designerName: "Murad Huseynov",
    location: "Crystal Hall - Main Stage",
    type: "Runway Show",
    ticketAvailable: true,
  }
];
