"use client";
import styles from './nicknameInput.module.css';
import { useState, forwardRef, useRef, useImperativeHandle } from "react";

export default forwardRef(function NicknameInput(props, ref) {
  let [nickname, setNickname] = useState<string>("player2180");

  useImperativeHandle(ref, () => {
    return {
      getNickname() {
        return nickname;
      }
    }
  })
  
  return (
    <div id={styles.nicknameInput}>
      <span>Ton nickname: </span><div className={styles.input}><input type="text" placeholder="Ex: Player 2180" spellCheck={false} value={nickname} onChange={(e) => setNickname(e.target.value)}/></div>
    </div>
  )
})