// src/KMZMap.js
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-kmz';
import JSZip from 'jszip';

async function parseKMZ(file) {
  const response = await fetch(file);
  const data = await response.blob();

  const zip = await JSZip.loadAsync(data);
  const kmlFile = Object.values(zip.files).find((file) => file.name.endsWith('.kml'));
  const kmlContent = await kmlFile.async('text');

  return kmlContent;
}

const KMZMap = () => {
  const mapRef = useRef();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.leafletElement;

    parseKMZ(`${process.env.PUBLIC_URL}/constants/kmz/ASTORE.kmz`).then((kmlContent) => {
      const kmz = new L.KMZLayer();

      kmz.load(kmlContent, { addToMap: false, process: true });

      kmz.addTo(map);
      map.fitBounds(kmz.getBounds());

      return () => {
        map.removeLayer(kmz);
      };
    });
  }, [mapRef]);

  return (
    <MapContainer
      ref={mapRef}
      center={[35.35487691378787, 74.84629390518796]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default KMZMap;
