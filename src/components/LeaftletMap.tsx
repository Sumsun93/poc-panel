/**
 * Package import
 */
import L from 'leaflet'
import { useCallback, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, AttributionControl, Polyline, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import styled from 'styled-components'

import 'leaflet/dist/leaflet.css'

/**
 * Local import
 */
import defaultIcon from '@/assets/images/default.png'

/**
 * Type
 */
type MarkerType = {
  position: L.LatLng,
  icon?: L.Icon<L.IconOptions> | L.DivIcon,
  opacity?: number,
  selected?: boolean,
  label?: string,
}

/**
 * Local function
 */
const CRS = function (transform: {a: number, b: number, c: number, d: number}) {
  return {
    projection: {
      project: function project (latlng: L.LatLng) {
        return new L.Point(latlng.lat, latlng.lng)
      },
      unproject: function unproject (point: L.Point) {
        return new L.LatLng(point.x, point.y)
      },
      bounds: {
        min: new L.Point(-4230, 8420),
        max: new L.Point(8216, -3756),
      },
    },
    transformation: new L.Transformation(
      transform.a,
      transform.b,
      transform.c,
      transform.d,
    ),
  }
}

const _crs: any = L.Util.extend({}, L.CRS, CRS({
  a: 1 / 12446,
  b: 3756 / 8192,
  c: -1 / 12446,
  d: 5525 / 8192,
}))

const _layers : {[key: string] : { url: string, background: string}} = {
  satellite: {
    url: '/img/map/satellite/{z}/{x}/{y}.png',
    background: '#143d6b',
  },
  road: {
    url: '/img/map/road/{z}/{x}/{y}.png',
    background: '#1862ad',
  },
  atlas: {
    url: '/img/map/atlas/{z}/{x}/{y}.png',
    background: '#0fa8d2',
  },
}

/**
 * Component
 */
interface LeaftletMapProps {
  layer: 'satellite' | 'road' | 'atlas',
  markers?: MarkerType[],
  zoomValue?: number,
  positionValue?: { lat: number, lng: number },
  markerZoomIndex?: number | null,
}

const CustomMarker = ({ position, icon, opacity, selected, label }: MarkerType) => {
  const map = useMap()

  useEffect(() => {
    if (selected) {
      map.setView(position, 5)
    }
  }
  , [selected, position, map])

  return (
    <Marker opacity={opacity} position={position} icon={icon}>
      {label && <Popup>{label}</Popup>}
    </Marker>
  )
}

const LeaftletMap = ({ layer, markers = [], zoomValue = 1, positionValue = { lat: 0, lng: 0 }, markerZoomIndex } : LeaftletMapProps) => {
  const minZoom = 0
  const maxZoom = 10

  const markerList = useMemo(() => {
    return markers.map((marker: MarkerType, index) => ({
      position: marker.position,
      key: `${index}`,
      opacity: marker.opacity || 1,
      icon: L.icon({
        iconUrl: marker.icon?.options.iconUrl ? marker.icon.options.iconUrl : defaultIcon,
        iconSize: [15, 15],
        iconAnchor: [15, 15],
      }),
      label: marker.label,
    }))
  }, [markers])

  const latLng = useMemo(() => positionValue, [positionValue])
  const zoom = useMemo(() => zoomValue, [zoomValue])
  const curLayer = useMemo(() => _layers[layer], [layer])
  const position = new L.LatLng(latLng.lat, latLng.lng)

  const mapIsReady = () => {
  }

  const Markers = useCallback(() => (
    <MarkerClusterGroup>
      {markerList.map((item, index) => (
        <CustomMarker
          key={item.key}
          position={item.position}
          icon={item.icon}
          opacity={item.opacity}
          selected={markerZoomIndex === index}
          label={item.label}
        />
      ))}
    </MarkerClusterGroup>
  ),
  [markerList, markerZoomIndex],
  )

  return (
    <StyledMapContainer>
      <NorthPoint />
      <MapContainer
        doubleClickZoom
        closePopupOnClick
        dragging
        zoomSnap={0.5}
        trackResize
        touchZoom
        scrollWheelZoom
        className='map'
        crs={_crs}
        center={position}
        attributionControl={false}
        whenReady={mapIsReady}
        zoomControl
        style={{
          backgroundColor: curLayer.background,
        }}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
      >
        <TileLayer
          url={curLayer.url}
          minZoom={minZoom}
          maxZoom={maxZoom}
          maxNativeZoom={5}
          noWrap
          tms
          tileSize={256}
        />
        <AttributionControl position='bottomleft' prefix='teste' />

        <Markers />

        {/* draw line between markers */}
        {markers.length > 1 && (
          <Polyline
            positions={markers.map((marker) => marker.position)}
            color='#FFC115'
            weight={3}
            opacity={1}
            smoothFactor={1}
          />
        )}
      </MapContainer>
    </StyledMapContainer>
  )
}

/**
 * Styled Component
 */
const NorthPoint = styled.div`
  border-radius: 50%;
  background-color: black;
  color: white;
  position: absolute;
  top: 0;
  left: calc(50% - 6px);
  width: 16px;
  height: 16px;
  line-height: 10px;
  text-align: center;
  font-size: 10px;
  padding: 1px;
  z-index: 999;
  border: 2px solid white;
  opacity: .8;

  &:before {
    content: 'N';
  }
`

const StyledMapContainer = styled(MapContainer)`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: rgba(0, 0, 0, .5);
  transition: transform .15s linear;

  > .map {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .leaflet-marker-pane {
    > img {
      transition: transform .15s linear;
    }
  }

  .leaflet-control-attribution {
    display: none;
  }

  .custom-marker {
    .pi {
      color: #FFC115 !important;
    }
  ;
  }
`

export default LeaftletMap
