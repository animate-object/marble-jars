interface Props {
  children: React.ReactNode;
}

export const FullScreenVerticalContainer = ({ children }: Props) => {
  return (
    <div className="flex flex-col justify-between items-center h-screen w-screen absolute">
      {children}
    </div>
  );
};
