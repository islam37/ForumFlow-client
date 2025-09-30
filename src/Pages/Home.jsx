import React, { useState } from "react";
import Banner from "../components/mainComponents/Banner";
import Tags from "../components/mainComponents/Tags";
import Announcement from "../components/mainComponents/Announcements";
import PostsList from "../components/mainComponents/PostList";

const Home = () => {
  const [selectedTag, setSelectedTag] = useState("");

  return (
    <>
      <Banner />
      <Tags setSelectedTag={setSelectedTag} />  {/* optional */}
      <Announcement />  
      <PostsList selectedTag={selectedTag} />
    </>
  );
};

export default Home;
