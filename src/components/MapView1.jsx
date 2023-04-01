import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { arcgisToGeoJSON } from 'arcgis-to-geojson-utils';
import gilgitData from '../constants/json files/gilgit.json';
import nagarData from '../constants/json files/nagar.json'

const MapView = () => {
  const [geoJSONData, setGeoJSONData] = useState(null);

  // Convert the Esri JSON data to GeoJSON
  useEffect(() => {
    const convertData = () => {
      // Extract the features from the Esri JSON data
      const features = nagarData.features.map((feature) => {
        return arcgisToGeoJSON(feature);
      });

      // Create a new GeoJSON object with the converted features
      const geoJSON = {
        type: 'FeatureCollection',
        features: features,
      };

      setGeoJSONData(geoJSON);
    };

    convertData();
  }, []);

  // You can customize the styling of the GeoJSON features
  const geoJSONStyle = {
    fillColor: 'blue',
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7,
  };

  return (
    <div>
      <MapContainer center={[36.41083348425959, 74.43956001957795]} zoom={9} style={{ height: '100vh', width: '100vw' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJSONData && <GeoJSON key='geojson-layer' data={geoJSONData}  />}
      </MapContainer>
    </div>
  );
};

export default MapView;
