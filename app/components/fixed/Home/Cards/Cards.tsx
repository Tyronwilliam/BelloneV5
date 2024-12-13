import * as React from "react";
import { CustomCard } from "../../../reusable/Card/CustomCard.tsx";
import { CardCustomItem } from "@/app/components/reusable/Card/CustomCard.ts";

const content: CardCustomItem[] = [
  {
    title: "Fonctionnalité 1",
    description: "1 hour ago",
    content: "Do many thing like",
    list: ["Item 1", "Item 2", "Item 3 "],
    button: { title: "En savoir plus", href: "/", class: "mt-auto" },
  },
  {
    title: "Fonctionnalité 2",
    description: "1 hour ago",
    content: "Do many thing like",
    button: { title: "En savoir plus", href: "/", class: "mt-auto" },
  },
  {
    title: "Fonctionnalité 3",
    description: "2 hours ago",
    content: "Do many thing like",
    list: ["Item 1", "Item 2", "Item 3 "],
    button: { title: "En savoir plus", href: "/", class: "mt-auto" },
  },
  {
    title: "Fonctionnalité 4",
    description: "2 hours ago",
    content: "Do many thing like",
    button: { title: "En savoir plus", href: "/", class: "mt-auto" },
  },
  {
    title: "Fonctionnalité 5",
    description: "2 hours ago",
    content: "Do many thing like",
    list: ["Item 1", "Item 2", "Item 3 "],
    button: { title: "En savoir plus", href: "/", class: "mt-auto" },
  },
];

const Cards = () => {
  return (
    <section className="flex flex-wrap gap-3 items-center justify-center h-fit py-10">
      {content?.map((items, index) => (
        <CustomCard
          custom={items}
          key={index}
          className="w-[30%] h-[372px] flex flex-col"
        />
      ))}
    </section>
  );
};

export default Cards;
