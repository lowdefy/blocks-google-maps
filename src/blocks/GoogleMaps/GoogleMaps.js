import React, { useEffect, useState } from 'react';
import { blockDefaultProps } from '@lowdefy/block-tools';
import GoogleMapReact, { fitBounds } from 'google-map-react';

const GoogleMaps = ({ blockId, events, methods, properties, loading }) => {
  let [mapState, setMap] = useState({});
  useEffect(() => {
    methods.registerMethod('addHeatmap', (heatmap) => {
      mapState.bounds = new mapState.maps.LatLngBounds();
      for (let i = 0; i < heatmap.data.length; i++) {
        heatmap.data[i].location = new mapState.maps.LatLng(heatmap.data[i].location.lat, heatmap.data[i].location.lng);
        mapState.bounds.extend(heatmap.data[i].location);
      }
      mapState.heatmap = new mapState.maps.visualization.HeatmapLayer({
        ...heatmap,
        map: mapState.map,
      });
      mapState.map.fitBounds(mapState.bounds);
    });
    methods.registerMethod('addMarker', (marker) => {
      marker = new mapState.maps.Marker({
        ...marker,
        map: mapState.map,
      });
      if (marker.tooltip) {
        marker.infoWindow = new mapState.maps.InfoWindow();
        marker.infoWindow.setContent(marker.tooltip);
      }
      marker.addListener('click', (event) => {
        if (marker.tooltip) marker.infoWindow.open(mapState.map, marker);
        methods.triggerEvent({ name: 'onClickMarker', event: { ...event, maps: mapState.maps } });
      });
      mapState.markers.push(marker);
    });
    methods.registerMethod('fitBounds', (bounds, mapSize) => {
      let { center, zoom } = fitBounds(bounds, mapSize);
      mapState.map.setZoom(zoom);
      mapState.map.setCenter(center);
    });
    methods.registerMethod('removeMarker', (removeMarker) => {
      for (let i = 0; i < mapState.markers.length; i++) {
        if (
          removeMarker.position.lat == mapState.markers[i].position.lat() &&
          removeMarker.position.lng == mapState.markers[i].position.lng()
        ) {
          mapState.markers[i].setMap(null);
        }
      }
    });
    methods.registerMethod('toggleHeatmap', () => {
      mapState.heatmap.setMap(mapState.heatmap.getMap() ? null : mapState.map);
    });
  });
  function _onGoogleApiLoaded({ map, maps }) {
    let markers = properties.markers || [];
    setMap({
      map,
      maps,
      markers: markers.map((marker) => {
        marker = new maps.Marker({
          ...marker,
          map: map,
        });
        if (marker.tooltip) {
          marker.infoWindow = new maps.InfoWindow();
          marker.infoWindow.setContent(marker.tooltip);
        }
        marker.addListener('click', (event) => {
          if (marker.tooltip) marker.infoWindow.open(map, marker);
          methods.triggerEvent({ name: 'onClickMarker', event: { ...event, maps } });
        });
        return marker;
      }),
    });
    methods.triggerEvent({ name: 'onGoogleApiLoaded', event: { maps } });
  }
  return (
    // Important! Always set the container height explicitly
    <div
      id={blockId}
      data-testid={blockId}
      className={methods.makeCssClass([
        {
          outline: 'none',
          cursor: events.onClick && 'pointer',
          width: '100%',
          height: properties.height || 500,
          ...properties.style,
        },
      ])}
    >
      <GoogleMapReact
        bootstrapURLKeys={properties.bootstrapURLKeys} // { key: '', language: 'en', region: 'en', libraries: ['places'], ...otherUrlParams, } If you want to include additional libraries to load with the maps api, indicate them in the libraries property of the bootstrapURLKeys object.
        defaultCenter={properties.defaultCenter} // [lat, lng] or { lat: lat, lng: lng}
        center={properties.center} // [lat, lng] or { lat: lat, lng: lng}
        defaultZoom={properties.defaultZoom} // number map zoom level
        zoom={properties.zoom} // number map zoom level
        hoverDistance={properties.hoverDistance} // number default: 30
        margin={properties.margin} // array
        debounced={properties.debounced} // bool Default: true
        layerTypes={properties.layerTypes} // string[] layerTypes={['TrafficLayer', 'TransitLayer']}
        resetBoundsOnResize={properties.resetBoundsOnResize} // boolean Default: false, When true this will reset the map bounds if the parent resizes.
        heatmap={properties.heatmap} // To use the heatmap layer, add visualization to the libraries property array on bootstrapURLKeys and provide the data & configuration for the heatmap in heatmap as props. If you have multiple maps in your project and require a heatmap layer in at least one of them, provide libraries:['visualization'] to all of them.
        options={properties.mapOptions} // object custom map options
        yesIWantToUseGoogleMapApiInternals={true} // works with onGoogleApiLoaded
        onGoogleApiLoaded={_onGoogleApiLoaded} // Directly access the maps API see https://developers.google.com/maps/documentation/javascript/reference
        onClick={(event) =>
          methods.triggerEvent({ name: 'onClick', event: { ...event, maps: mapState.maps } })
        } // The event prop in args is the outer div onClick event, not the gmap-api 'click' event.
        onZoomAnimationStart={(zoom) =>
          methods.triggerEvent({
            name: 'onZoomAnimationStart',
            event: { zoom, maps: mapState.maps },
          })
        }
        onZoomAnimationEnd={(zoom) =>
          methods.triggerEvent({ name: 'onZoomAnimationEnd', event: { zoom, maps: mapState.maps } })
        }
        onDrag={() => methods.triggerEvent({ name: 'onDrag', event: { maps: mapState.maps } })}
        onDragEnd={() =>
          methods.triggerEvent({ name: 'onDragEnd', event: { maps: mapState.maps } })
        } // When the map stops moving after the user drags. Takes into account drag inertia.
        onTilesLoaded={() =>
          methods.triggerEvent({ name: 'onTilesLoaded', event: { maps: mapState.maps } })
        }
        onMapTypeIdChange={(type) =>
          methods.triggerEvent({ name: 'onMapTypeIdChange', event: { type, maps: mapState.maps } })
        } // When the user changes the map type (HYBRID, ROADMAP, SATELLITE, TERRAIN) this fires
      />
    </div>
  );
};

GoogleMaps.defaultProps = blockDefaultProps;

export default GoogleMaps;
