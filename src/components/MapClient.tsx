'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import mapStyles from '../styles/Map.module.css';

// Dynamic import for RegionStats (no SSR issues here)
import RegionStats from './RegionStats';
import MapErrorBoundary from './MapErrorBoundary';

// Create a unique key for the map component to force remounting
const getMapKey = () => `map-${Date.now()}`;

// Dynamic import to avoid SSR issues with Leaflet
const BishaMap = dynamic(() => import('./BishaMap'), {
  ssr: false,
  loading: () => <div className={mapStyles.mapLoading}>جاري تحميل الخريطة...</div>
});

const MapClient = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>("بيشة");
  const [regionData, setRegionData] = useState<Record<string, any>>({});
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  const [mapKey, setMapKey] = useState(getMapKey());

  // Load region data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/saudi-regions.json');
        const data = await response.json();

        const regions: Record<string, any> = {};
        data.features.forEach((feature: any) => {
          const props = feature.properties;
          regions[props.name] = {
            males: props.males,
            females: props.females,
            schools: props.schools,
            houses: props.houses,
            subscribers: props.subscribers,
            factories: props.factories,
            population: props.population,
            area: props.area,
            nameEn: props.nameEn
          };
        });

        setRegionData(regions);
      } catch (err) {
        console.error('Error loading region data:', err);
      }
    };

    fetchData();
  }, []);

  // Delay map rendering to avoid hydration issues
  useEffect(() => {
    // Use a longer timeout to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setShouldRenderMap(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle errors by remounting the map component
  const handleMapError = () => {
    setShouldRenderMap(false);
    
    // Reset selected region to avoid state issues
    setSelectedRegion("بيشة");
    
    // Force remount by changing the key
    setMapKey(getMapKey());
    
    // Re-render after a longer delay to ensure cleanup
    setTimeout(() => {
      setShouldRenderMap(true);
    }, 1000);
  };

  return (
    <div className={mapStyles.mapContainer}>
      {shouldRenderMap ? (
        <MapErrorBoundary onError={handleMapError}>
          <div key={mapKey} className={mapStyles.mapWrapper}>
            <BishaMap 
              onRegionSelect={setSelectedRegion} 
              onError={handleMapError}
            />
          </div>
        </MapErrorBoundary>
      ) : (
        <div className={mapStyles.mapLoading}>جاري تحميل الخريطة...</div>
      )}

      <RegionStats selectedRegion={selectedRegion} regionData={regionData} />
    </div>
  );
};

export default MapClient;