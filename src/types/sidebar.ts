// Define props for icon components
export interface IconProps {
  fill: string;
  innerFill?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

// Define the structure for sidebar items
export interface SidebarItem {
  id: number;
  name: string;
  path: string;
  icon: React.ReactNode;
  sec: React.ReactNode;
  hover: React.ReactNode;
}
