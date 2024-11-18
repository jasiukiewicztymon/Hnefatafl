// On utilise le client pour pouvoir redistribuer les informations entre les composants
"use client";

import Image from "next/image";
import styles from "./page.module.css";
import NicknameInput from "../components/nicknameInput";
import PartyCodeInput from "../components/partyCodeInput"
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import moment from 'moment'

import config from "../config.json"

const socket = io(`ws://${config.host}:${config.port}`);
export default function Home() {
  const nicknameInput = useRef();
  const [getGames, setGames] = useState([]);

  useEffect(() => {
    socket.off('getGames');
    socket.on('getGames', (games) => {
      setGames(games);
      console.log(games);
    })

    socket.emit('getGames');
  }, [])

  return (
    <main className={styles.container}>
      <div id={styles.header}>
        <h1>Hnefatafl</h1>
        <h2>Un vrai jeu de Vikings <img src="logo.png" width={25}/></h2>
      </div>
      <NicknameInput ref={nicknameInput}></NicknameInput>
      <PartyCodeInput nicknameRef={nicknameInput}></PartyCodeInput>
      <div>
        {getGames.map(e => {
          return <div>
            <h4>Partie <i>{e.code}</i></h4>
            <div>
              Expire à: {moment.unix(e.deadspan).format("h:mm:ss a")}
            </div>
            <div>
              Board size: {e.config.size}x{e.config.size}
            </div>
            <div>
              Mouvements: {(() => {
                if (e.config.mouvements == 1) return 'croix';
                else if (e.config.mouvements == 2) return 'adjacents';
                return 'default';
              })()}
            </div>
            <div>
              Le roi doit atteindre n'apporte quel bord: <input type="checkbox" checked={e.config.boardEnd} />
            </div>
            <div>
              Le roi est protégé au bord du plateau: <input type="checkbox" checked={e.config.borderProtection} />
            </div>
            <a href={"/join/"+e.code}>Rejoindre</a>
          </div>
        })}
      </div>
    </main>
  );
}
