import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { BiChip, BiLeaf, BiLineChart, BiHeart } from "react-icons/bi";
import { getCategoryColor } from "./helpers.js";

export const createCustomIcon = (startup) => {
  let SelectedIcon = BiChip;
  const industry = startup.industry?.toLowerCase() || "";

  if (industry.includes("energy") || industry.includes("agriculture")) {
    SelectedIcon = BiLeaf;
  } else if (industry.includes("fin") || industry.includes("saas")) {
    SelectedIcon = BiLineChart;
  } else if (industry.includes("health")) {
    SelectedIcon = BiHeart;
  }

  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        color: getCategoryColor(startup.category),
        fontSize: "24px",
        display: "flex",
        filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
      }}
    >
      <SelectedIcon />
    </div>,
  );

  return L.divIcon({
    html: iconMarkup,
    className: "industry-icon-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -25],
  });
};
