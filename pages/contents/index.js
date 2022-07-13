import { gqlClient } from "../../common/gqlClient";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";
import ContentCard from "../../components/ContentCard";
import SearchField from "../../components/SearchField";
import TagButton from "../../components/TagButton";
import { fetchAllTags } from "../../api-requests/tags";
import {
  fetchContents
} from "../../api-requests/contents";
import { useRouter } from "next/router";
import { useMemo } from "react";

export async function getServerSideProps({ query }) {
  const tag = query.tag ?? null
  const page = query.page ? Number.parseInt(query.page) : 1

  const { contents, meta } = await fetchContents(page, tag)

  return {
    props: {
      tags: await fetchAllTags(),
      meta,
      contents
    },
  };
}

export default function Contents({ tags, contents, meta }) {
  const router = useRouter();

  const { page, pageCount } = meta.pagination

  const jumpToPage = (page) => {
    const params = new URLSearchParams(window.location.search)

    params.set('page', page)

    window.location.href = `/contents?${params.toString()}`
  }

  const paginationButtons = useMemo(() => {
    const PREVIOUS_NEXT_COUPLE_OF_PAGES = 3
    const buttons = []

    if (page !== 1) {
      buttons.push({ text: '<<', onClick: () => jumpToPage(1) })
      buttons.push({ text: '<', onClick: () => jumpToPage(page - 1) })
      for (let i = page - 1; i >= page - PREVIOUS_NEXT_COUPLE_OF_PAGES && i >= 1; i--) {
        buttons.push({ text: i.toString(), onClick: () => jumpToPage(i) })
      }
    } 
    buttons.push({ text: page.toString(), onClick: null })
    if (page !== pageCount) {
      for (let i = page + 1; i <= page + PREVIOUS_NEXT_COUPLE_OF_PAGES && i <= pageCount; i++) {
        buttons.push({ text: i.toString(), onClick: () => jumpToPage(i) })
      }
      buttons.push({ text: '>', onClick: () => jumpToPage(page + 1) })
      buttons.push({ text: '>>', onClick: () => jumpToPage(pageCount) })
    }

    return buttons
  }, [page, pageCount])

  return (
    <div className="mt-8 mx-4 xl:mx-56 md:mx-12 lg:mx-32 flex flex-col items-center">
      <div className="mb-6 w-full">
        <div className="font-medium mb-2">Pencarian</div>
        <div className="w-full mb-4">
          <SearchField />
        </div>
        <div className="font-medium">Kategori artikel</div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3 xl:gap-x-20 gap-y-4 mb-8">
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
      <div>
        <div>Menampilkan halaman {page} dari {pageCount}</div>
        <div className='flex gap-2 justify-center'>
          {paginationButtons.map(button => {
            if (button.onClick) {
              return (
                <button 
                  className='hover:underline'
                  key={button.text}
                  onClick={button.onClick}
                >
                  {button.text}
                </button>
              )
            } else {
              return (
                <span className='font-bold' key={button.text}>{button.text}</span>
              )
            }
          })}
        </div>
      </div>
    </div>
  );
}
