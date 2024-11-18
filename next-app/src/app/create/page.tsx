import styles from "./page.module.css";
import CreateParty from "../../components/createParty"

export default function Home() {
    return (
      <main className={styles.container}>
        <div id={styles.header}>
          <h1>Hnefatafl</h1>
          <h2>Un vrai jeu de Vikings <img src="logo.png" width={25}/></h2>
        </div>
        <div>
          <CreateParty></CreateParty>
        </div>
      </main>
    );
  }
  