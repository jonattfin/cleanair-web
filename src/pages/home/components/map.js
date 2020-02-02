import React from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet'
import { IconNames } from "@blueprintjs/icons";
import { Colors } from "@blueprintjs/core";

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.css';

export default (props) => (
  <LeafletMap style={{ height: '100vh', width: '100vw' }} center={props.center} zoom={13} maxZoom={18} minZoom={7}>
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <MarkerClusterGroup>
      {props.data.map((item, index) => (
        <Marker
          key={index}
          position={item.position}
          icon={getIcon(item.color)}>
          <Popup maxWidth="480px">
            <div style={{ height: "100px", minWidth: "100px" }}>
              {item.value}
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  </LeafletMap>
)

function getIcon(color) {

  const markerHtmlStyles = (color, bgColor) => `
    background-color: ${color};
    border: 1px solid ${bgColor};
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    left: -1.1rem;
    position: relative;
    transform: rotate(45deg);
  `;

  const html = `
    <div/>
      <span style="${markerHtmlStyles(color, Colors.GOLD5)}"/>
    </div>
  `;

  return L.divIcon({
    className: IconNames.ADD,
    iconAnchor: [0, 24],
    html: html,
  })
}

