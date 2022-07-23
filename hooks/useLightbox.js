import { createContext, useContext, useState } from "react"
import { Close } from "../common/icons"

const LightboxContext = createContext({
  open() { }
})

function LightboxProvider({ children }) {
  const [imageUrl, setImageUrl] = useState(null)

  function open(url) {
    setImageUrl(url)
  }

  return (
    <>
      <div 
        className={`${imageUrl ? 'fixed' : 'hidden'} top-0 left-0 w-full h-full overflow-auto`}
        style={{ zIndex: 3000 }}
      >
        <div className='absolute top-0 bottom-0 left-0 right-0 bg-black opacity-80' style={{ zIndex: 3100 }} 
          onClick={() => setImageUrl(null)}
        />
        <div style={{ zIndex: 3200 }} className='relative flex flex-col items-center h-full py-8 md:p-8 gap-6'>
          <div className='w-full items-center content-center flex-grow bg-contain bg-no-repeat bg-center'
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </div>
        <button className='absolute top-2 md:top-8 right-2 md:right-8 h-10 w-10 text-white hover:text-indigo-600 duration-150'
          style={{ zIndex: 3300 }}
          onClick={() => setImageUrl(null)}
        >
          <Close />
        </button>
      </div>
      <LightboxContext.Provider value={{ open }}>
        {children}
      </LightboxContext.Provider>
    </>
  )
}

export { LightboxProvider, useLightbox }

function useLightbox() {
  const { open } = useContext(LightboxContext)

  return { open }
}