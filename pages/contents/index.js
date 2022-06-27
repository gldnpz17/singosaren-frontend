import { gqlClient } from "../../common/gqlClient";
import { gql } from '@apollo/client'
import { DateTime } from 'luxon'
import ContentCard from "../../components/ContentCard";
import SearchField from "../../components/SearchField";
import TagButton from "../../components/TagButton";
import { fetchAllTags } from "../../api-requests/tags";
import { fetchAllContents } from "../../api-requests/contents";

export async function getStaticProps() {
  return ({
    props: {
      tags: await fetchAllTags(),
      contents: await fetchAllContents() 
    }
  })
}

export default function Contents({ tags, contents }) {
  return (
    <div className="mt-8 mx-36 flex flex-col items-center">
      <div className='mb-6 w-3/4'>
        <SearchField />
        <div className='flex items-center mt-2 space-x-2'>
          <p>Cari berdasarkan tag :</p>
          { tags.map(tag => <TagButton tag={tag} />) }
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {
          contents.map(content => (
            <ContentCard content={content} />
          ))
        }
      </div>
    </div>
  )
}