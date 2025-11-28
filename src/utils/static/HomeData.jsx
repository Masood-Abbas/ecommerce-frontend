import banner1 from "@/assets/slider/banner4.jpg";
import banner2 from "@/assets/slider/banner5.jpg";
import banner3 from "@/assets/slider/banner6.jpg";

import { CreditCard, Headset, Truck } from "lucide-react";

export const slideData = [
  { image: banner1, title: "Slide 1" },
  { image: banner2, title: "Slide 2" },
  { image: banner3, title: "Slide 3" },
];

export const features = [
  {
    icon: <Truck className="w-10 h-10 text-white" />,
    title: "FREE AND FAST DELIVERY",
    desc: "Free delivery for all orders over $140",
  },
  {
    icon: <Headset className="w-10 h-10 text-white" />,
    title: "24/7 CUSTOMER SERVICE",
    desc: "Friendly 24/7 customer support",
  },
  {
    icon: <CreditCard className="w-10 h-10 text-white" />,
    title: "MONEY BACK GUARANTEE",
    desc: "We return money within 30 days",
  },
];
