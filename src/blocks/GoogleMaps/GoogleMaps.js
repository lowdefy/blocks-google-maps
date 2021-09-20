import React, { useEffect, useState } from 'react';
import { blockDefaultProps } from '@lowdefy/block-tools';
import GoogleMapReact, { fitBounds } from 'google-map-react';

const GoogleMaps = ({ blockId, content, events, methods, properties }) => {
  let [mapState, setMap] = useState({});
  useEffect(() => {
    methods.registerMethod('addMarker', (marker) => {
      marker = new mapState.maps.Marker({
        ...marker,
        map: mapState.map,
      });
      marker.addListener('click', (event) =>
        methods.triggerEvent({ name: 'onClickMarker', event })
      );
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
        marker.addListener('click', (event) =>
          methods.triggerEvent({ name: 'onClickMarker', event })
        );
        return marker;
      }),
    });
    methods.triggerEvent({ name: 'onGoogleApiLoaded' });
  }
  return (
    // Important! Always set the container height explicitly
    <div
      id={blockId}
      data-testid={blockId}
      className={methods.makeCssClass([
        { outline: 'none', cursor: events.onClick && 'pointer' },
        properties.style,
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
        onClick={(event) => methods.triggerEvent({ name: 'onClick', event })} // The event prop in args is the outer div onClick event, not the gmap-api 'click' event.
        onZoomAnimationStart={(zoom) =>
          methods.triggerEvent({ name: 'onZoomAnimationStart', event: { zoom } })
        }
        onZoomAnimationEnd={(zoom) =>
          methods.triggerEvent({ name: 'onZoomAnimationEnd', event: { zoom } })
        }
        onDrag={() => methods.triggerEvent({ name: 'onDrag' })}
        onDragEnd={() => methods.triggerEvent({ name: 'onDragEnd' })} // When the map stops moving after the user drags. Takes into account drag inertia.
        onTilesLoaded={() => methods.triggerEvent({ name: 'onTilesLoaded' })}
        onMapTypeIdChange={(type) =>
          methods.triggerEvent({ name: 'onMapTypeIdChange', event: { type } })
        } // When the user changes the map type (HYBRID, ROADMAP, SATELLITE, TERRAIN) this fires
      >
        {properties.content || (content.content && content.content())}
      </GoogleMapReact>
    </div>
  );
};

GoogleMaps.defaultProps = blockDefaultProps;

export default GoogleMaps;
