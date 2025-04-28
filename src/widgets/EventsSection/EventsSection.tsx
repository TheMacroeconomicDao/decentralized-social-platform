import { EventCard } from "@/entities/EventCard/EventCard";
import cls from "./EventsSection.module.scss";

export const EventsSection = () => {
  return (
    <div className={cls.EventsSection}>
      <h2>Events</h2>
      <div className={cls.Wrapper}>
        {data.map((e) => (
          <EventCard
            key={e.id}
            imageSrc={e.imageSrc}
            date={e.date}
            title={e.title}
            description={e.description}
            link={e.link}
          />
        ))}
      </div>
    </div>
  );
};

const data = [
  {
    id: 1,
    imageSrc: "/images/events/163.png",
    date: "",
    title: "Invest Event",
    description:
      "Wake Up Africa. Private Technical Party for invited guests We will publish the main topics of the event and invited guests and artists in the near future.",
    link: "/",
  },
  {
    id: 2,
    imageSrc: "/images/events/164.png",
    date: "",
    title: "Invest Event",
    description: "Technical Night in Dubai. Hello, Gyber Party. We will publish the main topics of the event and invited guests and artists in the near future",
    link: "/",
  },
  {
    id: 3,
    imageSrc: "/images/events/165.png",
    date: "",
    title: "Invest Event",
    description: "Cybernat Community in Berlin Welcome Party",
    link: "/",
  },
  {
    id: 4,
    imageSrc: "/images/events/166.png",
    date: "",
    title: "Invest Event",
    description: "Soon to be determined by the community",
    link: "/",
  },
];