import cls from "./TechnicalRoadmap.module.scss";
import { Card } from "../card/Card";
import { data } from "../../data/TechnicalRoadmapData";

export const TechnicalRoadmap = () => {
    return (
        <div className={cls.TechnicalRoadmap}>
            {data.map((stage) => (
                <Card key={stage.id} id={stage.id} items={stage.items} />
            ))}
        </div>
    );
};
