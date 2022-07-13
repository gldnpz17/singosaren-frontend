import { gqlClient } from "../../common/gqlClient";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";
import ContentCard from "../../components/ContentCard";
import SearchField from "../../components/SearchField";
import TagButton from "../../components/TagButton";
import { fetchAllTags } from "../../api-requests/tags";
import {
  fetchAllContents,
  fetchTagContents,
} from "../../api-requests/contents";
import { useRouter } from "next/router";

export async function getServerSideProps({ query }) {
  return {
    props: {
      tags: await fetchAllTags(),
      contents: Boolean(query.tag)
        ? await fetchTagContents(query.tag)
        : await fetchAllContents(),
    },
  };
}

export default function Contents({ tags, contents }) {
  const router = useRouter();

  return (
    <div className="mt-8 mx-4 xl:mx-56 md:mx-12 lg:mx-32 flex flex-col items-center">
      <div className="mb-6 w-full">
        <div className="font-medium mb-2">Pencarian</div>
        <div className="w-full mb-4">
          <SearchField />
        </div>
        <div className="font-medium">Kategori pler</div>
        <div className="flex items-center mt-2 space-x-2 w-full overflow-x-auto">
          {tags.map((tag) => (
            <TagButton
              key={tag.id}
              tag={tag}
              active={router.query.tag === tag.id}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3 xl:gap-x-20 gap-y-4">
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    </div>
  );
}
