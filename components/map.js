import React, { useState } from 'react';
import GoogleMapReact from "google-map-react";
import { format } from "date-fns";
import { useRouter } from 'next/router';
import fetchKmzData from '../lib/fetchKmzData';

const xinluIcon = 'data:image/png;base64,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';

const Point = ({ text, isOvernight, lat, lng, isCurrentLocation }) => {
  const router = useRouter();
  return (<div>
    <div className="marker" onClick={() => router.push(`https://maps.google.com/?q=${lat},${lng}`)}/>
    <div className="text">
      {isOvernight && text}
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
        opacity: ${isCurrentLocation ? 0.5 : 1};
        transform: translate(-50%, -50%);
        &:hover {
          z-index: 1;
        }
      }

      .text {
        width: 36px;
        margin-left: 10px;
        background: #ffffffad;
      }
    `}</style>
  </div>);
}

// sorry about the global variables, too lazy for a proper structure :D
let map, maps, geoJsonData, garminData, setIsAnimationOver;
let xinluMarker;

// bigger number = slower animation... animation automatically scales with length of path
const animationMultiplier = 1 / 10;
let animationDurationMs;
let previousTime, startTime;
let previousAnimationPathIndex = 0;
let animationPathLength;
let polyline;
let path;
let lastMapZoomChange;
let currentLocation;

// i wanted to smoothly zoom throughout the animation but google already animating zooming and together
// the animation completely freeze the browser, so i only zoom at the end :'(
const startZoom = 6;
const endZoom = 9;

const calculateAnimationPathLength = () => {
  currentLocation = garminData[garminData.length - 1];
  let minDistance = Infinity;
  let index = 0;

  for (const feature of geoJsonData.features) {
    // reduces work we need to do on every frame later
    feature.properties.startIndex = index;

    if (!feature.geometry.geometries) {
      continue;
    }

    for (const geometry of feature.geometry.geometries) {
      for (const [lng, lat] of geometry.coordinates) {
        const distanceToCurrent = maps.geometry.spherical.computeDistanceBetween({ lat, lng }, currentLocation);

        if (distanceToCurrent <= minDistance) {
          animationPathLength = index;
          minDistance = distanceToCurrent;
        }

        index += 1;
      }
    }

    feature.properties.endIndex = index - 1;
  }
}

const beginAnimation = () => {
  map.setCenter(garminData[1]);
  map.setZoom(startZoom);

  animationDurationMs = animationPathLength * animationMultiplier;

  // already animated once
  if (polyline) {
    polyline.setPath([]);
  } else {
    polyline = new maps.Polyline({
      strokeColor: '#33bb99',
      strokeOpacity: 1.0,
      strokeWeight: 20,
    });
    polyline.setMap(map);
  }

  path = polyline.getPath();

  startTime = previousTime = Date.now();

  // delay only for visual reasons
  setTimeout(animate, 300);
}

const animate = () => {
  const currentTime = Date.now();
  const elapsedMs = currentTime - startTime;

  if (elapsedMs <= animationDurationMs) {
    previousTime = currentTime;

    requestAnimationFrame(animate);
  } else {
    map.setZoom(endZoom);
    setIsAnimationOver(true);
  }

  // 0 at start of animation, 1 at end
  const elapsedProportion = Math.min(1, elapsedMs / animationDurationMs);

  const currentAnimationPathIndex = Math.floor((animationPathLength - 1) * elapsedProportion);

  // here we draw all the lines between previousAnimationPathIndex and currentAnimationPathIndex

  // we can skip ahead to startFeatureIndex rather than going through them all
  const startFeatureIndex = geoJsonData.features.findIndex(feature => feature.properties.endIndex > previousAnimationPathIndex);

  let index = geoJsonData.features[startFeatureIndex].properties.startIndex;
  for (let f = startFeatureIndex; f < geoJsonData.features.length; f++) {
    const feature = geoJsonData.features[f];

    if (!feature.geometry.geometries) {
      continue;
    }

    for (const geometry of feature.geometry.geometries) {
      for (const [lng, lat] of geometry.coordinates) {
        const point = new maps.LatLng(lat, lng);

        if (index > previousAnimationPathIndex) {
          path.push(point);
        }

        index++;

        // check if we've reached final point for this frame of animation, exit loop early if so, after moving map
        if (index >= currentAnimationPathIndex) {
          previousAnimationPathIndex = currentAnimationPathIndex;

          xinluMarker.setPosition(point);

          // if you don't like the zoom effect, replace this if/elseif block with just: map.setCenter(point);
          if (!lastMapZoomChange || (currentTime - lastMapZoomChange) > 100) {
            map.setCenter(point);
            map.setZoom((elapsedProportion * (endZoom - startZoom)) + startZoom);
            lastMapZoomChange = currentTime;

            // important that we don't move the center while the zoom animation (which can't be disabled) is running
          } else if ((currentTime - lastMapZoomChange) > 100) {
            map.setCenter(point);
          }

          return;
        }
      }
    }
  }
};

function handleApiLoaded(gMap, gMaps) {
  map = gMap;
  maps = gMaps;

  xinluMarker = new maps.Marker({
    position: garminData[garminData.length - 1],
    map,
    icon: xinluIcon,
    zIndex: 107,
  });
}


export function GoogleMap({ data }) {
  console.log(data);
  garminData = data;
  data = data.filter((d) => d.lat && d.lng);
  const [isAnimationOver, _setIsAnimationOver] = useState(true);
  setIsAnimationOver = _setIsAnimationOver;
  const center = data[data.length - 1];

  return (
    <div style={{ height: "400px", width: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: ".5rem",
          left: ".5rem",
          zIndex: 99999,
          padding: ".5rem",
          height: "40px",
          borderRadius: ".125rem",
          background: "white",
          cursor: isAnimationOver ? 'pointer' : 'wait',
          boxShadow: "rgb(0 0 0 / 30%) 0px 1px 4px -1px",
          color: isAnimationOver ? 'black' : 'grey',
        }}
        onClick={async () => {
          if (!isAnimationOver) {
            return;
          }

          setIsAnimationOver(false);

          if (!geoJsonData) {
            geoJsonData = await fetchKmzData();

            map.data.addGeoJson({
              ...geoJsonData,
              features: geoJsonData.features.filter(feature => Boolean(feature.geometry.geometries)),
            });

            calculateAnimationPathLength();
          }

          beginAnimation();
        }}
      >
        Show Trail
      </div>
      <GoogleMapReact
        bootstrapURLKeys={{
          key:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
            "AIzaSyBEmvXDy3psi4iLtuoO9DsQecRGgahm4K0",
          libraries: ['geometry'],
        }}
        defaultCenter={center}
        defaultZoom={endZoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {isAnimationOver && data
          .filter((d) => d.lat && d.lng)
          .map((d, idx) => (
            <Point
              key={idx}
              lat={d.lat}
              lng={d.lng}
              text={format(d.timestamp, "MMM d")}
              isOvernight={d.message?.includes("for the night")}
              isCurrentLocation={idx === data.length - 1}
            />
          ))}
      </GoogleMapReact>
    </div>
  );
}

export default GoogleMap;
