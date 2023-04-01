import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import omnivore from 'leaflet-omnivore';
import JSZip from 'jszip';

const KMLLayer = () => {
  const map = useMap();

  useEffect(() => {
    const onKMLLoaded = (kmlLayer) => {
      kmlLayer.setStyle({
        fillColor: 'blue',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
      });
      kmlLayer.addTo(map);
      map.fitBounds(kmlLayer.getBounds());
    };

    const fetchAndLoadKMZ = async () => {
      const kmzUrl = '/constants/all districts KMZ/astore.kmz';
      const response = await fetch(kmzUrl);
      const kmzArrayBuffer = await response.arrayBuffer();

      const zip = new JSZip();
      const content = await zip.loadAsync(kmzArrayBuffer);
      const kmlFileName = Object.keys(content.files).find((file) => file.endsWith('.kml'));

      if (kmlFileName) {
        const kmlText = await content.files[kmlFileName].async('text');

        const kmlParser = omnivore.kml.parse(kmlText);
        kmlParser.on('ready', () => {
          onKMLLoaded(kmlParser);
        });
      } else {
        console.error('KML file not found in the KMZ archive.');
      }
    };

    fetchAndLoadKMZ();

    return () => {
      if (kmlParser) {
        map.removeLayer(kmlParser);
      }
    };
  }, [map]);

  return null;
};

export default KMLLayer;
