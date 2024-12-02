import { Navbar } from "react-daisyui";

interface Props {
  children: React.ReactNode;
}

export const AppNavBar = ({ children }: Props) => {
  return <Navbar className="flex bg-gray-200 p-4">{children}</Navbar>;
};
