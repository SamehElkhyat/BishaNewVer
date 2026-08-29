'use client';
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/Map.module.css';

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Selected icon for cities
const SelectedIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface BishaMapProps {
  onRegionSelect: (regionName: string) => void;
  onError?: () => void;
}

const BishaMap: React.FC<BishaMapProps> = ({ onRegionSelect, onError }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>("بيشة");
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [cityMarkers, setCityMarkers] = useState<any[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  
  // Generate a unique ID for this map instance
  const mapId = useRef(`map-${Math.random().toString(36).substr(2, 9)}`).current;

  // Initialize map when component mounts
  useEffect(() => {
    // Fetch GeoJSON data
    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch('/saudi-regions.json');
        const data = await response.json();
        setGeoJsonData(data);
        
        // Extract city markers from GeoJSON
        const markers = data.features.map((feature: any) => {
          const coordinates = feature.geometry.coordinates[0];
          // Calculate center point of polygon
          const lat = coordinates.reduce((sum: number, point: number[]) => sum + point[1], 0) / coordinates.length;
          const lng = coordinates.reduce((sum: number, point: number[]) => sum + point[0], 0) / coordinates.length;
          
          return {
            id: feature.properties.id,
            name: feature.properties.name,
            nameEn: feature.properties.nameEn,
            position: [lat, lng],
            population: feature.properties.population,
            description: feature.properties.description || 'No description available'
          };
        });
        
        setCityMarkers(markers);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
        if (onError) onError();
      }
    };
    
    fetchGeoJsonData();
  }, [onError]);

  // Initialize map after data is loaded
  useEffect(() => {
    if (!geoJsonData || !mapContainerRef.current) return;
    
    // Capture the container reference for cleanup
    const containerElement = mapContainerRef.current;
    
    try {
      // Cleanup any existing map instance more thoroughly
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        } catch (cleanupError) {
          console.warn('Error during map cleanup:', cleanupError);
        }
        mapInstanceRef.current = null;
      }
      
      // Clear any existing geoJSON layer
      if (geoJsonLayerRef.current) {
        geoJsonLayerRef.current = null;
      }
      
      // Make sure the container is empty and ready
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
        // Reset any Leaflet-specific properties
        (mapContainerRef.current as any)._leaflet_id = undefined;
      }
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (!mapContainerRef.current) return;
      
      // Create map instance
      const map = L.map(mapId, {
        center: [19.0, 42.5],
        zoom: 8,
        zoomControl: false,
        attributionControl: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
        inertia: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true
      });
      
      mapInstanceRef.current = map;
      
      // Add drag event handlers for better user feedback
      map.on('dragstart', () => {
        if (mapContainerRef.current) {
          mapContainerRef.current.style.cursor = 'grabbing';
        }
      });
      
      map.on('dragend', () => {
        if (mapContainerRef.current) {
          mapContainerRef.current.style.cursor = 'grab';
        }
      });
      
      map.on('movestart', () => {
        // Optional: Add visual feedback when map starts moving
      });
      
      map.on('moveend', () => {
        // Optional: Add visual feedback when map stops moving
      });
      
      // Add tile layers
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri'
      }).addTo(map);
      
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      });
      
      const terrainLayer = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38', {
        attribution: '&copy; Thunderforest'
      });
      
      // Add overlay layer
      const labelsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        opacity: 0.3
      });
      
      // Add layer controls
      const baseLayers = {
        'صور الأقمار الصناعية': satelliteLayer,
        'خريطة الشوارع': streetLayer,
        'التضاريس': terrainLayer
      };
      
      const overlays = {
        'أسماء المناطق': labelsLayer
      };
      
      L.control.layers(baseLayers, overlays).addTo(map);
      
      // Add zoom control
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);
      
      // Add scale control
      L.control.scale({
        position: 'bottomleft',
        imperial: false
      }).addTo(map);
      
      // Style function for GeoJSON
      const styleFeature = (feature: any) => {
        return {
          fillColor: feature.properties.name === selectedRegion ? '#2196F3' : '#0A3B5C',
          weight: feature.properties.name === selectedRegion ? 3 : 2,
          opacity: 1,
          color: 'rgba(255, 255, 255, 0.8)',
          dashArray: feature.properties.name === selectedRegion ? '' : '3',
          fillOpacity: feature.properties.name === selectedRegion ? 0.6 : 0.4,
          smoothFactor: 0.5
        };
      };
      
      // Function to handle feature interactions
      const onEachFeature = (feature: any, layer: L.Layer) => {
        if (feature.properties?.name) {
          // Type guard for layers with bindTooltip method
          const hasBindTooltip = (layer: any): layer is L.Layer & { bindTooltip: Function } => {
            return 'bindTooltip' in layer;
          };
          
          // Type guard for layers with getBounds method
          const hasGetBounds = (layer: any): layer is L.Layer & { getBounds: () => L.LatLngBounds } => {
            return 'getBounds' in layer;
          };
          
          // Type guard for layers with setStyle method
          const hasSetStyle = (layer: any): layer is L.Layer & { setStyle: Function } => {
            return 'setStyle' in layer;
          };
          
          // Type guard for layers with bringToFront method
          const hasBringToFront = (layer: any): layer is L.Layer & { bringToFront: Function } => {
            return 'bringToFront' in layer;
          };
          
          // Add tooltip with region name
          if (hasBindTooltip(layer)) {
            layer.bindTooltip(feature.properties.name, {
              permanent: false,
              direction: 'center',
              className: styles.regionLabel
            });
          }
          
          // Add click handler
          layer.on({
            click: () => {
              setSelectedRegion(feature.properties.name);
              onRegionSelect(feature.properties.name);
              
              // Fit bounds to the selected feature
              if (hasGetBounds(layer)) {
                map.fitBounds(layer.getBounds());
              }
              
              // Reset style for all layers
              if (geoJsonLayerRef.current) {
                geoJsonLayerRef.current.resetStyle();
              }
              
              // Highlight the selected layer
              if (hasSetStyle(layer)) {
                layer.setStyle({
                  fillColor: '#2196F3',
                  weight: 3,
                  color: '#FFFFFF',
                  fillOpacity: 0.6,
                  dashArray: ''
                });
              }
            },
            mouseover: () => {
              if (feature.properties.name !== selectedRegion && hasSetStyle(layer)) {
                layer.setStyle({
                  fillColor: '#1976D2',
                  fillOpacity: 0.5,
                  weight: 3
                });
              }
              if (hasBringToFront(layer)) {
                layer.bringToFront();
              }
            },
            mouseout: () => {
              if (feature.properties.name !== selectedRegion) {
                if (geoJsonLayerRef.current) {
                  geoJsonLayerRef.current.resetStyle(layer);
                }
              }
            }
          });
        }
      };
      
      // Add GeoJSON layer
      geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
        style: styleFeature,
        onEachFeature: onEachFeature
      }).addTo(map);
      
      // Add city markers
      cityMarkers.forEach(city => {
        const marker = L.marker(city.position as L.LatLngExpression, {
          icon: city.name === selectedRegion ? SelectedIcon : DefaultIcon
        }).addTo(map);
        
        // Add tooltip
        marker.bindTooltip(city.name, {
          direction: 'top',
          offset: [0, -20] as L.PointExpression,
          opacity: 1,
          permanent: true,
          className: styles.cityTooltip
        });
        
        // Add popup
        const popupContent = document.createElement('div');
        popupContent.className = styles.cityPopup;
        popupContent.innerHTML = `
          <h3>${city.name} <span>(${city.nameEn})</span></h3>
          <p class="${styles.cityDescription}">${city.description}</p>
          <div class="${styles.cityStats}">
            <div class="${styles.cityStat}">
              <span class="${styles.cityStatLabel}">عدد السكان:</span>
              <span class="${styles.cityStatValue}">${city.population.toLocaleString()}</span>
            </div>
          </div>
        `;
        
        const button = document.createElement('button');
        button.className = styles.selectCityButton;
        button.innerText = 'عرض الإحصائيات';
        button.onclick = () => {
          setSelectedRegion(city.name);
          onRegionSelect(city.name);
          
          // Find the corresponding feature to set bounds
          if (geoJsonLayerRef.current) {
            const layers = geoJsonLayerRef.current.getLayers();
            const layer = layers.find((l: any) => 
              l.feature?.properties?.name === city.name
            );
            
            // Type guard for layers with getBounds method
            const hasGetBounds = (layer: any): layer is L.Layer & { getBounds: () => L.LatLngBounds } => {
              return layer && 'getBounds' in layer;
            };
            
            // Type guard for layers with setStyle method
            const hasSetStyle = (layer: any): layer is L.Layer & { setStyle: Function } => {
              return layer && 'setStyle' in layer;
            };
            
            if (layer && hasGetBounds(layer)) {
              map.fitBounds(layer.getBounds());
              
              // Reset style for all layers
              geoJsonLayerRef.current.resetStyle();
              
              // Highlight the selected layer
              if (hasSetStyle(layer)) {
                layer.setStyle({
                  fillColor: '#2196F3',
                  weight: 3,
                  color: '#FFFFFF',
                  fillOpacity: 0.6,
                  dashArray: ''
                });
              }
            }
          }
        };
        
        popupContent.appendChild(button);
        marker.bindPopup(popupContent);
        
        // Add circle for population visualization
        L.circle(city.position as L.LatLngExpression, {
          radius: city.population > 400000 ? 5000 : city.population > 100000 ? 3000 : 2000,
          fillColor: city.name === selectedRegion ? '#2196F3' : '#3F51B5',
          fillOpacity: 0.2,
          weight: 1,
          color: 'white'
        }).addTo(map);
      });
      
      // Invalidate size to ensure proper rendering
      setTimeout(() => {
        map.invalidateSize();
        
        // Auto-select بيشة region on map load
        if (selectedRegion === "بيشة" && geoJsonLayerRef.current) {
          onRegionSelect("بيشة");
          
          // Find the بيشة layer and highlight it
          const layers = geoJsonLayerRef.current.getLayers();
          const bishaLayer = layers.find((l: any) => 
            l.feature?.properties?.name === "بيشة"
          );
          
          // Type guards for layer methods
          const hasGetBounds = (layer: any): layer is L.Layer & { getBounds: () => L.LatLngBounds } => {
            return layer && 'getBounds' in layer;
          };
          
          const hasSetStyle = (layer: any): layer is L.Layer & { setStyle: Function } => {
            return layer && 'setStyle' in layer;
          };
          
          if (bishaLayer) {
            // Fit bounds to بيشة
            if (hasGetBounds(bishaLayer)) {
              map.fitBounds(bishaLayer.getBounds());
            }
            
            // Highlight بيشة region
            if (hasSetStyle(bishaLayer)) {
              bishaLayer.setStyle({
                fillColor: '#2196F3',
                weight: 3,
                color: '#FFFFFF',
                fillOpacity: 0.6,
                dashArray: ''
              });
            }
          }
        }
      }, 100);
      
      }, 50); // Close the setTimeout we opened earlier
      
    } catch (error) {
      console.error('Error initializing map:', error);
      if (onError) onError();
    }
    
    // Cleanup function
    return () => {
      try {
        if (mapInstanceRef.current) {
          // Remove all event listeners
          mapInstanceRef.current.off();
          // Remove the map
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        
        // Clear geoJSON layer reference
        if (geoJsonLayerRef.current) {
          geoJsonLayerRef.current = null;
        }
        
        // Clear container Leaflet properties using captured reference
        if (containerElement) {
          (containerElement as any)._leaflet_id = undefined;
        }
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
    };
  }, [geoJsonData, cityMarkers, mapId, onRegionSelect, selectedRegion, onError]);
  
  // Get responsive height based on screen size
  const getMapHeight = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 480) return '350px';
      if (width <= 768) return '400px';
      if (width <= 1024) return '500px';
      return '600px';
    }
    return '600px';
  };

  // State for responsive height
  const [mapHeight, setMapHeight] = useState('600px');

  // Update height on window resize
  useEffect(() => {
    const updateHeight = () => {
      setMapHeight(getMapHeight());
    };

    // Set initial height
    updateHeight();

    // Add resize listener
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div className={styles.mapWrapper}>
      <div 
        id={mapId}
        ref={mapContainerRef}
        style={{ 
          height: mapHeight, 
          width: '100%', 
          direction: 'ltr',
          minHeight: '300px'
        }}
      />
    </div>
  );
};

export default BishaMap;