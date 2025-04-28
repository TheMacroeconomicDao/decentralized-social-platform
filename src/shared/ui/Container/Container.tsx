import cls from "./Container.module.scss";
import { FC, ReactNode } from "react";
interface ContainerProps {
  children: ReactNode;
}

export const Container: FC<ContainerProps> = ({ children }) => {
  return <div className={cls.container}>{children}</div>;
};
