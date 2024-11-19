"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import IntroImg from "@/app/assets/intro.jpg";
const Intro = () => {
  const introContent = [
    {
      h1: "La solution gestion de projet et client  pour booster votre productivité",
      p: "Un seul outil pour gérer votre relation client et plus encore.",
      but: { title: "Commencer gratuitement", href: "/login" },
    },
  ];

  return (
    <section className="flex flex-col justify-between w-full items-center py-10 px-3 gap-8 lg:flex-row lg:justify-center  ">
      <div className="flex flex-col justify-between items-center gap-7 lg:max-w-[45%] lg:items-start ">
        {introContent?.map((item) => (
          <React.Fragment key={item.h1}>
            <h1 className="text-5xl	text-center lg:text-left leading-tight			">
              {item.h1}
            </h1>
            <p>{item.p}</p>
            <Button asChild className="w-fit text-2xl p-10 " variant="outline">
              <Link href={item.but.href}>{item.but.title}</Link>
            </Button>
          </React.Fragment>
        ))}
      </div>
      <div className="w-1/2 relative flex-shrink max-w-[400px]">
        <Image src={IntroImg} alt="preview app" />
      </div>
    </section>
  );
};

export default Intro;
