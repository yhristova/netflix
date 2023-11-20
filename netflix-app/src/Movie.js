export const Movie = ({ url, alt }) => (
  <img
    src={url}
    alt={alt}
    width="100%"
    style={{ objectFit: "contain", minHeight: 100 }}
  />
);
