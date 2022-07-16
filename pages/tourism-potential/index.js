import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchAllTourismPotentialMapMarkers, fetchAllTourismPotentials, fetchTourismPotentialMapData } from "../../api-requests/tourism-potential-map";
import slugify from "../../common/slugify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"
import ContentCard from "../../components/ContentCard";
import Layout from "../../layouts/Layout";
import withLayout from "../../higher-order-components/withLayout";

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

function TourismPotential({ 
  mapData: { baseMap, markerIcon }, 
  markers,
  tourismPotentials
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full max-w-3xl">
      <h1 className="mb-4">Peta Potensi Pariwisata Singosaren</h1>
      <div className="max-w-4xl w-full mb-8">
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
          className="mb-4 min-w-full w-0"
        >
          <h2 className="text-lg font-semibold mb-2">{tourismPotential.name}</h2>
          <div className="prose prose-slate mb-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {tourismPotential.description}
            </ReactMarkdown>
          </div>
          <div className="overflow-x-scroll">
            <div className="flex min-w-max min-h-max">
              {
                tourismPotential.contents.map(content => (
                  <div key={content.id} className="w-64 mr-2">
                    <ContentCard content={content} />
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default withLayout(TourismPotential, Layout)