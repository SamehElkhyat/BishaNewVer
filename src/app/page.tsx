"use client";
import React from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppWrapper from "../components/AppWrapper";
import mapStyles from "../styles/Map.module.css";
import Main from "./Main";
import NewsSections from "./NewsSections";
import Mainservices from "./Mainservices";
import DetailsBisha from "./DetailsBisha";
import EventsSection from "./EventsSection";
import Highlights from "./Highlights";
// Dynamically import the MapClient component with no SSR
const MapClient = dynamic(() => import("../components/MapClient"), {
  ssr: false,
});

const HomePage = () => {
  return (
    <AppWrapper>
      <div>
        <Header />
        <Main />
        <Mainservices />
        <NewsSections />

        {/* بيشة — indicators + interactive map */}
        <section className={mapStyles.mapSection}>
          <MapClient />
        </section>

        <Highlights />
        <EventsSection />
        <DetailsBisha />

        {/* Footer Section */}
        <Footer />
      </div>
    </AppWrapper>
  );
};

export default HomePage;
