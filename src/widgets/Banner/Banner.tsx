import Image from "next/image";

import cls from "./Banner.module.scss";

export const Banner = () => {
  return (
    <div className={cls.Banner}>
      <Image
        src={"/images/slides/test-banner2.png"}
        width={3000}
        height={1000}
        alt="banner"
        className={cls.BannerImage}
      />
    </div>
  );
};
