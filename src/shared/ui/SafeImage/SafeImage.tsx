import Image, { ImageProps } from "next/image";

export const SafeImage = ({ alt = "", ...props }: ImageProps) => (
  <Image {...props} alt={alt} draggable={false} />
); 