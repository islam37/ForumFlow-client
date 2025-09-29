import React, { useState } from "react";
import Banner from "../components/mainComponents/Banner";
import Tags from "../components/mainComponents/Tags";
import Announcement from "../components/mainComponents/Announcements";
import PostsList from "../components/mainComponents/Pagination";

const Home = () => {
  const [selectedTag, setSelectedTag] = useState("");

  return (
    <>
      <Banner />
      <Tags onTagClick={setSelectedTag} />
      <PostsList selectedTag={selectedTag} />
      <Announcement />
    </>
  );
};

export default Home;
