"use client";

import { useMusicPlayer } from "@/context/MusicPlayerContext";
import MusicPlayerBar from "./MusicPlayerBar";
import FullScreenPlayer from "./FullScreenPlayer";
import { AnimatePresence, motion } from "framer-motion";

const PersistentPlayerLayout = () => {
  const { currentMusic, isExpanded, currentTrackIndex, playlist } =
    useMusicPlayer();

  console.log("Current Music in PersistentPlayerLayout:", currentMusic);

  console.log(
    "test ",
    currentTrackIndex !== null ? playlist[currentTrackIndex] : null
  );

  // DÒNG CODE NÀY THỰC HIỆN YÊU CẦU CỦA BẠN:
  // Nếu không có bài hát nào được chọn trong context (`currentMusic` là `null`),
  // component sẽ trả về `null` và không render bất cứ thứ gì.
  if (!currentMusic) {
    return null;
  }

  // Nếu có `currentMusic`, nó sẽ render thanh player hoặc player toàn màn hình
  return (
    <>
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            key="bar"
            // ... animation props
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <MusicPlayerBar />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="fullscreen"
            // ... animation props
            className="fixed inset-0 z-[60]"
          >
            <FullScreenPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PersistentPlayerLayout;
