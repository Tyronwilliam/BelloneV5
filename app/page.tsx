import * as React from "react";
import Header from "./components/fixed/Header/Header.tsx";
import Intro from "./components/fixed/Home/Intro/Intro.tsx";
import Cards from "./components/fixed/Home/Cards/Cards.tsx";
import Footer from "./components/fixed/Footer/Footer.tsx";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl  w-full min-h-full">
      <Header />
      <Intro />
      <Cards />
      <Footer />
    </main>
  );
}
