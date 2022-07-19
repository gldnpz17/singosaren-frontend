import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchAllTourismPotentialMapMarkers, fetchAllTourismPotentials, fetchTourismPotentialMapData } from "../../api-requests/tourism-potential-map";
import slugify from "../../common/slugify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"
import ContentCard from "../../components/ContentCard";
import Layout from "../../layouts/Layout";
import withLayout from "../../higher-order-components/withLayout";
import configs from "../../common/configs";

const DynamicTourismPotentialMap = dynamic(() => import('../../components/TourismPotentialMap'), { ssr: false })

export async function getStaticProps() {
  return ({
    props: {
      mapData: await fetchTourismPotentialMapData(),
      markers: await fetchAllTourismPotentialMapMarkers(),
      tourismPotentials: await fetchAllTourismPotentials()
    },
    revalidate: configs.isrDurationSeconds
  })
}

function TourismPotential({ 
  mapData: { baseMap, markerIcon }, 
  markers,
  tourismPotentials
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full max-w-3xl scroll-smooth">
      <h1 className="font-bold text-2xl mb-8 w-full">Peta Potensi Pariwisata Singosaren</h1>
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
          className="mb-4 min-w-full w-0 p-6 border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-2">{tourismPotential.name}</h2>
          <div className="prose prose-slate mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {tourismPotential.description}
            </ReactMarkdown>
          </div>
          <div className="relative w-full flex overflow-x-auto snap-x snap-mandatory">
            {
              tourismPotential.contents.map(content => (
                <div key={content.id} className=" w-72 mr-6 shrink-0 snap-center">
                  <ContentCard content={content} />
                </div>
              ))
            }
            </div>
        </section>
      ))}
    </div>
  )
}

export default withLayout(TourismPotential, Layout)