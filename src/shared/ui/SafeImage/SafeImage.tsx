import Image, { ImageProps } from "next/image";

export const SafeImage = (props: ImageProps) => (
  <Image {...props} draggable={false} />
); 