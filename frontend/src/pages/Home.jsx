import React from 'react'
import HeroSection from '../components/Home/HeroSection'
import SpecialityMenu from '../components/Home/SpecialityMenu'
import Topdoctors from '../components/Home/Topdoctors'
import Banner from '../components/Home/Banner'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <SpecialityMenu/>
      <Topdoctors/>
      <Banner/>
    </div>
  )
}

export default Home