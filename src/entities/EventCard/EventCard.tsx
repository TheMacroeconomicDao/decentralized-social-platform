import { Button, ThemeButton } from "@/shared/ui/Button/Button";
import cls from "./EventCard.module.scss";
import Image from "next/image";

interface EventCardProps {
  imageSrc: string;
  date?: string;
  title: string;
  description: string;
  link?: string;
}

function formatDate(date: string | undefined): string {
  if (date) {
    return (
      date.substring(0, date.length - 4) +
      "| " +
      date.substring(date.length - 4)
    );
  }
  return "date not specified";
}

export const EventCard = (props: EventCardProps) => {
  const { imageSrc, date, title, description, link } = props;
  return (
    <div className={cls.EventCard}>
      <div className={cls.Image}>
        <Image
          src={imageSrc}
          fill
          alt={title}
          style={{
            objectFit: "cover",
            objectPosition: "bottom",
          }}
          sizes="(max-width: 768px) 100vw"
        />
      </div>
      <span>{formatDate(date)}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={cls.buttonWrapper}>
        <Button theme={ThemeButton.ORANGE} disabled>
          Jump to event
        </Button>
      </div>
    </div>
  );
};
