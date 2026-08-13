import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#171717",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 16,
          color: "#f59e0b",
          letterSpacing: "-0.5px",
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
