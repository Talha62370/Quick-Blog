import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
// import Loader from '../components/Loader'

const Home = () => {
  return (
    <>
    <Navbar/>
    <Header/>
    <BlogList />
    <NewsLetter />
    <Footer />
    {/* <Loader /> */}
    </>
  )
}

export default Home