"use client";
import * as React from "react";

import { BellIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardCustomItem } from "./CustomCard";
import Link from "next/link";
export type CardProps = React.ComponentProps<typeof Card> & {
  custom: CardCustomItem;
};

export function CustomCard({ className, custom, ...props }: CardProps) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>{custom.title}</CardTitle>
        <CardDescription>{custom.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {custom?.content}

        {custom?.list !== undefined && (
          <ul className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            {custom?.list?.map((item, index) => (
              <React.Fragment key={index}>
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <li> {item}</li>
              </React.Fragment>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter
        className={` ${custom?.button !== undefined && custom?.button?.class}`}
      >
        {custom?.button !== undefined && (
          <Button className={`w-full ${custom?.button?.class}`} asChild>
            <Link href={custom?.button?.href}>{custom?.button?.title}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
