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
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

// Declare type of Coordinates for geometry
type LatLngTuple = [number, number];

interface OsrmRoute {
  geometry: { coordinates: [number, number][]; type: string };
  distance: number;
  duration: number;
}

interface OsrmResponse {
  code: string;
  routes: OsrmRoute[];
}

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

  const [routeGeometry, setRouteGeometry] = useState<LatLngTuple[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loadingRoute, setLoadingRoute] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // process map click
  const handleMapClick = (latlng: L.LatLng) => {
    setRouteGeometry([]);
    setDistance(null);
    setDuration(null);
    setRouteError(null);
    if (!startPoint) {
      setStartPoint(latlng);
      setEndPoint(null);
    } else if (!endPoint) {
      setEndPoint(latlng);
      // console.log(`Start and End points selected. Ready to fetch route.`);
    } else {
      setStartPoint(latlng);
      setEndPoint(null);
    }
  };

  useEffect(() => {
    // Chỉ chạy khi có cả 2 điểm
    if (startPoint && endPoint) {
      const getRoute = async () => {
        setLoadingRoute(true); // Bắt đầu loading
        setRouteError(null); // Xóa lỗi cũ

        // OSRM dùng {lon},{lat}
        const startCoords = `${startPoint.lng},${startPoint.lat}`;
        const endCoords = `${endPoint.lng},${endPoint.lat}`;
        const apiUrl = `https://router.project-osrm.org/route/v1/car/${startCoords};${endCoords}?overview=full&geometries=geojson`;

        try {
          const response = await fetch(apiUrl);
          const data: OsrmResponse = await response.json();

          if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
            throw new Error("Route not found");
          }

          const route = data.routes[0];

          const leafletCoords: LatLngTuple[] = route.geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
          );
          setRouteGeometry(leafletCoords);
          setDistance(route.distance);
          setDuration(route.duration);
        } catch (err: any) {
          console.error(err);
          setRouteError(err.message || "Lỗi không xác định.");
          setRouteGeometry([]); // Xóa route nếu lỗi
          setDistance(null);
          setDuration(null);
        } finally {
          setLoadingRoute(false);
        }
      };
      getRoute(); // Gọi hàm lấy lộ trình
    }
    // Dependency: chạy lại khi startPoint hoặc endPoint thay đổi
  }, [startPoint, endPoint]);

  const clearPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRouteGeometry([]);
    setDistance(null);
    setDuration(null);
    setRouteError(null);
    setLoadingRoute(false);
  };

  const formatDuration = (sec: number): string => {
    if (isNaN(sec) || sec < 0) return "N/A";
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = Math.floor(sec % 60);
    return `${hours > 0 ? hours + "h - " : ""}${minutes}m-${seconds}s`;
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
          Start point: {startPoint.lng}, {startPoint.lat}
        </p>
      )}
      {endPoint && (
        <p>
          End point: {endPoint.lng}, {endPoint.lat}
        </p>
      )}

      {loadingRoute && <p>Đang tìm đường...</p>}
      {routeError && <p style={{ color: "red" }}>Lỗi: {routeError}</p>}

      {/* Hiển thị thông tin kết quả (Sẽ thêm ở Bước 4) */}
      {distance !== null && (
        <div>
          <p>Khoảng cách: {(distance / 1000).toFixed(2)} km</p>
          {duration !== null && (
            <p>Thời gian dự kiến: <span className="math-line">{formatDuration(duration)}</span></p>
          )}
          {/* Thêm tính toán 40km/h nếu muốn */}
        </div>
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
        {/*  */}

        {routeGeometry.length > 0 && !loadingRoute && (
          <Polyline
            positions={routeGeometry}
            pathOptions={{ color: "blue", weight: 6 }}
          />
        )}

        <Marker position={position}>
          <Popup>Công ty TNHH Giao Nhận T.T.P</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Tracking;
