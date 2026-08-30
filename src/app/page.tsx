"use client";
import React from "react";
import dynamic from "next/dynamic";
import AppWrapper from "../components/AppWrapper";
import mapStyles from "../styles/Map.module.css";
import Main from "./Main";
import NewsSections from "./NewsSections";
import Mainservices from "./Mainservices";
import AboutTeaser from "./AboutTeaser";
import EventsSection from "./EventsSection";
import ActivitiesSection from "./ActivitiesSection";
import FAQSection from "./FAQSection";
// Dynamically import the MapClient component with no SSR
const MapClient = dynamic(() => import("../components/MapClient"), {
  ssr: false,
});

const HomePage = () => {
  return (
    <AppWrapper>
      <div>
        <Main />
        <Mainservices />
        <AboutTeaser />
        <NewsSections />

        {/* بيشة — indicators + interactive map */}
        <section className={mapStyles.mapSection}>
          <MapClient />
        </section>

        <EventsSection />
        <ActivitiesSection />
        <FAQSection />
      </div>
    </AppWrapper>
  );
};

export default HomePage;
