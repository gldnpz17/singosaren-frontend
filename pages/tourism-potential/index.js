import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchAllTourismPotentialMapMarkers, fetchAllTourismPotentials, fetchTourismPotentialMapData } from "../../api-requests/tourism-potential-map";
import slugify from "../../common/slugify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"

const DynamicTourismPotentialMap = dynamic(() => import('../../components/TourismPotentialMap'), { ssr: false })

export async function getStaticProps() {
  return ({
    props: {
      mapData: await fetchTourismPotentialMapData(),
      markers: await fetchAllTourismPotentialMapMarkers(),
      tourismPotentials: await fetchAllTourismPotentials()
    }
  })
}

export default function TourismPotential({ 
  mapData: { baseMap, markerIcon }, 
  markers,
  tourismPotentials
}) {
  return (
    <div className="flex flex-col justify-center items-center p-8">
      <h1 className="mb-4">Peta Potensi Pariwisata Singosaren</h1>
      <div className="max-w-3xl w-1/2 mb-4">
        <DynamicTourismPotentialMap
          baseMap={{
            bounds: [baseMap.width, baseMap.height],
            url: baseMap.url  
          }}
          markerIcon={markerIcon}
          markers={markers}
        />
      </div>
      {tourismPotentials.map(tourismPotential => (
        <section 
          id={slugify(`${tourismPotential.name} ${tourismPotential.id}`)}
          key={tourismPotential.id}
        >
          <h2 className="text-lg font-semibold">{tourismPotential.name}</h2>
          <div className="prose prose-slate">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {tourismPotential.description}
            </ReactMarkdown>
          </div>
        </section>
      ))}
    </div>
  )
}