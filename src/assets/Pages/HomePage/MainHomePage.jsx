import React from 'react'
import MainSec1 from '../HomePage/MainSecs/MainSec1'
import DealsSec from './MainSecs/DealsSec'
import HomeAndOutdSec from './MainSecs/HomeAndOutdSec'
import ElectronicsSec from './MainSecs/ElectronicsSec'
import QuoteSend from "./MainSecs/QuoteSend"
import RecommendedItem from './MainSecs/RecommendedItem'
import Services from './MainSecs/Services'
import Regions from './MainSecs/Regions'

const MainHomePage = () => {
  return (
    <>
    <MainSec1/>
    <DealsSec/>
    <HomeAndOutdSec/>
    <ElectronicsSec/>
    <QuoteSend/>
    <RecommendedItem/>
    <Services/>
    <Regions/>
    
    </>
  )
}

export default MainHomePage
