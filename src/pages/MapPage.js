import {
  Map,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  WMSTileLayer,
} from 'react-leaflet';
import 'leaflet.markercluster';
import React, {useEffect, useState, useRef} from 'react';
import {featureLayer, query} from 'esri-leaflet';
import {geosearch} from 'esri-leaflet-geocoder';
import {featureLayer as clusterLayer} from 'esri-leaflet-cluster';
import FeatureDetails from '../components/FeatureDetails';


export default function MapPage() {
  const position = [41.850033, -100.6500523];
  const [data, setData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const map = useRef();
  const triUrl =
    'https://geodata.epa.gov/arcgis/rest/services/OEI/FRS_INTERESTS/MapServer/23';
  const triClusterLayer = clusterLayer({
    url: triUrl,
    simplifyFactor: 10
  });
  const triLayer = featureLayer({
    url: triUrl
  })

  useEffect(() => {
    if (map) {
      geosearch({
        position: 'topright',
        useMapBounds: false,
        expanded: true,
      }).addTo(map.current.leafletElement);
      triClusterLayer.addTo(map.current.leafletElement);
      //Click Identify Logic for TRI features

      triClusterLayer.on('click', evt => {
        console.log('caught click event....')
        /*
        var qry = query({
          url: triUrl,
        })
          .nearby(evt.latlng, 10000)
          .run((error, featureCollection, response) => {
            if (error) {
              console.log(error);
              return;
            }
            console.log(featureCollection.features);
            if (featureCollection.features.length > 0) {
              setSelectedFeature(featureCollection.features[0]);
            }
          });
          */
      });
    }
  }, [map]);

  return (
    <div className="map-page">
      <Map
        style={{width: '100%', height: '100%'}}
        center={position}
        zoom={8}
        maxZoom={15}
        ref={map}>
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
      {selectedFeature && <FeatureDetails feature={selectedFeature} />}
    </div>
  );
}
