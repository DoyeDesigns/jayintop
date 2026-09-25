type PageBackgroundProps = {
  color?: string;
  image?: string;
};

export function PageBackground({ color, image }: PageBackgroundProps) {
  return (
    <div
      aria-hidden
      className="page-background"
      style={{
        backgroundColor: color,
        backgroundImage: image ? `url("${image.replaceAll('"', "%22")}")` : "none",
      }}
    />
  );
}
