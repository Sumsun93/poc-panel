/**
 * Package import
 */
import L from 'leaflet'
import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, AttributionControl } from 'react-leaflet'
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
  key: string,
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
}

const LeaftletMap = ({ layer, markers = [], zoomValue = 1, positionValue = { lat: 0, lng: 0 } } : LeaftletMapProps) => {
  const minZoom = 0
  const maxZoom = 5

  const markerList = useMemo(() => {
    return markers.map((marker: MarkerType) => ({
      position: marker.position,
      key: marker.key,
      opacity: marker.opacity || 1,
      icon: L.icon({
        iconUrl: defaultIcon,
        iconSize: [24, 24],
        iconAnchor: [24, 24],
      }),
    }))
  }, [markers])

  const [isInteractable, setIsInteractable] = useState(true)
  const [latLng, setLatLng] = useState(positionValue)
  const [backgroundColor, setBackgroundColor] = useState()
  const [zoom, setZoom] = useState(zoomValue)
  const [curLayer, setCurLayer] = useState(_layers[layer])
  const position = new L.LatLng(latLng.lat, latLng.lng)

  const mapIsReady = () => {

  }

  return (
    <StyledMapContainer>
      <NorthPoint />
      <MapContainer
        doubleClickZoom={isInteractable}
        closePopupOnClick={isInteractable}
        dragging={isInteractable}
        zoomSnap={+isInteractable}
        trackResize={isInteractable}
        touchZoom={isInteractable}
        scrollWheelZoom={isInteractable}
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
      >
        <TileLayer
          url={curLayer.url}
          minZoom={minZoom}
          maxZoom={maxZoom}
          noWrap
          tms
          tileSize={256}
        />
        <AttributionControl position='bottomleft' prefix='teste' />

        {markerList.map(item => (
          <Marker opacity={item.opacity} key={item.key} position={item.position} icon={item.icon}>
            <Popup>{item.key}<br />{item.position.lng}, {item.position.lat}</Popup>
          </Marker>
        ))}
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
`

export default LeaftletMap
