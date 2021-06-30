import "../styles/global.scss"

import Header from "../components/Header";
import Player from "../components/Player";

import styles from '../styles/app.module.scss';
import { PlayerContextProvaider } from "../contexts/PlayerContext";
import React, { useState } from "react";

function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvaider>
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
    </PlayerContextProvaider>
  )
}

export default MyApp
