import { ReactNode } from "react";

const Entete = ({ word, children }: { word?: string; children: ReactNode }) => {
  return (
    <section className="flex flex-col mt-4 space-y-4 gap-4">
      {word && <h1 className="text-5xl font-bold">{word}</h1>}
      {children}
    </section>
  );
};

export default Entete;
