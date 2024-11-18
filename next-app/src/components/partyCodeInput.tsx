"use client";
import styles from './partyCodeInput.module.css';
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import config from "../config.json"
const socket = io(`ws://${config.host}:${config.port}`);

export default function PartyCodeInput({ nicknameRef } : {nicknameRef: any}) {
  let [partyCode, setPartyCode] = useState<string>("");

  // pour accéder au nickname:
  // props.nicknameRef.current.getNickname()
  useEffect(() => {
    // desactivé celui d'avant
    socket.off('party:join');
    socket.on('party:join', (res) => {
      if (res.status) alert(res.error)
      else {
        localStorage.setItem('uuid', res.uuid);
        window.location.replace('/play');
      }
    })
  }, []) 

  return (
    <div id={styles.box}>
      <div><h2>Recherche ou crée une partie</h2></div>
      <div id={styles.partyCodeInput}>
        <div className={styles.input}><input type="text" placeholder="party code" value={partyCode} spellCheck={false} onChange={(e) => {
          setPartyCode(e.target.value);
          localStorage.setItem('code', e.target.value);
        }}/></div>
        <button className={styles.buttonValid}
        onClick={() => {
          socket.emit('party:join', partyCode, nicknameRef.current.getNickname());
        }}>→</button>
      </div>
      <div id={styles.createParty}><button onClick={() => {
        localStorage.setItem('username', nicknameRef.current.getNickname());
        window.location.replace('/create');
      }}>CRÉER UNE PARTIE</button></div>
    </div>
  )
}