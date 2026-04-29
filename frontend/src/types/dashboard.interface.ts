// Single Nav Item
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: string[];
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
