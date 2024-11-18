"use client";
import styles from './createParty.module.css';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import config from "../config.json"

const socket = io(`ws://${config.host}:${config.port}`);

export default function NicknameInput() {
  useEffect(() => {
    socket.on('party:create', (res) => {
      // alert(JSON.stringify(res))
      if (res.status == 1) alert(res.error);
      else {
        localStorage.setItem('code', res.code);
        localStorage.setItem('uuid', res.uuid);
  
        window.location.replace('/play')
      }
    })
  }, [])

  const [boardSize, setBoardSize] = useState(13);
  const [mouvement, setMouvement] = useState(0);
  const [isBorderProtection, setIsBorderProtection] = useState(false);
  const [isBorderWin, setIsBorderWin] = useState(false);
  const [isCornerWhite, setIsCornerWhite] = useState(false); //true

  function createParty() {
    socket.emit('party:create', {
      size: boardSize,
      mouvements: mouvement,
      borderProtection: isBorderProtection,
      boardEnd: isBorderWin,
      whiteFort: isCornerWhite
    }, localStorage.getItem('username'));
  }

  return (
    <div id={styles.main}>
      <div id={styles.settings}>
        <div onChange={(e) => {
          setBoardSize(e.target.value)
        }}>
          <h3>Taille du plateau</h3>
          <div><label>13x13</label><input type='radio' name='boardSize' value={13} defaultChecked={true}></input></div>
          <div><label>11x11</label><input type='radio' name='boardSize' value={11}></input></div>
        </div>

        <div onChange={(e) => {
          setMouvement(e.target.value)
        }}>
          <h3>Déplacements</h3>
          <div><label>Par défaut</label><input type='radio' name='mouvements' value={0} defaultChecked={true}></input></div>
          <div><label>En croix</label><input type='radio' name='mouvements' value={1}></input></div>
          <div><label>Adjacent</label><input type='radio' name='mouvements' value={2}></input></div>
        </div>
        <div>
          <h3>Autres</h3>
          <div><label>Roi pas capturable sur les bords</label><input type='checkbox' disabled={isBorderWin} checked={isBorderProtection} onChange={() => {
            setIsBorderProtection(!isBorderProtection);
          }}></input></div>
          <div><label>Roi doit se rendre vers une boardure pour gagner</label><input type='checkbox' checked={isBorderWin} onChange={() => {
            setIsBorderWin(!isBorderWin);
            if (!isBorderWin) {
              setIsCornerWhite(false);
              setIsBorderProtection(false);
            }
          }}></input></div>
          {false && <div><label>Les blancs peuvent s'arrêter dans les forts dans les coins</label><input type='checkbox' disabled={isBorderWin} checked={isCornerWhite} onChange={() => {
            setIsCornerWhite(!isCornerWhite);
          }}></input></div>}
        </div>
      </div>

      <div id={styles.submit}>
      <button id={styles.createPartyButton} onClick={createParty}>CRÉER UNE PARTIE</button>
      </div>
    </div>
  )
}