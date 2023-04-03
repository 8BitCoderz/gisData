import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoJSONData from "../constants/geojson/NAGAR.json";

const MapView = () => {
  const  center = [36.2512138451938, 74.32314289404567]
  const [geoData, setGeoData] = useState(geoJSONData);

  const reverseCoordinates = (coordinates) => {
    return coordinates.map((coord) => [coord[1], coord[0]]);
  };



  return (
    <div>
      <MapContainer
        style={{ height: "100vh", width: "100%" }}
        center={center}
        zoom={9.5}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData.features.map((data) => {
          const cordinates = reverseCoordinates(data.geometry.coordinates[0]);

          return (
            <Polygon
              pathOptions={{
                fillColor: "#FD8D3C",
                fillOpacity: 0.7,
                weight: 2,
                opacity: 1,
                dashArray: 3,
                color: "white",
                
              }}
              
              positions={cordinates}
              eventHandlers= {
                {
                  mouseover: (e) =>{
                    const layer = e.target
                    layer.setStyle({
                      fillOpacity: .5,
                      weight: 2,
                      dashArray: '3',
                      fillColor: "#189ad3",
                      color: 'white'
                    })
                  },
                  mouseout: (e) => {
                    const layer = e.target
                    layer.setStyle({
                      fillColor: "#FD8D3C",
                      fillOpacity: 0.6,
                      weight: 2,
                      opacity: 1,
                      dashArray: 3,
                      color: "white",
                    })
                  },
                  
                }
              }
            >
              <Popup>
                <div>
                  <h4>{data.properties.Name}</h4>
                  <p>Type: {data.properties.type}</p>
                  <p>District: {data.properties.District}</p>
                  <p>Subdivison: {data.properties.Subdivison}</p>
                  <p>Area: {data.properties.Area}</p>
                </div>
              </Popup>
              </Polygon>
            
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
