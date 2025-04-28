import { Button, ThemeButton } from "@/shared/ui/Button/Button";
import cls from "./Products.module.scss";

export const Products = () => {
  return (
    <div className={cls.Products}>
      <h2>Products</h2>
      <h3>Chat GPT</h3>
      <p>
        AiC is an open community that unites people interested in the
        development and use of artificial intelligence models in the blockchain
        environment. Using DAO contracts, we ensure transparency, security and
        openness of the process of developing and using AI models. In AiC, you
        can share knowledge, experience and create models with minimal costs. We
        are building a platform for creating models in both commercial and
        non-commercial spheres, such as medicine, finance, transport and many
        others. Join us and become part of the revolution in the development and
        use of artificial intelligence! You will be able to touch our products on this page.
      </p>
      <div className={cls.buttonWrapper}>
        <Button theme={ThemeButton.BLUE} disabled>
          Try it
        </Button>
      </div>
    </div>
  );
};
