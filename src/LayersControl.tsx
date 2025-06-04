import {
  MapContainer,
  Polygon,
  WMSTileLayer,
  LayersControl,
  TileLayer,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression, Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

function LayersControlComponent() {
  // const mapRef = useRef<Map | null>(null);

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
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Polygons">
          <LayerGroup>
            {polygonsGroup1.map((polygon, index) => (
              <Polygon
                key={index}
                positions={polygon}
                pathOptions={{
                  color: "blue",
                  fillColor: "blue",
                  fillOpacity: 0.5,
                }}
              />
            ))}
          </LayerGroup>
          <LayerGroup>
            {polygonsGroup2.map((polygon, index) => (
              <Polygon
                key={index}
                positions={polygon}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.5,
                }}
              />
            ))}
          </LayerGroup>
          <LayerGroup>
            {polygonsGroup3.map((polygon, index) => (
              <Polygon
                key={index}
                positions={polygon}
                pathOptions={{
                  color: "green",
                  fillColor: "green",
                  fillOpacity: 0.5,
                }}
              />
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

export default LayersControlComponent;

const polygonsGroup1: LatLngExpression[][] = [
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

const polygonsGroup2: LatLngExpression[][] = [
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

const polygonsGroup3: LatLngExpression[][] = [
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
