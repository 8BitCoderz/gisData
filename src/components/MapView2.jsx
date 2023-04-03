import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import nagarData from '../constants/json files/nagar.json'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const convertToGeoJSON = (data) => {
  const features = data.features.map((feature) => {
    return {
      type: 'Feature',
      properties: feature.attributes,
      geometry: {
        type: 'Polygon',
        coordinates: feature.geometry.rings,
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features,
  };
};

const geojsonData = convertToGeoJSON(nagarData);

const featureStyle = () => {
  return {
    color: 'blue',
    weight: 2,
    opacity: 0.6,
  };
};


const formatLength = (length) => {
  const lengthInMeters = (length * 1000).toFixed(2);
  return `${length.toFixed(2)} km (${lengthInMeters} meters)`;
};

const formatArea = (area) => {
  const areaInSquareMeters = (area * 1000000).toFixed(2);
  return `${area.toFixed(2)} sq. km (${areaInSquareMeters} sq. meters)`;
};

const onEachFeature = (feature, layer) => {
  if (feature.properties && feature.properties.Name) {
    layer.bindPopup(
      `<strong>Name:</strong> ${feature.properties.Name}<br>` +
      `<strong>Length:</strong> ${formatLength(feature.properties.Shape_Leng)}<br>` +
      `<strong>Area:</strong> ${formatArea(feature.properties.Shape_Area)}`
    );
  }

  layer.on({
    mouseover: (event) => {
      const targetLayer = event.target;
      targetLayer.setStyle({
        color: 'red',
        weight: 2,
        opacity: 0.6,
      });
    },
    mouseout: (event) => {
      const targetLayer = event.target;
      targetLayer.setStyle(featureStyle());
    },
  });
};


const MapView = () => {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  return (
    <MapContainer
      center={[36.256776656000056, 74.366727357000059]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={geojsonData}
        style={featureStyle}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default MapView;
