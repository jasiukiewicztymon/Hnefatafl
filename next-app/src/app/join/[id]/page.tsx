"use client";
import styles from './style.module.css';
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import config from "../../../config.json"
const socket = io(`ws://${config.host}:${config.port}`);

export default function Join({ params }: { params: { id: string } }) {
  let [name, setName] = useState<string>("player1023");

  // pour accéder au nickname:
  // props.nicknameRef.current.getNickname()
  useEffect(() => {
    localStorage.setItem('code', params.id);
    localStorage.setItem('username', name);

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
      <div><h2>Rejoindre {params.id}</h2></div>
      <div id={styles.partyCodeInput}>
        <div className={styles.input}><input type="text" placeholder="party code" value={name} spellCheck={false} onChange={(e) => {
          localStorage.setItem('username', e.target.value);
          setName(e.target.value);
        }}/></div>
        <button className={styles.buttonValid}
        onClick={() => {
          socket.emit('party:join', localStorage.getItem('code'), localStorage.getItem('username'));
        }}>→</button>
      </div>
    </div>
  )
}