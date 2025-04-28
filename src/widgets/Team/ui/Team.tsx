import cls from "./Team.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { CardMember } from "@/entities/CardMember";
import data from "../data/teams";

interface TeamProps {
  className?: string;
}

export const Team = ({ className = "" }: TeamProps) => {
  const title = "Our Team";
  return (
    <div className={classNames(cls.Team, {}, [className])}>
      <h2>{title}</h2>
      <div className={cls.wrapper}>
        {data.map((el) => (
          <CardMember
            key={el.id}
            avatarSrc={el.avatarSrc}
            fullName={el.fullName}
            skills={el.skills}
            link={el.link}
          />
        ))}
      </div>
    </div>
  );
};
