import { TechnicalRoadmap } from "@/entities/TechnicalRoadmap";
import cls from "./TechnicalRoadmapSection.module.scss";

export const TechnicalRoadmapSection = () => {
  return (
    <div className={cls.Wrapper}>
      <h2>Technical Roadmap</h2>
      <TechnicalRoadmap />
    </div>
  );
};
