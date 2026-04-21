import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BiChip,
  BiLeaf,
  BiLineChart,
  BiHeart,
  BiStore,
  BiCodeAlt,
  BiMusic,
  BiHeadset,
  BiCartAlt,
  BiGlobe,
} from "react-icons/bi";
import { getCategoryColor } from "./helpers.js";

export const createCustomIcon = (startup) => {
  //Prepare the data

  const industry = startup.industry?.toLowerCase() || "";

  const tags = Array.isArray(startup.tags)
    ? startup.tags.join("").toLowerCase()
    : startup.tags?.toLowerCase() || "";

  let SelectedIcon = BiChip; //Default icon

  //Specific tags first
  if (tags.includes("developer") || tags.includes("code")) {
    SelectedIcon = BiCodeAlt;
  } else if (tags.includes("music")) {
    SelectedIcon = BiMusic;
  } else if (
    tags.includes("augmented") ||
    tags.includes("vr") ||
    tags.includes("game")
  ) {
    SelectedIcon = BiHeadset;
  } else if (
    tags.includes("grocery") ||
    tags.includes("ecommerce") ||
    tags.includes("shop")
  ) {
    SelectedIcon = BiCartAlt;
  }

  //Industry Fallback
  else if (
    industry.includes("energy") ||
    industry.includes("agri") ||
    industry.includes("environment")
  ) {
    SelectedIcon = BiLeaf;
  } else if (
    industry.includes("fin") ||
    industry.includes("saas") ||
    industry.includes("b2b")
  ) {
    SelectedIcon = BiLineChart;
  } else if (industry.includes("health") || industry.includes("bio")) {
    SelectedIcon = BiHeart;
  } else if (industry.includes("consumer")) {
    SelectedIcon = BiStore;
  } else if (industry.includes("enterprise")) {
    SelectedIcon = BiGlobe;
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
