import { Button, ThemeButton } from "../Button/Button";
import BurgerIcon from "../SvgIcons/BurgerIcon/Burger";
import cls from "./BurgerButton.module.scss";

interface BurgerButtonProps {
  isShow: (isShow: boolean) => void;
  close: boolean;
}

const BurgerButton = ({ isShow, close }: BurgerButtonProps) => {
  const handleClick = () => {
    isShow(!close);
  };
  return (
    <Button
      className={cls.BurgerBtn}
      onClick={handleClick}
      theme={ThemeButton.BLUE}
    >
      <BurgerIcon active={close} />
    </Button>
  );
};

export default BurgerButton;
