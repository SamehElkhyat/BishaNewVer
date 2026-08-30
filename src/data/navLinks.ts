// Canonical primary navigation, shared by the Header and the Footer's
// "روابط سريعة" column so the two never drift out of sync.
export interface NavLink {
  href: string;
  label: string;
  id?: string;
  hasDropdown?: boolean;
  external?: boolean;
  dropdownItems?: Array<{
    href: string;
    label: string;
  }>;
}

export const baseNavLinks: NavLink[] = [
  { href: "/services", label: "الخدمات الالكترونية" },
  { id: "about", href: "/about", label: "عن الغرفة" },
  { href: "/activities", label: "فعاليات الغرفة" },
  { href: "/media-center", label: "المركز الاعلامي" },
  { href: "/circulars", label: "التعاميم" },
  {
    id: "survey",
    href: "#",
    label: "الاستبيان",
    hasDropdown: true,
    dropdownItems: [
      {
        href: "https://docs.google.com/forms/d/e/1FAIpQLSeOpj_Digc9YrY3cATwVG0Rl6Q_K5uY7TnyTW5PSgM9hx7zOA/viewform",
        label: "استبيان مدى رضا المشتركين عن الخدمات",
      },
      {
        href: "https://docs.google.com/forms/d/e/1FAIpQLSewW99vPZQY5HTbt-b4rK3DaRxUP6MWkrYkB2OF23XmjQiHoQ/viewform",
        label: "استبيان اللجان القطاعية",
      },
    ],
  },
  { href: "/contact", label: "اتصل بنا" },
  { href: "/voting-auth", label: "الجمعية العمومية" },
];
