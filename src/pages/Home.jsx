import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Video from "./components/Video";
import NetError from "./NetError";
import blank from "./blank.jpg";

import { db } from "../utils/firebase";
import { onValue, ref } from "@firebase/database";

function Home() {
 const [videos, setVideos] = useState([]);
 const [error, setError] = useState(false);

 const fetchFiredb = () => {
  try {
   const query = ref(db, "videos");
   return onValue(query, (snapshot) => {
    const data = snapshot.val();
    if (snapshot.exists()) {
     setVideos(data);
    } else {
     setError("No video available!");
    }
   });
  } catch (error) {
   setError("Network error occurred.");
  }
 };
 useEffect(() => {
  fetchFiredb();
 }, []);

 if (error !== false) {
  return <NetError msg={error} />;
 }
 return (
  <>
   <Navbar />
   <div className="__home __commonCss">
    <div className="row">
     <div className="col-md-2">
      <Sidebar />
     </div>
     <div className="col-md-10">
      <div className="__video-container">
       <div className="row row-gap-4">
        {videos.map((x, i) => {
         if (x) {
          return (
           <Video
            id={i}
            name={x.title || "Please Wait or Refresh the Page!"}
            thumb={
             "https://firebasestorage.googleapis.com/v0/b/wetube-dev.appspot.com/o/photos%2Fvideo%2F" +
              x.thumbnail +
              "?alt=media" || blank
            }
            pub={x.publicationDate || "0"}
            channelName={x.channelName || "Error Occured"}
            channelThumb={
             "https://firebasestorage.googleapis.com/v0/b/wetube-dev.appspot.com/o/photos%2Fprofile%2F" +
              x.channelThumbnail +
              "?alt=media" || blank
            }
            duration={x.duration || "00:00"}
            views={x.views || "0"}
           />
          );
         }
        })}
       </div>
      </div>
     </div>
    </div>
   </div>
  </>
 );
}

export default Home;
