import {
  Award,
  CalendarCheck,
  Check,
  Clock,
  Cpu,
  Factory,
  FlaskConical,
  GraduationCap,
  Handshake,
  Leaf,
  Lightbulb,
  Megaphone,
  Mic,
  Newspaper,
  Rocket,
  Search,
  Settings2,
  Trophy,
  UserCheck,
  Users,
  Briefcase,
  X,
  type LucideProps,
} from "lucide-react";

const icons = {
  cpu: Cpu,
  leaf: Leaf,
  settings: Settings2,
  rocket: Rocket,
  research: FlaskConical,
  student: GraduationCap,
  entrepreneur: Lightbulb,
  professional: Briefcase,
  cooperative: Users,
  mentor: UserCheck,
  b2b: Handshake,
  media: Newspaper,
  industry: Factory,
  launch: CalendarCheck,
  deadline: Clock,
  review: Search,
  announce: Megaphone,
  final: Mic,
  award: Award,
  trophy: Trophy,
  check: Check,
  cross: X,
} as const;

export type IconName = keyof typeof icons;

type Props = Omit<LucideProps, "ref"> & { name: IconName };

/** Icônes lucide : trait uniforme (1.75), décoratives par défaut (aria-hidden). */
export function Icon({ name, strokeWidth = 1.75, ...props }: Props) {
  const Cmp = icons[name];
  return <Cmp aria-hidden="true" focusable="false" strokeWidth={strokeWidth} {...props} />;
}
