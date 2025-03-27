import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapSection = () => {
  const mapStyle = {
    height: "500px",
    width: "100%",
  };
  const position = [20.8664331, 106.6927293]; // TTP Logistics address
  //   const position = [51.505, -0.09]; // Example Address

  return (
    <>
      <MapContainer
        center={position}
        zoom={16}
        style={mapStyle}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Công ty TNHH Giao Nhận T.T.P</Popup>
        </Marker>
      </MapContainer>
    </>
  );
};

export default MapSection;
