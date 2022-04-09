import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { useGarminLogData } from "../lib/data";
import ReactTooltip from "react-tooltip";
import { format } from "date-fns";

const Point = ({ text, isOvernight }) => (
  <div>
    <div className="marker" />
    <div className="text">
      {isOvernight && `${text} 💤`}
    </div>
    <style jsx>{`
      .marker {
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${isOvernight ? "18px" : "12px"};
        height: ${isOvernight ? "18px" : "12px"};
        background-color: ${isOvernight ? "#c000ff" : "#008aff"};
        border: 2px solid #fff;
        border-radius: 100%;
        user-select: none;
        cursor: pointer;
        transform: translate(-50%, -50%);
        &:hover {
          z-index: 1;
        }
      }

      .text {
        width: 50px;
        margin-left: 10px;
        background: #ffffffad;
      }
    `}</style>
  </div>
);

function handleApiLoaded(map, maps) {
  const kmzLayer = new google.maps.KmlLayer("/stelprdb5332130.kmz");
  kmzLayer.setMap(map);
}

export function GoogleMap({ data }) {
  console.log(data);
  data = data.filter((d) => d.lat && d.lng);
  const center = data[data.length - 1];
  const defaultZoom = 12;

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
            "AIzaSyBEmvXDy3psi4iLtuoO9DsQecRGgahm4K0",
        }}
        defaultCenter={center}
        defaultZoom={defaultZoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {data
          .filter((d) => d.lat && d.lng)
          .map((d, idx) => (
            <Point
              key={idx}
              lat={d.lat}
              lng={d.lng}
              text={format(d.timestamp, "MMM d")}
              isOvernight={d.message?.includes("for the night")}
            />
          ))}
      </GoogleMapReact>
    </div>
  );
}

export default GoogleMap;
