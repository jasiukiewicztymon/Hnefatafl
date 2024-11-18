"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react"
import { Game } from "../../../server/game"
import { io } from "socket.io-client";

import config from "../../config.json"

const socket = io(`ws://${config.host}:${config.port}`);

export default function Home() {
  useEffect(() => {
    localStorage.setItem('resigned', "false")
    // élimination des évenements doubles
    socket.off('game:resign');
    socket.off('game:play');
    socket.off('game:replay');

    socket.on("connect", () => {
      console.log("SOCKET ID", socket.id);
    });

    socket.on('game:play', (res) => {
      console.log(res)

      setBoard(res.board)
      setReplay(res.replay || false);
      game.board = res.board;

      if (res.isWhite != null) {
        setBoardSize(res.board.length)
        setIsWhite(res.isWhite);
        setWhiteIndex(res.whiteIndex)
        setPlayer1(res.player1)
        setPlayer2(res.player2)
        setGameEnded(res.won);
        setReplay(res.won ? res.replay : false);
        game.config = res.config
      }

      if (res.code < 0) {
        setGameWinner(-res.code);
        alert(`${(-res.code == 1) ? res.player1 : res.player2} a gagné!`)
        setGameEnded(true);
      }

      // console.log(res.pawnEaten1, res.pawnEaten2)
      setNbPiece1(res.pawnEaten1);
      setNbPiece2(res.pawnEaten2);

      setIsTurn(res.turn)
    })
    socket.on('game:resign', () => {
      if (localStorage.getItem('resigned') == 'false') {
        alert('L\'adversaire a abandonné. Vous serez redirigé vers la page d\'acceuil.')
        window.location.replace('/');
      }
    })
    socket.on('game:replay', () => {
      setReplay(true);
    })

    socket.emit('party:connection', localStorage.getItem('uuid'), localStorage.getItem('code'));
  }, [])

  const [isTurn, setIsTurn] = useState(false);
  const [isWhite, setIsWhite] = useState(false);
  const [whiteIndex, setWhiteIndex] = useState(-1);

  const [gameEnded, setGameEnded] = useState(false);

  // les pseudonymes des joueurs
  const [player1, setPlayer1] = useState(null)
  const [player2, setPlayer2] = useState(null)

  // le nombre de capture pour chaque joueur
  const [nbPiece1, setNbPiece1] = useState(0);
  const [nbPiece2, setNbPiece2] = useState(0);

  // la taille du plateau
  const [boardSize, setBoardSize] = useState(0);

  // replay de la part de l'adverser
  const [replay, setReplay] = useState(false);

  // initialisation d'un jeu pour l'engine côté client
  const [game, setGame] = useState(new Game("", {
    size: 13
  }, "", ""))

  // le plateau pour update le dom
  const [board, setBoard] = useState([]);

  // les mouvement dispognibles pour update le dom
  const [moves, setMoves] = useState<Array<string>>([])

  // last pawn
  const [currentPawn, setCurrentPawn] = useState<Array<number>>([])

  // game winner
  const [gameWinner, setGameWinner] = useState(0);

  interface Case {
    player: null | string,
    isFort: boolean
  }

  /**
   * Pour l'affichage du plateau on l'affiche d'abord par ligne et ensuite dans chaque lignes toutes les cellules. Ensuite si la cellule est une forteresse on change la couleur de la case et si la case contient un pion on affiche un pion, si la case contient un mouvement possible on affiche le mouvement sinon on laisse la case vide
   */
  return (
    <main className={styles.container}>
      <div id={styles.header}>
        <h1>Hnefatafl</h1>
        <div id={styles.displayData}>
          <div className={styles.playerData}>
            <span>{player1 || "waiting..."}</span>
            <div className={styles.eatenPawn}>
              {[...Array(nbPiece1)].map((e, i) => {
                return <img style={{
                  height: "30px",
                  width: "30px",
                  marginLeft: "5px"
                }} 
                key={i}
                src={`/pieces/${whiteIndex == 1 ? 'b' : 'w'}.svg`} />
              })}
            </div>
          </div>
          <img src="/logo.png" />
          <div  className={styles.playerData}>
            <span>{player2 || "waiting..."}</span>
            <div className={styles.eatenPawn}>
              {[...Array(nbPiece2)].map((e, i) => {
                return <img style={{
                  height: "30px",
                  width: "30px",
                  marginRight: "5px"
                }} 
                key={i}
                src={`/pieces/${whiteIndex == 2 ? 'b' : 'w'}.svg`} />
              })}
            </div>
          </div>
        </div>
      </div>
      <div id={styles.board}>
        {[...Array(boardSize)].map((e, i) => {
          return <div key={i} id={styles.row}>
            {[...Array(boardSize)].map((e, j) => {
              return <div key={`${i}${j}`} id={styles.boardBox} style={{
                background: (board[i][j] as Case).isFort ? "#DC5454" : ""
              }}>
                {(board[i][j] as Case).player ? <img style={{
                  height: "80%",
                  width: "80%",
                  cursor: "pointer"
                }} 
                onClick={() => {
                  // console.log(isWhite, ['w', 'k'].indexOf((board[i][j] as Case).player || '') == -1, isTurn);

                  if (i == currentPawn[0] && j == currentPawn[1]) {
                    setMoves([]);
                    setCurrentPawn([]);
                  }
                  else if (
                    ((['w', 'k'].indexOf((board[i][j] as Case).player || '') == -1 && !isWhite) ||
                    (['w', 'k'].indexOf((board[i][j] as Case).player || '') != -1 && isWhite)) &&
                    isTurn
                  ) {
                    setCurrentPawn([i, j]);
                    setMoves(game.getMoves([i, j]))
                  }
                }}
                src={`/pieces/${(board[i][j] as Case).player}.svg`} /> : 
                moves.indexOf(`${i}:${j}`) != -1 ? <div className={styles.move} onClick={() => {
                  /*let r = game.move([currentPawn[0], currentPawn[1]], [i, j]);

                  setGameWinner(r);*/
                  socket.emit('game:play', localStorage.getItem('uuid'), localStorage.getItem('code'), [currentPawn[0], currentPawn[1]], [i, j])

                  setMoves([]);
                  setCurrentPawn([]);
                }}></div> : null}
              </div>
            })}
          </div>
        })}
      </div>
      <div id={styles.actionButtons}>
        <button onClick={() => {
          let r = confirm("Voulez-vous vraiment abandonner?");
          
          if (r) {
            localStorage.setItem('resigned', "true")
            socket.emit('game:resign', localStorage.getItem('uuid'), localStorage.getItem('code'));
            window.location.replace('/');
          }
        }} disabled={gameEnded}>Abondonner</button>
        <button disabled={!gameEnded} onClick={() => {
            setReplay(true);
            socket.emit('game:replay', localStorage.getItem('uuid'), localStorage.getItem('code'));
        }}
        
        style={{
          border: `${replay ? 0 : 0}px solid #84C574`,
          background: replay && gameEnded ? `rgba(132, 197, 116, 0.7)` : '#EFEFEF'
        }}>Rejouer</button>
      </div>
      <div id={styles.joinBox}>
        <div>Code: <span style={{
          cursor: 'pointer',
          userSelect: 'text'
        }}
        onClick={() => {
          try {
            navigator.clipboard.writeText(localStorage.getItem('code') || '');
          } catch {}
        }}>{localStorage.getItem('code') || ''} (cliquez pour copier)</span></div>
        <div style={{
          userSelect: 'text'
        }}>
          {config.host}:3000/join/{localStorage.getItem('code')}
        </div>
      </div>
    </main>
  );
}
  