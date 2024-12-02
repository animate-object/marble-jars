export const FormLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-col align-center justify-center">
      {children}
    </div>
  );
};

interface FormContentProps {
  explanation: React.ReactNode;
  children: React.ReactNode;
}
export const FormContent = ({ explanation, children }: FormContentProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center w-full h-3/4">
      <div className="w-full p-8">{explanation}</div>
      <div className="sm:border-e-2 sm:h-3/4 border-slate-300" />
      <div className="w-full p-8">{children}</div>
    </div>
  );
};
