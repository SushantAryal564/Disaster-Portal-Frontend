import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import { SideBar } from "../Layout/SidebarNav";
import { Lalitpur } from "./../../Data/Lalitpur";
import { LalitpurAdmin } from "./../../Data/LalitpurLocal";
import { LalitpurOda as LalitpurWard } from "./../../Data/LalitpurOda";
import { GeoJSONLayer } from "../Map Layer/GeoJSONLayer";
import ResetViewControl from "@20tab/react-leaflet-resetview";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
export const Portal = () => {
  const [open, setOpen] = useState(false);
  const position = [27.568061, 85.378218];
  const scrollWheelZoom = true;
  return (
    <Layout>
      <div className="flex">
        <div
          className={`${open ? "w-2/4" : "w-0"} duration-300 h-[90vh] relative`}
        >
          <NavigateNextIcon
            style={{
              maxWidth: "30px",
              maxHeight: "50px",
              minWidth: "30px",
              minHeight: "50px",
            }}
            className={`
              bg-white absolute cursor-pointer -right-[30px] top-1/2 w-7 border-2 z-50  ${
                open ? "rotate-180 rounded-l-lg" : "rounded-r-lg"
              }`}
            onClick={() => setOpen(!open)}
          />
        </div>
        <MapContainer
          center={position}
          zoom={11}
          scrollWheelZoom={scrollWheelZoom}
          className="mt-1 z-10"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OSM Streets">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="World Imagery">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </LayersControl.BaseLayer>
            <GeoJSONLayer data={Lalitpur} name="Lalitpur" />
            <GeoJSONLayer
              data={LalitpurAdmin}
              name="Lalitpur Adminstrative Boundary"
            />
            <GeoJSONLayer data={LalitpurWard} name="Lalitpur Ward Boundary" />
          </LayersControl>
          <ResetViewControl
            title="Reset view"
            icon="url(/some/relative/path.png)"
            position="topright"
          />
        </MapContainer>
        <SideBar />
      </div>
    </Layout>
  );
};
export default Portal;
