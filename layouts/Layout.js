import { useMemo } from "react"
import { useState } from "react"
import { ChevronUp, Close, Facebook, Instagram, Location, Mail, Menu, Phone, Web, YouTube } from "../common/icons"

function NavBarButton({ children, href }) {
  return (
    <a href={href} className='hover:text-indigo-600 duration-150'> 
      {children}
    </a>
  )
}

function NavBarMenu({ children, href }) {
  return (
    <a href={href} className='h-12 flex items-center px-4 border-b hover:text-indigo-500 cursor-pointer duration-150 border-gray-300 min-h-0 overflow-hidden'>
      {children}
    </a>
  )
}

function ItemWithIcon({ children, icon }) {
  const Icon = icon

  return (
    <li className='flex text-sm items-start'>
      <div className='h-5 flex items-center text-indigo-700 mr-1'>
        <div className='h-4'>
          <Icon className='h-full' />
        </div>
      </div>
      <div>
        {children}
      </div>
    </li>
  )
}

function SocialButton({ logo, href }) {
  const Logo = logo

  return (
    <a className='h-10 rounded-full hover:bg-indigo-100 hover:brightness-95 p-1 duration-150' href={href}>
      <Logo className='h-full text-indigo-700' />
    </a>
  )
}

export default function Layout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(false)

  function scrollToTop() {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='relative'>
      <button
        onClick={scrollToTop} 
        className='fixed right-8 bottom-8 w-12 h-12 rounded-full bg-indigo-500 text-indigo-50 cursor-pointer'
        style={{ zIndex: 1000 }}
      >
        <ChevronUp />
      </button>
      <div className='h-16 bg-indigo-50 flex py-4 px-4 xl:px-60 md:px-12 lg:px-32 items-center'>
        <div>[Logo Here]</div>
        <div className='flex-grow'></div>
        <div className='md:flex gap-6 hidden'>
          <NavBarButton href='/contents'>Artikel</NavBarButton>
          <NavBarButton href='/tourism-potential'>Peta Potensi Wisata</NavBarButton>
          <NavBarButton href='/tour-packages'>Paket Wisata</NavBarButton>
        </div>
        <button 
          className='h-8 w-8 hover:text-indigo-600 duration-150 md:hidden'
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? <Close /> : <Menu />}
        </button>
      </div>
      <div 
        className={`${isNavOpen ? 'h-36' : 'h-0'} md:hidden flex flex-col absolute top-16 bg-white left-0 right-0 overflow-hidden transition-all ease-in-out duration-300`}
        style={{ zIndex: 2000 }}
      >
        <NavBarMenu href='/contents'>Artikel</NavBarMenu>
        <NavBarMenu href='/tourism-potential'>Peta Potensi Wisata</NavBarMenu>
        <NavBarMenu href='/tour-packages'>Paket Wisata</NavBarMenu>
      </div>
      <div className='my-8 lg:my-10 mx-4 xl:mx-60 md:mx-12 lg:mx-32 flex items-center flex-col'>
        {children}
      </div>
      <div className='bg-indigo-50 grid grid-cols-12 py-8 lg:py-10 px-4 xl:px-60 md:px-12 lg:px-32 gap-6 w-full'>
        <div className='col-span-12 md:col-span-4'>
          <div className='col-span-12 flex md:hidden justify-center'>
            <img src='/bantul-logo.png' className='w-36 max-w-full object-scale-down' />
          </div>
          <div className='font-semibold mb-1'>Tentang Kalurahan Singosaren</div>
          <hr className='mb-2' />
          <p>
            Desa Singosaren merupakan desa maju yang pernah menjadi 
            juara umum ketahanan pangan nasional di tahun 2006. 
            Desa ini terletak di Kecamatan Banguntapan Kab Bantul, Yogyakarta
          </p>
        </div>
        <div className='col-span-4 justify-center hidden md:flex'>
          <img src='/bantul-logo.png' className='w-36 max-w-full object-scale-down' />
        </div>
        <div className='col-span-12 md:col-span-4'>
          <div className='font-semibold mb-1'>Kontak Kalurahan Singosaren</div>
          <hr className='mb-2' />
          <ul className='flex gap-1 flex-col'>
            <ItemWithIcon icon={Location}>
              Sarirejo II RT.005 Singosaren Banguntapan Bantul <br /> 
              Kapanewon Banguntapan Kabupaten Bantul <br />
              DI Yogyakarta <br />
              Kodepos 55193 <br /> 
            </ItemWithIcon>
            <ItemWithIcon icon={Phone}>
              Telepon : (0274)4436567
            </ItemWithIcon>
            <ItemWithIcon icon={Mail}>
              Email : desa.singosaren@bantulkab.go.id
            </ItemWithIcon>
            <ItemWithIcon icon={Web}>
              Website : <a href='https://singosaren.id' className='underline'>https://singosaren.id</a>
            </ItemWithIcon>
          </ul>
        </div>
        <div className='col-span-12'>
          <hr className='mb-2' />
          <div className='flex gap-4 justify-center'>
            <SocialButton logo={Facebook} href='https://www.facebook.com/pemdes.kalimandi.9' />
            <SocialButton logo={YouTube} href='https://www.youtube.com/channel/UC8fDoTeLo7aBkFRO8BUcjLg' />
            <SocialButton logo={Instagram} href='https://www.instagram.com/pemdes.kalimandi/' />
          </div>
        </div>
      </div>
    </div>
  )
}