import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardExtend from "../../components/common/ComponentCardExtend";
import PageMeta from "../../components/common/PageMeta";
import React, { useState, useEffect, useCallback, FC } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

// Declare type of Coordinates for geometry
type LatLngTuple = [number, number];

const MapClickHandler: React.FC<{
  onMapClick: (latlng: L.LatLng) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const Tracking: React.FC = () => {
  const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<L.LatLng | null>(null);

  // process map click
  const handleMapClick = (latlng: L.LatLng) => {
    console.log("Map clicked at: ", latlng);
    if (!startPoint) {
      setStartPoint(latlng);
      setEndPoint(null);
    } else if (!endPoint) {
      setEndPoint(latlng);
      console.log(`Start and End points selected. Ready to fetch route.`);
    } else {
      setStartPoint(latlng);
      setEndPoint(null);
    }
  };

  const clearPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
  };

  const mapStyle = {
    height: "90vh",
    width: "100%",
  };

  const position: LatLngExpression = [20.8664331, 106.6927293];

  return (
    <div>
      <p>
        Click on map to select the starting point, click again to select the
        ending point
      </p>
      <div>
        <button
          type="button"
          className="my-3 bg-red-600 p-3 rounded-lg text-white hover:bg-red-900"
          onClick={clearPoints}
        >
          Clear points
        </button>
      </div>
      {startPoint && (
        <p>
          Start point: {startPoint.lat.toFixed(5)}, {startPoint.lat.toFixed(5)}
        </p>
      )}
      {endPoint && (
        <p>
          End point: {endPoint.lat.toFixed(5)}, {endPoint.lat.toFixed(5)}
        </p>
      )}
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
        <MapClickHandler onMapClick={handleMapClick} />
        {startPoint && (
          <Marker position={startPoint}>
            <Popup>Điểm Bắt Đầu</Popup>
          </Marker>
        )}
        {endPoint && (
          <Marker position={endPoint}>
            <Popup>Điểm Kết Thúc</Popup>
          </Marker>
        )}
        <Marker position={position}>
          <Popup>Công ty TNHH Giao Nhận T.T.P</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Tracking;
