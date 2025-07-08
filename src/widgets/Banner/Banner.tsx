import { SafeImage } from "@/shared/ui/SafeImage";

import cls from "./Banner.module.scss";

export const Banner = () => {
  return (
    <div className={cls.Banner}>
      <SafeImage
        src={"/images/slides/test-banner2.png"}
        width={3000}
        height={1000}
        alt="banner"
        className={cls.BannerImage}
      />
    </div>
  );
};
