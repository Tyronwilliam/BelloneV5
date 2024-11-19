export type CardCustomItem = {
  title: string;
  description: string;
  content: string;
  list?: String[];
  button?: ButtonCard;
};

type ButtonCard = {
  title: string;
  href: string;
  class: string;
};
