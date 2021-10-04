# Lowdefy Blocks Template

This repository is based on the blocks template repository as a basic starting point for developing custom blocks for Lowdefy. For a detailed description of how to build custom blocks, visit the [Custom Blocks](https://docs.lowdefy.com/custom-blocks) sections in the docs.

This repository contains a basic example of blocks for the display block category: `display`. You can read more about how blocks are used in Lowdefy in the [Blocks](https://docs.lowdefy.com/blocks) section of the docs.

A Lowdefy block has two files, the block meta data and the block React component.

## Running the blocks

1. You must have [node](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/getting-started/install) installed.
2. Clone this repository.
3. Run `yarn install`, then `yarn start`, then check the you block is served by viewing the meta data at: http://localhost:3002/meta/GoogleMaps.json.
4. Add the `types` to your lowdefy.yaml file. For example:

```yaml
name: my-app
lowdefy: 3.22.0
types:
  GoogleMaps:
    url: http://localhost:3002/meta/GoogleMaps.json
# ...
```

5. Use your new block type in your Lowdefy app.

```yaml
- id: google_maps
  type: GoogleMaps
  loading:
    type: Skeleton
    properties:
      height: 500
  properties:
    bootstrapURLKeys:
      key: ''
      libraries: ['visualization']
    mapOptions:
      zoomControl: true
      fullscreenControl: true
      styles:
        - stylers:
            - saturation: -100
            - gamma: 0.8
            - lightness: 4
            - visibility: on
    zoom: 14
    center:
      lat: -25.344
      lng: 131.036
    height: 500 # defaults to 500 when not set
    style: # overrides the map block's default style
      height: 550 # overrides the 'height: 500' property of the map block
      width: 100%
    markers:
      - position:
          lat: -25.344
          lng: 131.036
        label: Hi
# ...
```

6. Start your Lowdefy app and test if it works, run: `npx lowdefy@latest dev`
7. Continue to develop your block React component. Changes to your block will need to auto reload the app in the browser, you need to hit refresh.
8. Before deploying your blocks to a static file server, remember to change the `remoteEntryUrl` field in the `webpack.prod.js` file to your block URL.
9. Deploy your blocks and enjoy your ☕️.

## Properties

1. `bootstrapURLKeys`: { key: '', language: 'en', region: 'en', libraries: ['places'], ...otherUrlParams, } If you want to include additional libraries to load with the maps api, indicate them in the libraries property of the bootstrapURLKeys object.
2. `center`: Can be set to [lat, lng] or { lat: lat, lng: lng}. A position object for the center.
3. `debounced`: Defaults to true. Whether map events are debounced.
4. `defaultCenter`: Can be set to [lat, lng] or { lat: lat, lng: lng}. A position object for the center.
5. `defaultZoom`: Map zoom level.
6. `heatmap`: To use the heatmap layer, add visualization to the libraries property array on bootstrapURLKeys and provide the data & configuration for the heatmap in heatmap as props. If you have multiple maps in your project and require a heatmap layer in at least one of them, provide libraries:['visualization'] to all of them.
7. `height`: The height of the map block.
8. `hoverDistance`: Defaults to 30. Map hover distance.
9. `layerTypes`: Examples ['TrafficLayer', 'TransitLayer']. The layer types to be included in the map.
10. `mapOptions`: Custom map options.
11. `margin`: Map margin.
12. `markers`: A list of Markers with properties, `map` is provided by the default by the block, see [Javascript API Markers](https://developers.google.com/maps/documentation/javascript/markers) for configuration details.
13. `resetBoundsOnResize`: Default: false, When true this will reset the map bounds if the parent resizes.
14. `style`: Custom map css properties to apply to map block.
15. `zoom`: Map zoom level.

## Events

1. `onClick` Trigger onClick actions when the map is clicked, returns `_event` object:

   - `event`: event object
   - `lat`: latitudinal coordinate
   - `lng`: longitudinal coordinate
   - `maps`: has functions removed
   - `x`: position on map block
   - `y`: position on map block

2. `onClickMarker` Trigger onClick actions when a marker is clicked, returns `_event` object:

   - `domEvent`: event object
   - `latLng`:

     - `lat`: latitudinal coordinate
     - `lng`: longitudinal coordinate

   - `maps`: has functions removed
   - `pixel`:

     - `x`
     - `y`

3. `onDrag` Trigger onDrag actions when a map is dragged, returns `_event` object:

   - `maps`: has functions removed

4. `onDragEnd` Trigger onDragEnd actions when a map is finished being dragged, returns `_event` object:

   - `maps`: has functions removed

5. `onGoogleApiLoaded` Trigger onGoogleApiLoaded actions when the map api is loaded, returns `_event` object:

   - `maps`: has functions removed

6. `onMapTypeIdChange` Trigger onMapTypeIdChange actions when the map type is changed, returns `_event` object:

   - `maps`: has functions removed
   - `type`: the map

7. `onTilesLoaded` Trigger onTilesLoaded actions when the map tiles are loaded, returns `_event` object:

   - `maps`: has functions removed

8. `onZoomAnimationStart` Trigger onZoomAnimationStart actions when the map is zoomed, returns `_event` object:

   - `maps`: has functions removed
   - `zoom`: map zoom level

9. `onZoomAnimationEnd` Trigger onZoomAnimationEnd actions after the map is zoomed, returns `_event` object:

   - `maps`: has functions removed
   - `zoom`: map zoom level

## Methods

1. `addMarker` Accepts a single parameter object `marker` with properties.
2. `removeMarker` Accepts a single parameter object `marker` with position property.
3. `fitBounds` Accepts a two parameters, `bounds` and `mapSize`.

## Examples

1. Add a list of markers, one with a tooltip

   ```yaml
   - id: google_maps
     type: GoogleMaps
     properties:
       bootstrapURLKeys:
         key: ''
         libraries: ['visualization']
       mapOptions:
         panControl: true
         zoomControl: true
         fullscreenControl: true
       zoom: 14
       center:
         lat: -25.344
         lng: 131.036
       markers:
         - position:
             lat: -25.344
             lng: 131.036
           label: One
           tooltip: '<div style="color:blue">Hello World!</div>'
         - position:
             lat: -25.348
             lng: 131.038
           label: Two
   ```

2. Add a marker

   ```yaml
   - id: google_maps
     type: GoogleMaps
     properties:
       bootstrapURLKeys:
         key: ''
         libraries: ['visualization']
       mapOptions:
         panControl: true
         zoomControl: true
         fullscreenControl: true
       zoom: 14
       center:
         lat: -25.344
         lng: 131.036
     events:
       onClick:
         - id: add_marker
           type: CallMethod
           params:
             blockId: google_maps
             method: addMarker
             args:
               - position:
                   lat:
                     _event: lat
                   lng:
                     _event: lng
                 label: Hi
   ```

3. Remove a marker

   ```yaml
   - id: google_maps
     type: GoogleMaps
     properties:
       bootstrapURLKeys:
         key: ''
         libraries: ['visualization']
       mapOptions:
         panControl: true
         zoomControl: true
         fullscreenControl: true
       zoom: 14
       center:
         lat: -25.344
         lng: 131.036
     events:
       onClickMarker:
         - id: set_click
           type: SetState
           params:
             latLng:
               _event: latLng
         - id: remove_marker
           type: CallMethod
           params:
             blockId: google_maps
             method: removeMarker
             args:
               - position:
                   lat:
                     _state: latLng.lat
                   lng:
                     _state: latLng.lng
   ```

4. Fit bounds

   ```yaml
   - id: google_maps
     type: GoogleMaps
     properties:
       bootstrapURLKeys:
         key: ''
         libraries: ['visualization']
       mapOptions:
         panControl: true
         zoomControl: true
         fullscreenControl: true
       zoom: 14
       center:
         lat: -25.344
         lng: 131.036
     events:
       onClick:
         - id: fit_bounds
           type: CallMethod
           params:
             blockId: google_maps
             method: fitBounds
             args:
               - ne:
                   lat: 50.01038826014866
                   lng: -118.6525866875
                 sw:
                   lat: 32.698335045970396
                   lng: -92.0217273125
               - width: 640 # Map width in pixels
                 height: 380 # Map height in pixels
   ```

5. Add a heatmap

   ```yaml
   - id: google_maps
     type: GoogleMaps
     properties:
       bootstrapURLKeys:
         key: ''
         libraries: ['visualization']
       mapOptions:
         panControl: true
         zoomControl: true
         fullscreenControl: true
       zoom: 10
       center:
         lat: 34.0522
         lng: -118.2437
       heatmap:
         positions:
           - lat: 34.091158
             lng: -118.2795188
             weight: 1
           - lat: 34.0771192
             lng: -118.2587199
             weight: 2
           - lat: 34.083527
             lng: -118.370157
             weight: 1
           - lat: 34.0951843
             lng: -118.283107
             weight: 2
           - lat: 34.1033401
             lng: -118.2875469
             weight: 4
           - lat: 34.035798
             lng: -118.251288
             weight: 2
           - lat: 34.0776068
             lng: -118.2646526
             weight: 3
           - lat: 34.0919263
             lng: -118.2820544
             weight: 3
           - lat: 34.0568525
             lng: -118.3646369
             weight: 3
           - lat: 34.0285781
             lng: -118.4115541
             weight: 0
           - lat: 34.017339
             lng: -118.278469
             weight: 0
           - lat: 34.0764288
             lng: -118.3661624
             weight: 4
           - lat: 33.9925942
             lng: -118.4232475
             weight: 4
           - lat: 34.0764345
             lng: -118.3730332
             weight: 3
           - lat: 34.093981
             lng: -118.327638
             weight: 0
           - lat: 34.056385
             lng: -118.2508724
             weight: 1
           - lat: 34.107701
             lng: -118.2667943
             weight: 4
           - lat: 34.0450139
             lng: -118.2388682
             weight: 4
           - lat: 34.1031997
             lng: -118.2586152
             weight: 1
           - lat: 34.0828183
             lng: -118.3241586
             weight: 1
         options:
           radius: 20
           opacity: 1
   ```

## Other Lowdefy Blocks Packages

- [@lowdefy/blocks-basic](https://github.com/lowdefy/lowdefy/tree/main/packages/blocks/blocksBasic): Official Lowdefy blocks some basic Html elements.
- [@lowdefy/blocks-antd](https://github.com/lowdefy/lowdefy/tree/main/packages/blocks/blocksAntd): Official Lowdefy blocks for [Antd design](https://ant.design/).
- [@lowdefy/blocks-color-selectors](https://github.com/lowdefy/lowdefy/tree/main/packages/blocks/blocksColorSelectorsd): Official Lowdefy blocks for [react-color](https://casesandberg.github.io/react-color/).
- [@lowdefy/blocks-markdown](https://github.com/lowdefy/lowdefy/tree/main/packages/blocks/blocksMarkdown): Official Lowdefy blocks to render Markdown.
- [@lowdefy/blocks-amcharts](https://github.com/lowdefy/blocks-amcharts): Lowdefy blocks to render [AmCharts v4](https://www.amcharts.com/).
- [@lowdefy/blocks-aggrid](https://github.com/lowdefy/blocks-aggrid): Lowdefy blocks to render [Ag-Grid](https://www.ag-grid.com/) tables.

## More Lowdefy resources

- Getting started with Lowdefy - https://docs.lowdefy.com/tutorial-start
- Lowdefy docs - https://docs.lowdefy.com
- Lowdefy website - https://lowdefy.com
- Community forum - https://github.com/lowdefy/lowdefy/discussions
- Bug reports and feature requests - https://github.com/lowdefy/lowdefy/issues

## Licence

[MIT](https://github.com/lowdefy/blocks-template/blob/main/LICENSE)
