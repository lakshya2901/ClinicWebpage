import {
  Phone, PhoneCall, ArrowRight, Sparkles, ScanLine, Layers, Baby, HeartPulse, ShieldCheck,
  BadgeCheck, Award, Clock, Car, CalendarCheck, Calendar, Menu, X, Mail, MapPin, Navigation,
  Star, CircleCheck, CircleX, Zap, Gem, Gauge, ChevronLeft, ChevronRight, ChevronDown,
  MessageCircle, Siren, House, Camera, GraduationCap, Box, FileUp, Droplets, ScanFace, Check,
} from 'lucide';

/** Lucide icon nodes, rendered to inline SVG at build time (no icon font, no runtime cost). */
const nodes = {
  phone: Phone, 'phone-call': PhoneCall, 'arrow-right': ArrowRight, sparkles: Sparkles,
  'scan-line': ScanLine, layers: Layers, baby: Baby, 'heart-pulse': HeartPulse,
  'shield-check': ShieldCheck, 'badge-check': BadgeCheck, award: Award, clock: Clock, car: Car,
  'calendar-check': CalendarCheck, calendar: Calendar, menu: Menu, x: X, mail: Mail,
  'map-pin': MapPin, navigation: Navigation, star: Star, 'circle-check': CircleCheck,
  'circle-x': CircleX, zap: Zap, gem: Gem, gauge: Gauge, 'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight, 'chevron-down': ChevronDown, 'message-circle': MessageCircle,
  siren: Siren, house: House, camera: Camera, 'graduation-cap': GraduationCap, box: Box,
  'file-up': FileUp, droplets: Droplets, 'scan-face': ScanFace, check: Check,
  // Custom molar outline (Lucide has no tooth icon)
  tooth: [
    ['path', { d: 'M12 5.5C10.6 4.2 8.4 3.6 6.9 4.8 5.2 6.2 5.1 8.6 5.7 11c.5 2.1 1 4.4 1.5 6.7.3 1.5 1 3.3 2.4 3.3 1.2 0 1.6-1.2 1.8-2.6.1-.9.3-2.1.6-2.1s.5 1.2.6 2.1c.2 1.4.6 2.6 1.8 2.6 1.4 0 2.1-1.8 2.4-3.3.5-2.3 1-4.6 1.5-6.7.6-2.4.5-4.8-1.2-6.2C15.600 3.600 13.400 4.200 12 5.500Z' }],
  ],
};

const attr = (o) =>
  Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');

/** @param {string} name @param {{size?:number, fill?:boolean, cls?:string}} [o] */
export function icon(name, { size = 20, fill = false, cls = '' } = {}) {
  const node = nodes[name];
  if (!node) throw new Error(`Unknown icon "${name}". Add it to src/templates/icons.js`);
  const inner = node.map(([tag, a]) => `<${tag} ${attr(a)}/>`).join('');
  return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${
    fill ? 'currentColor' : 'none'
  }" stroke="currentColor" stroke-width="${fill ? 1.5 : 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}
