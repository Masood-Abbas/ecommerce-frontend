import banner2 from "@/assets/slider/banner2.png";
import banner3 from "@/assets/slider/banner3.png";
import banner4 from "@/assets/slider/banner4.png";

import { CreditCard, Headset, Truck } from "lucide-react";

export const slideData = [
  { image: banner2, title: "Slide 2" },
  { image: banner3, title: "Slide 3" },
  { image: banner4, title: "Slide 4" },
];

export const features = [
  {
    id:1,
    icon: <Truck className="w-10 h-10 text-white" />,
    title: "FREE AND FAST DELIVERY",
    desc: "Free delivery for all orders over $140",
  },
  {
    id:2,
    icon: <Headset className="w-10 h-10 text-white" />,
    title: "24/7 CUSTOMER SERVICE",
    desc: "Friendly 24/7 customer support",
  },
  {
    id:3,
    icon: <CreditCard className="w-10 h-10 text-white" />,
    title: "MONEY BACK GUARANTEE",
    desc: "We return money within 30 days",
  },
];
