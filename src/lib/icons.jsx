/* Icon registry. To use a new icon: find its name at lucide.dev/icons,
   import it below, and add it to the ICONS list. */
import {
  Activity, ArrowRight, ArrowUpRight, Brain, Briefcase, Check, ChevronLeft, ChevronRight,
  Clock, Cloud, CornerDownLeft, Copy, Database, Droplets, FileText, Filter, Gauge, GraduationCap,
  Home, Layers, Mail, MapPin, Phone, Printer, Radio, Search, Server, Sparkles, Terminal,
  Users, Wrench, X, Zap,
} from "lucide-react";

const Linkedin = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const ICONS = {
  Activity, ArrowRight, ArrowUpRight, Brain, Briefcase, Check, ChevronLeft, ChevronRight,
  Clock, Cloud, CornerDownLeft, Copy, Database, Droplets, FileText, Filter, Gauge, GraduationCap,
  Home, Layers, Linkedin, Mail, MapPin, Phone, Printer, Radio, Search, Server, Sparkles, Terminal,
  Users, Wrench, X, Zap,
};

export function Icon({ name, size = 18, className = "" }) {
  const Component = ICONS[name] || Sparkles;
  return <Component size={size} className={className} aria-hidden="true" />;
}