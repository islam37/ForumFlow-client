import React from "react";
import Banner from "../components/mainComponents/Banner";

import PostsList from "../components/mainComponents/PostList";
import Announcements from "./AnnouncementforUser/Announcements";

const Home = () => {
  return (
    <>
      <Banner />

      <p className="text-lg font-semibold mt-6 text-center">Latest Announcements</p>

      <Announcements />

      <PostsList />
    </>
  );
};

export default Home;
