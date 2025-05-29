// src/components/CustomImage.tsx (hoặc components/CustomImage.tsx)

import React from "react";

// Định nghĩa các props mà component này sẽ nhận
// Chúng ta sẽ cố gắng bắt chước các props quen thuộc của next/image
interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt = "", // Luôn có alt để tốt cho SEO và khả năng truy cập
  width,
  height,
  style,
  fill,
  ...rest // Nhận tất cả các props còn lại (vd: className)
}) => {
  if (!src) {
    // Nếu không có src, trả về null hoặc một ảnh placeholder
    return null;
  }

  // Xử lý logic cho prop 'fill' giống như trong next/image
  const fillStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover", // hoặc 'contain', tùy bạn
      }
    : {};

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      // Kết hợp style từ prop và fillStyle
      style={{ ...style, ...fillStyle }}
      // Thêm lại tính năng lazy loading
      loading="lazy"
      {...rest}
    />
  );
};

export default CustomImage;
