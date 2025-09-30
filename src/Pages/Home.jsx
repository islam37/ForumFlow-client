import React, { useState } from "react";
import Banner from "../components/mainComponents/Banner";
import Tags from "../components/mainComponents/Tags";
import Announcement from "../components/mainComponents/Announcements";
import PostsList from "../components/mainComponents/Pagination";
import PostDetails from "./PostDetails";

const Home = () => {
  const [selectedTag, setSelectedTag] = useState("");

  return (
    <>
      <Banner />

      <PostDetails></PostDetails>
      <PostsList />
      
    </>
  );
};

export default Home;
