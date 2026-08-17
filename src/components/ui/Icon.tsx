import { type LucideProps } from 'lucide-react';
import {
  Brain, CloudRain, Wallet, Leaf, TrendingUp, CalendarRange, MapPinned,
  SatelliteDish, Sparkles, LineChart, LayoutDashboard, Sprout, Bot,
  Settings, ShieldCheck, Droplets, Clock, Camera, Bell, Mail, User,
  Globe, Moon, CreditCard, Users, Wheat, UserCircle, CloudSun, BarChart3,
  Building2, ShoppingBag, IndianRupee, HeartPulse, CheckSquare, ArrowRight,
  TrendingDown, Check, Circle, BadgeCheck, Star, MapPin, Sun,
  Wind, Umbrella, Package, Banknote, Zap, FileText, type LucideIcon,
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  Brain, CloudRain, Wallet, Leaf, TrendingUp, CalendarRange, MapPinned,
  SatelliteDish, Sparkles, LineChart, LayoutDashboard, Sprout, Bot,
  Settings, ShieldCheck, Droplets, Clock, Camera, Bell, Mail, User,
  Globe, Moon, CreditCard, Users, Wheat, UserCircle, CloudSun, BarChart3,
  Building2, ShoppingBag, IndianRupee, HeartPulse, CheckSquare, ArrowRight,
  TrendingDown, Check, Circle, BadgeCheck, Star, MapPin, Sun,
  Wind, Umbrella, Package, Banknote, Zap, FileText,
};

export default function Icon({ name, ...rest }: { name: string } & LucideProps) {
  const Cmp = map[name] ?? Sparkles;
  return <Cmp {...rest} />;
}
