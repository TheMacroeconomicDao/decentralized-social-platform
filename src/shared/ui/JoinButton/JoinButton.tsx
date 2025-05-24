import ExternalLink, { ThemeExternalLink } from "../ExternalLink/ExternalLink";
import { Button, ThemeButton } from "../Button/Button";
import cls from "./JoinButton.module.scss";

interface JoinButtonProps {
  className?: string;
  href?: string;
  theme?: ThemeExternalLink;
  buttonTheme?: ThemeButton | null;
  children?: React.ReactNode;
  target?: "_blank" | "_self";
}

export const JoinButton = ({ 
  className = "",
  href = "https://t.me/HeadsHub",
  theme = ThemeExternalLink.BLUE,
  buttonTheme = ThemeButton.GREEN,
  children = "Join",
  target = "_blank"
}: JoinButtonProps) => {
  return (
    <div className={`${cls.buttonWrapper} ${className}`}>
      <ExternalLink href={href} theme={theme} target={target}>
        {buttonTheme ? (
          <Button theme={buttonTheme}>{children}</Button>
        ) : (
          children
        )}
      </ExternalLink>
    </div>
  );
}; 