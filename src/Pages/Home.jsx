import React from 'react';
import Banner from '../components/mainComponents/Banner';
import Tags from '../components/mainComponents/Tags';
import Announcement from '../components/mainComponents/Announcements';

const Home = () => {
    return (
        <>
            <Banner />
            <Tags />
            <Announcement></Announcement>
        </>
    );
};

export default Home;
