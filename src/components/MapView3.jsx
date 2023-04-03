import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import nagarData from "../constants/json files/nagar.json";
import astoreData from "../constants/json files/astore.json";
import diamerData from "../constants/json files/diamer.json";
import ghancheData from "../constants/json files/ghanche.json";
import ghizerData from "../constants/json files/ghizer.json";
import gilgitData from "../constants/json files/gilgit.json";
import hunzaData from "../constants/json files/hunza.json";
import kharmangData from "../constants/json files/kharmang.json";
import shigerData from "../constants/json files/shiger.json";
import skarduData from "../constants/json files/skardu.json";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { polygon, centroid } from '@turf/turf';

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

const gbData = [
  {
    name: "Nagar",
    data: nagarData,
  },
  {
    name: "Astore",
    data: astoreData,
  },
  {
    name: "Diamer",
    data: diamerData,
  },
  {
    name: "Ghanche",
    data: ghancheData,
  },
  {
    name: "Ghizer",
    data: ghizerData,
  },
  {
    name: "Gilgit",
    data: gilgitData,
  },
  {
    name: "Hunza",
    data: hunzaData,
  },
  {
    name: "Kharmang",
    data: kharmangData,
  },
  {
    name: "Shiger",
    data: shigerData,
  },
  {
    name: "Skardu",
    data: skarduData,
  },
];

const getCentroid = (coords) => {
  let xSum = 0;
  let ySum = 0;
  let count = 0;

  for (const part of coords) {
    for (const point of part) {
      xSum += point[1];
      ySum += point[0];
      count++;
    }
  }

  return [xSum / count, ySum / count];
};


const convertToGeoJSON = (data) => {
  const features = data.features.map((feature) => {
    const centroid = getCentroid(feature.geometry.rings);
    return {
      type: "Feature",
      properties: { ...feature.attributes, centroid },
      geometry: {
        type: "Polygon",
        coordinates: feature.geometry.rings,
      },
    };
  });

  return {
    type: "FeatureCollection",
    features,
  };
};

const featureStyle = () => {
  return {
    color: "blue",
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
        `<strong>Length:</strong> ${formatLength(
          feature.properties.Shape_Leng
        )}<br>` +
        `<strong>Area:</strong> ${formatArea(feature.properties.Shape_Area)}`
    );
  }

  layer.on({
    mouseover: (event) => {
      const targetLayer = event.target;
      targetLayer.setStyle({
        color: "red",
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

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapView = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(gbData[0].name);
  const [filteredData, setFilteredData] = useState([gbData[0]]);
  const [mapCenter, setMapCenter] = useState([
    36.256776656000056, 74.366727357000059,
  ]);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    console.log("Selected district:", selectedValue);
    setSelectedDistrict(selectedValue);

    if (selectedValue === "") {
      setFilteredData(gbData);
      setMapCenter([36.256776656000056, 74.366727357000059]);
    } else {
      const districtData = gbData.find((data) => data.name === selectedValue);
      setFilteredData([districtData]);
      const districtGeoJSON = convertToGeoJSON(districtData.data);
      setMapCenter(districtGeoJSON.features[0].properties.centroid);
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
              height: "calc(100vh - 32px)",
            }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              Gilgit-Baltistan Map
            </Typography>
            <br/>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 240, marginBottom: "1rem" }}
            >
              <InputLabel htmlFor="district-selector">Select District</InputLabel>
              <Select
                label="Select District"
                id="district-selector"
                value={selectedDistrict}
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>All Districts</em>
                </MenuItem>
                {gbData.map((data, index) => (
                  <MenuItem key={index} value={data.name}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <MapContainer
            center={mapCenter}
            zoom={8.5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredData.map((data, index) => {
              const geojsonData = convertToGeoJSON(data.data);
              return (
                <GeoJSON
                  key={`${selectedDistrict}-${index}`}
                  data={geojsonData}
                  style={featureStyle}
                  onEachFeature={onEachFeature}
                />
              );
            })}
            <MapUpdater center={mapCenter} />
          </MapContainer>
        </Grid>
        <Grid item xs={3}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
              height: "calc(100vh - 32px)",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Graphs Data
            </Typography>
            {/* Add graphs and data here */}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default MapView;