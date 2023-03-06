import React, { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import Layout from "../Layout/Layout";
import { LayersControl, MapContainer, Marker, TileLayer } from "react-leaflet";
import { GeoJSONLayer } from "../Map Layer/GeoJSONLayer";
import { SideBar } from "../Layout/SidebarNav";
import ResetViewControl from "@20tab/react-leaflet-resetview";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch, useSelector } from "react-redux";
import { slidebarAction } from "../../store/Slices/uiSlice";
import Markers from "../UI/Marker";
import MarkersClone from "../UI/MarkersClone";
import Dashboard from "../../Sidebar/dashboard";
import Incident from "../../Sidebar/incident";
import DamageLoss from "../../Sidebar/damageLoss";
import RiskInfo from "../../Sidebar/riskinfo";
import { LiveData } from "../../Sidebar/realtime";
import ReportAnAncident from "../../Sidebar/reportIncident";
import DataArchieve from "../../Sidebar/dataArchive";
import Situation from "../../Sidebar/situation";
import Feedback from "@mui/icons-material/Feedback";
import MarkerClusterGroup from "react-leaflet-cluster";
import { DamageAndLossLegend } from "../Legends/Legend";
import {
  DASHBOARD,
  INCIDENT,
  DAMAGELOSS,
  RISKINFO,
  REALTIME,
  REPORT,
  DATA,
  SITUATION,
  FEEDBACK,
} from "./../../store/constant";
import { DashboardLegend, RealTimeLegend } from "../Legends/Legend";
export const Portal = () => {
  const [reportActivated, setReportActivated] = useState(false);
  const dispatch = useDispatch();
  var [jsonLalitpurMetro, setJsonLalitpurMetro] = useState("");
  var [jsonWard, setJsonWard] = useState("");
  const [currentdamageindex, setdamageindex] = useState("incident");
  const totalIncident = useSelector((state) => {
    return state.damageloss.totalIncident;
  });
  const totalEstimatedLoss = useSelector((state) => {
    return state.damageloss.totalEstimatedLoss;
  });
  const totalPeopleDeath = useSelector((state) => {
    return state.damageloss.totalPeopledeath;
  });
  const totalInfrastructureDamage = useSelector((state) => {
    return state.damageloss.totalInfrastrucutre;
  });
  const slidebarState = useSelector((state) => {
    return state.slidebar.slidebarState;
  });
  const component = useSelector((state) => {
    return state.component;
  });
  const changeReportState = () => {
    setReportActivated(!reportActivated);
  };
  console.log(reportActivated);
  const changeComponent = (compName) => {
    switch (compName) {
      case DASHBOARD:
        return <Dashboard />;
      case INCIDENT:
        return <Incident />;
      case DAMAGELOSS:
        return <DamageLoss />;
      case RISKINFO:
        return <RiskInfo />;
      case REALTIME:
        return <LiveData />;
      case REPORT:
        return <ReportAnAncident />;
      case DATA:
        return <DataArchieve />;
      case SITUATION:
        return <Situation />;
      case FEEDBACK:
        return <Feedback />;
      default:
        return <Dashboard />;
    }
  };

  const ComponentToRender = changeComponent(component);
  const metroJSON = async () => {
    let data = await fetch(
      "http://127.0.0.1:8000/api/v1/spatial/lalitpurMetro/"
    );
    let datajson = await data.json();
    setJsonLalitpurMetro(datajson);
  };
  const wardJSON = async () => {
    let data = await fetch("http://127.0.0.1:8000/api/v1/spatial/ward/");
    let datajson = await data.json();
    setJsonWard(datajson);
  };
  const changeSlidebarState = () => {
    dispatch(slidebarAction.changeSlidebarState());
  };

  useEffect(() => {
    metroJSON();
    wardJSON();
  }, []);

  //disaster selector
  const datadisaster = useSelector((state) => state.disaster.data);
  const realtimedatawater = useSelector((state) => state.live.water);
  const realtimepollution = useSelector((state) => state.live.pollution);
  const dataIncident = useSelector((state) => state.disasterIncident.data);
  const position = [27.67571580617923, 85.3183283194577];
  let disasterinDashboard = [
    ...new Set(datadisaster.map((data) => data?.type?.title)),
  ];
  const scrollWheelZoom = true;
  const getColor = (d) => {
    return d > 90
      ? "#800026"
      : d > 80
      ? "#BD0026"
      : d > 60
      ? "#E31A1C"
      : d > 40
      ? "#FC4E2A"
      : d > 20
      ? "#FD8D3C"
      : d >= 0
      ? "#FEB24C"
      : "#FEB24C";
  };
  const styleFeature = (feature) => {
    let currentLegendItem = currentdamageindex;
    let data = 0;
    if (currentLegendItem === "incident") {
      data = feature.properties.number_of_disasters / totalIncident;
    } else if (currentLegendItem === "peopleDeath") {
      data = feature.properties.total_people_death / totalPeopleDeath;
    } else if (currentLegendItem === "estimatedLoss") {
      data = feature.properties.total_estimated_loss / totalEstimatedLoss;
    } else if (currentLegendItem === "infrastructuredestroyed") {
      data =
        feature.properties.total_infrastructure / totalInfrastructureDamage;
    } else {
      data = feature.properties.number_of_disasters;
    }
    return {
      fillColor: getColor(data),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };
  return (
    <Layout>
      {reportActivated ? (
        <div className="absolute  w-[100%] h-[100%] z-[25] backdrop-brightness-[0.6] "></div>
      ) : null}
      <div className="flex">
        <div
          className={`${
            slidebarState ? "w-2/5" : "w-0"
          } duration-300 h-[90vh] relative`}
        >
          {ComponentToRender}
          <NavigateNextIcon
            style={{
              maxWidth: "30px",
              maxHeight: "50px",
              minWidth: "30px",
              minHeight: "50px",
            }}
            className={`
              bg-white absolute cursor-pointer -right-[30px] top-1/2 w-7 border-2 z-20  ${
                slidebarState ? "rotate-180 rounded-l-lg" : "rounded-r-lg"
              }`}
            onClick={changeSlidebarState}
          />
        </div>
        <MapContainer
          center={position}
          zoom={14}
          scrollWheelZoom={scrollWheelZoom}
          className="mt-1 z-10"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="OSM Streets">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="World Imagery">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked name="Grey Imagery">
              <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
            </LayersControl.BaseLayer>
            {jsonLalitpurMetro ? (
              <GeoJSONLayer
                data={jsonLalitpurMetro}
                name="Lalitpur Metropolitian City"
              />
            ) : (
              ""
            )}
            {jsonWard ? (
              <GeoJSONLayer
                data={jsonWard}
                checked
                name="Lalitpur Metropolitian Ward"
              />
            ) : (
              ""
            )}
          </LayersControl>
          <ResetViewControl title="Reset view" position="topright" />
          {component === DAMAGELOSS && (
            <GeoJSON data={jsonWard} style={styleFeature} />
          )}
          <MarkerClusterGroup>
            {component === DASHBOARD
              ? datadisaster.map((event) => {
                  return <Markers disaster={event} key={event.id} />;
                })
              : ""}
            {component === INCIDENT
              ? dataIncident.map((event) => {
                  return <Markers disaster={event} key={event.id} />;
                })
              : ""}
          </MarkerClusterGroup>
          {component === REALTIME
            ? realtimedatawater.map((event) => {
                console.log("realwater marker");
                return <MarkersClone disaster={event.results} key={event.id} />;
              })
            : ""}
          {component === REALTIME
            ? realtimepollution.map((event) => {
                console.log("realpoll marker");
                return <MarkersClone disaster={event.results} key={event.id} />;
              })
            : ""}
          {component === REALTIME && <RealTimeLegend />}
          {component === DASHBOARD && (
            <DashboardLegend legendItem={disasterinDashboard} />
          )}
          {component === DAMAGELOSS && (
            <DamageAndLossLegend changeDamagestate={setdamageindex} />
          )}
        </MapContainer>
        <SideBar changeReportState={changeReportState} />
        {reportActivated ? (
          <ReportAnAncident setReportActivated={setReportActivated} />
        ) : (
          ""
        )}
      </div>
    </Layout>
  );
};
export default Portal;
