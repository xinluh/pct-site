import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { useGarminLogData } from "../lib/data";
import ReactTooltip from "react-tooltip";

const Point = ({ text }) => (
  <div>
    <div className="marker" />
    <style jsx>{`
      .marker {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 18px;
        height: 18px;
        background-color: #000;
        border: 2px solid #fff;
        border-radius: 100%;
        user-select: none;
        cursor: pointer;
        transform: translate(-50%, -50%);
        &:hover {
          z-index: 1;
        }
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
  const center = data[data.length - 1];
  const defaultZoom = 12;

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBEmvXDy3psi4iLtuoO9DsQecRGgahm4K0" }}
        defaultCenter={center}
        defaultZoom={defaultZoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {data.map((d, idx) => (
          <Point key={idx} lat={d.lat} lng={d.lng} text={d.message} />
        ))}
      </GoogleMapReact>
    </div>
  );
}

export default GoogleMap;
