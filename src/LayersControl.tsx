import {
  MapContainer,
  Polygon,
  WMSTileLayer,
  LayersControl,
  TileLayer,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

// Simula una chiamata API per caricare i poligoni
const loadPolygonsFromAPI = async (
  groupId: string
): Promise<LatLngExpression[][]> => {
  // Simula un delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  switch (groupId) {
    case "group1":
      return [
        [
          [43.3591, 11.3761],
          [43.3594, 11.3764],
          [43.3598, 11.3761],
          [43.3594, 11.3756],
        ],
        [
          [43.3592, 11.3771],
          [43.3595, 11.3774],
          [43.3599, 11.3771],
          [43.3595, 11.3766],
        ],
        [
          [43.3589, 11.3781],
          [43.3592, 11.3784],
          [43.3596, 11.3781],
          [43.3592, 11.3776],
        ],
      ];
    case "group2":
      return [
        [
          [43.3585, 11.3751],
          [43.3588, 11.3754],
          [43.3592, 11.3751],
          [43.3588, 11.3746],
        ],
        [
          [43.3586, 11.3761],
          [43.3589, 11.3764],
          [43.3593, 11.3761],
          [43.3589, 11.3756],
        ],
      ];
    case "group3":
      return [
        [
          [43.3581, 11.3741],
          [43.3584, 11.3744],
          [43.3588, 11.3741],
          [43.3584, 11.3736],
        ],
        [
          [43.3582, 11.3751],
          [43.3585, 11.3754],
          [43.3589, 11.3751],
          [43.3585, 11.3746],
        ],
      ];
    default:
      return [];
  }
};

// Componente per un LayerGroup dinamico
interface DynamicLayerGroupProps {
  groupId: string;
  name: string;
  color: string;
}

function DynamicLayerGroup({ groupId, name, color }: DynamicLayerGroupProps) {
  const [polygons, setPolygons] = useState<LatLngExpression[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const handleAdd = async () => {
      if (!isVisible && !isLoading) {
        setIsVisible(true);
        setIsLoading(true);

        try {
          const data = await loadPolygonsFromAPI(groupId);
          setPolygons(data);
        } catch (error) {
          console.error(`Error loading polygons for ${groupId}:`, error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const handleRemove = () => {
      setIsVisible(false);
    };

    const layer = layerRef.current;
    if (layer) {
      layer.on("add", handleAdd);
      layer.on("remove", handleRemove);

      return () => {
        layer.off("add", handleAdd);
        layer.off("remove", handleRemove);
      };
    }
  }, [groupId, isVisible, isLoading]);

  return (
    <LayersControl.Overlay name={name}>
      <LayerGroup ref={layerRef}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "white",
              padding: "5px",
              borderRadius: "3px",
              zIndex: 1000,
            }}
          >
            Loading {name}...
          </div>
        )}
        {polygons.map((polygon, index) => (
          <Polygon
            key={`${groupId}-${index}`}
            positions={polygon}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.5,
            }}
          />
        ))}
      </LayerGroup>
    </LayersControl.Overlay>
  );
}

// LayersControlComponent
function LayersControlComponent() {
  return (
    <MapContainer
      center={[43.3595, 11.3765]}
      zoom={17}
      style={{ height: "100vh" }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="WMS Layer">
          <WMSTileLayer
            url="http://www502.regione.toscana.it/ows_ofc/com.rt.wms.RTmap/wms?map=owsofc&FORMAT=image/jpeg&SERVICE=WMS&VERSION=1.1.1"
            layers="rt_ofc.5k16.32bit"
            format="image/jpeg"
            maxZoom={50}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>

        <DynamicLayerGroup
          groupId="group1"
          name="Polygons Group 1 (Blue)"
          color="blue"
        />
        <DynamicLayerGroup
          groupId="group2"
          name="Polygons Group 2 (Red)"
          color="red"
        />
        <DynamicLayerGroup
          groupId="group3"
          name="Polygons Group 3 (Green)"
          color="green"
        />
      </LayersControl>
    </MapContainer>
  );
}
export default LayersControlComponent;
