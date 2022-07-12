import { CRS, extend, map, imageOverlay, icon, Point } from "leaflet"
import { useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, Marker, Popup, useMapEvent, ImageOverlay, useMap, Tooltip, useMapEvents } from "react-leaflet"
import slugify from "../common/slugify"

function MapMarker({ markerIcon, marker: { id, name, x, y, coverImageUrl, facilities } }) {
  return (
    <>
      <Marker
        eventHandlers={{
          click: () => {
            //alert('Hello')
          },
          mouseout: function (e) {
          },
          mouseover: function(e) {
          }
        }} 
        position={[x, y]} 
        icon={markerIcon}
      >
        <Popup offset={new Point(150, 110)}>
          <div className='w-60 m-0'>
            <img src={coverImageUrl} className='w-full h-24 object-cover' />
            <div className='p-2 flex flex-col'>
              <div>{name}</div>
              <div className="flex">
                {facilities.map(facility => (
                  <button key={facility.tooltip} className="h-6 w-6">
                    <img src={facility.iconUrl} />
                  </button>
                ))}
              </div>
              <a href={`/tourism-potential#${slugify(`${name} ${id}`)}`} className='self-end'>Lebih lanjut</a>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  )
}

function MapResize({ updateMapWidth }) {
  const map = useMapEvents({ resize: updateMapWidth })

  return <></>
}

export default function TourismPotentialMap({ 
  baseMap: { bounds: baseMapBounds, url: baseMapUrl },
  markerIcon: markerData,
  markers
}) {
  const markerIcon = useMemo(() => {
    const { url, width, height } = markerData

    return (icon({
      iconUrl: url,
      iconSize: [48, (height/width) * 48]
    }))
  }, [])

  const [width, height] = baseMapBounds

  const mapRef = useRef()

  const updateMapWidth = async (e) => {
    const mapHeight = (e.target._size.x/width) * height
    document.getElementById('tourism-potential-map').style.height = `${mapHeight}px`
    e.target.invalidateSize()
    e.target.fitBounds([[0, 0], [height, width]])
    e.target.flyTo([height/2, width/2])
    //e.target.setZoom(e.target.getBoundsZoom([[0, 0], [width, height]]))
  }

  return (
    <>
      <MapContainer zoomSnap={0} id="tourism-potential-map" maxBounds={[[0, 0], [height, width]]} ref={mapRef} whenReady={updateMapWidth} style={{ height: 0 }} center={[width/2, height/2]} crs={CRS.Simple} zoom={13}>
        <ImageOverlay bounds={[[0, 0], [height, width]]} url={baseMapUrl} />
        {markers.map(marker => (
          <MapMarker
            key={marker.id}
            markerIcon={markerIcon}
            marker={marker}
          />
        ))}
        <MapResize updateMapWidth={updateMapWidth} />
      </MapContainer>
    </>
  )
}