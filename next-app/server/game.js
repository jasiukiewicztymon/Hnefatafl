// la classe case est utilisé pour la facilité d'initialisation des plateaux
class Case {
    /**
     * Le constructeur d'une case
     * @param {string} player le code du joueur, w - blanc, b - noir, k - roi, (W - commandant blanc, B - commandant noir)
     * @param {boolean} isFort la case est un fort
     */
    constructor(player, isFort= false, isEnd = false) {
        this.isFort = isFort;
        this.isEnd = isEnd;
        this.player = player;
    }
    /**
     * Création d'un objet à partir d'une case
     * @returns L'objet qui correspond à la case
     */
    toObject() {
        return {
            isFort: this.isFort,
            isEnd: this.isEnd,
            player: this.player
        }
    }
}

// L'état par defaut du plateau 11x11
const defaultGameState11x11 = [
    [ new Case(null, true, true), new Case(null), new Case(null), new Case('b'), new Case('b'), new Case('b'), new Case('b'), new Case('b'), new Case(null), new Case(null), new Case(null, true, true) ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case('w'), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b') ],
    [ new Case('b'), new Case(null), new Case(null), new Case(null), new Case('w'), new Case('w'), new Case('w'), new Case(null), new Case(null), new Case(null), new Case('b') ],
    [ new Case('b'), new Case('b'), new Case(null), new Case('w'), new Case('w'), new Case('k', true), new Case('w'), new Case('w'), new Case(null), new Case('b'), new Case('b') ],
    [ new Case('b'), new Case(null), new Case(null), new Case(null), new Case('w'), new Case('w'), new Case('w'), new Case(null), new Case(null), new Case(null), new Case('b') ],
    [ new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case('w'), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b') ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case(null, true, true), new Case(null), new Case(null), new Case('b'), new Case('b'), new Case('b'), new Case('b'), new Case('b'), new Case(null), new Case(null), new Case(null, true, true) ],
]

// L'état par défaut du plateau 13x13
const defaultGameState13x13 = [
    [ new Case(null, true, true), new Case(null), new Case(null), new Case(null), new Case('b'), new Case('b'), new Case('b'), new Case('b'), new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null, true, true) ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('w'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('w'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b') ],
    [ new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('w'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b') ],
    [ new Case('b'), new Case('b'), new Case(null), new Case('w'), new Case('w'), new Case('w'), new Case('k', true), new Case('w'), new Case('w'), new Case('w'), new Case(null), new Case('b'), new Case('b') ],
    [ new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('w'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b') ],
    [ new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('w'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b') ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('w'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null), new Case(null) ],
    [ new Case(null, true, true), new Case(null), new Case(null), new Case(null), new Case('b'), new Case('b'), new Case('b'), new Case('b'), new Case('b'), new Case(null), new Case(null), new Case(null), new Case(null, true, true) ],
]

/**
 * Check if white chain is sourrounded by black
 * @param {Array} board the board of the game
 * @param {Array} init a position in the white chain
 * @param {Object} positions caching
 * @returns 0 if is sourounded by black or white and -1 if there is an empty block
 */
function checkWhite(board, init, positions = {}) {
    let bs = ['b'];

    positions[`${init[0]}:${init[1]}`] = 1;

    // returns 0 if black
    if (bs.indexOf(board[init[0]][init[1]].player) != -1) {
        positions[`${init[0]}:${init[1]}`] = 0;
        return 0;
    }
    // returns -1 if is nothing
    if (board[init[0]][init[1]].player == null) {
        positions[`${init[0]}:${init[1]}`] = -1;
        return -1;
    }

    // there is a king ub the chain
    if (board[init[0]][init[1]].player == 'k') positions['k'] = true;

    // positions of the white chain
    // à droite
    if (init[1] + 1 < board.length) {
        // return from cache
        if (`${init[0]}:${init[1] + 1}` in positions) {
            if (positions[`${init[0]}:${init[1] + 1}`] != 1) return positions[`${init[0]}:${init[1] + 1}`];
        }
        else if (-1 == checkWhite(board, [init[0], init[1] + 1], positions)) {
            positions[`${init[0]}:${init[1]}`] = -1;
            return -1;
        }
    }
    // en haut
    if (init[0] + 1 < board.length) {
        // return from cache
        if (`${init[0] + 1}:${init[1]}` in positions) {
            if (positions[`${init[0] + 1}:${init[1]}`] != 1) return positions[`${init[0] + 1}:${init[1]}`];
        }
        else if (-1 == checkWhite(board, [init[0] + 1, init[1]], positions)) {
            positions[`${init[0]}:${init[1]}`] = -1;
            return -1;
        }
    }
    // à gauche
    if (init[1] - 1 >= 0) {
        // return from cache
        if (`${init[0]}:${init[1] - 1}` in positions) {
            if (positions[`${init[0]}:${init[1] - 1}`] != 1) return positions[`${init[0]}:${init[1] - 1}`];
        }
        else if (-1 == checkWhite(board, [init[0], init[1] - 1], positions)) {
            positions[`${init[0]}:${init[1]}`] = -1;
            return -1;
        }
    }
    // en bas
    if (init[0] - 1 >= 0){
        // return from cache
        if (`${init[0] - 1}:${init[1]}` in positions) {
            if (positions[`${init[0] - 1}:${init[1]}`] != 1) return positions[`${init[0] - 1}:${init[1]}`];
        }
        else if (-1 == checkWhite(board, [init[0] - 1, init[1]], positions)) {
            positions[`${init[0]}:${init[1]}`] = -1;
            return -1;
        }
    } 

    // ok
    positions[`${init[0]}:${init[1]}`] = 0;
    return 0;
}

class Game {
    /**
     * Initialisation de la partie
     * @param {string} code le code nécessaire pour rejoindre la partie
     * @param {*} config configuration de la partie
     * @param {*} player1 l'uuid du premier joueur
     * @param {*} player2 l'uuid du deuxième joueur
     */
    constructor(code, config, player1, username1) {
        // code et configuration de la table
        this.code = code;
        this.config = config;

        // les données des joueurs
        this.player1 = player1;
        this.player2 = null;
        this.username1 = username1;
        this.username2 = null;

        // information technique pour le moteur du jeu
        this.turn = false;
        this.gamePlayed = 0;
        this.board = [];

        // le nombre des pions mangés
        this.pawnEaten1 = 0;
        this.pawnEaten2 = 0;

        // l'état de la partie
        this.state = false;

        // si elle est gagné
        this.won = false;

        this.replay1 = false;
        this.replay2 = false;

        // récupération du template
        let ref = this.config.size == 11 ? defaultGameState11x11 : defaultGameState13x13;

        // on place le template dans le board
        for (let i in ref) {
            this.board.push([]);
            for (let j in ref[i]) {
                let I = Number(i), J = Number(j);
                this.board[this.board.length - 1].push(ref[i][j].toObject());
                if (this.config.boardEnd == true) {
                    if (I == 0 || I == ref.length - 1 || J == 0 || J == ref.length - 1) {
                        this.board[I][J].isEnd = true;
                        this.board[I][J].isFort = false;
                    }
                    else {
                        this.board[I][J].isEnd = false;
                        this.board[I][J].isFort = this.board[I][J].player == 'k';
                    }
                }
            }
        }
    }

    /**
     * Ajoute le deuxième joueur si la table est libre
     * @param {string} uuid l'uuid du joueur
     * @param {string} username le username du joueur
     * @returns 0 si succès sinon 1
     */
    joinPlayer(uuid, username) {
        if (!this.state && this.player2 == null) {
            this.player2 = uuid;
            this.username2 = username;
            return 0;
        }
        return 1;
    }

    /**
     * Retourne tout les mouvements possible pour le pion sur une position
     * @param {Array} init Position du pion
     * @returns un Array avec toutes les possibilitées
     */
    getMoves(init) {
        let max = this.board.length;
        let moves = [];

        if (this.board[init[0]][init[1]].player == null) return [];

        if (this.config.mouvements == 1 || this.config.mouvements == 2) {
            // seulement les cases en croix
            if (init[1] + 1 < max && this.board[init[0]][init[1] + 1].player == null) {
                moves.push(init[0]+':'+(init[1] + 1));
            }
            if (init[1] - 1 >= 0 && this.board[init[0]][init[1] - 1].player == null) {
                moves.push(init[0]+':'+(init[1] - 1));
            }
            if (init[0] + 1 < max && this.board[init[0] + 1][init[1]].player == null) {
                moves.push((init[0] + 1)+':'+(init[1]));
            }
            if (init[0] - 1 >= 0 && this.board[init[0] - 1][init[1]].player == null) {
                moves.push((init[0] - 1)+':'+(init[1]));
            }

            if (this.config.mouvements == 2) {
                // toutes les cases adjacentes dans les coins
                if (init[1] + 1 < max && init[0] + 1 < max && this.board[init[0] + 1][init[1] + 1].player == null) {
                    moves.push((init[0] + 1)+':'+(init[1] + 1));
                }
                if (init[0] + 1 < max && init[1] - 1 >= 0 && this.board[init[0] + 1][init[1] - 1].player == null) {
                    moves.push((init[0] + 1)+':'+(init[1] - 1));
                }
                if (init[1] - 1 >= 0 && init[0] - 1 >= 0 && this.board[init[0] - 1][init[1] - 1].player == null) {
                    moves.push((init[0] - 1)+':'+(init[1] - 1));
                }
                if (init[0] - 1 >= 0 && init[1] + 1 < max && this.board[init[0] - 1][init[1] + 1].player == null) {
                    moves.push((init[0] - 1)+':'+(init[1] + 1));
                }
            }
        }
        else {
            // comme une tour (par défaut)
            let y = 1;
            // + y
            while (init[1] + y < max) {
                if (this.board[init[0]][init[1] + y].player != null) break;
                moves.push(init[0]+':'+(init[1] + y));
                y++;
            } 
            y = 1;
            // - y
            while (init[1] - y >= 0) {
                if (this.board[init[0]][init[1] - y].player != null) break;
                moves.push(init[0]+':'+(init[1] - y));
                y++;
            } 
            // + x
            y = 1;
            while (init[0] + y < max) {
                if (this.board[init[0] + y][init[1]].player != null) break;
                moves.push((init[0] + y)+':'+init[1]);
                y++;
            } 
            y = 1;
            // - x
            while (init[0] - y >= 0) {
                if (this.board[init[0] - y][init[1]].player != null) break;
                moves.push((init[0] - y)+':'+init[1]);
                y++;
            }
        }

        // this.board[init[0]][init[1]].player == 'b' || (!this.config.whiteFort && this.board[init[0]][init[1]].player == 'w')
        if (this.board[init[0]][init[1]].player != 'k') {
            // supprimer les forteresses
            if (moves.indexOf('0:0') != -1) moves.splice(moves.indexOf('0:0'), 1);
            if (moves.indexOf(`0:${max - 1}`) != -1) moves.splice(moves.indexOf(`0:${max - 1}`), 1);
            if (moves.indexOf(`${max - 1}:0`) != -1) moves.splice(moves.indexOf(`${max - 1}:0`), 1);
            if (moves.indexOf(`${max - 1}:${max - 1}`) != -1) moves.splice(moves.indexOf(`${max - 1}:${max - 1}`), 1);
        /*}
        if (this.board[init[0]][init[1]].player != 'k') {*/
            // suppression du centre si ce n'est pas le roi
            if (moves.indexOf(`${(max - 1) / 2}:${(max - 1) / 2}`) != -1) moves.splice(moves.indexOf(`${(max - 1) / 2}:${(max - 1) / 2}`), 1);
        }

        return moves;
    }

    /**
     * Retourne tout les mouvements possible pour le pion sur une position selon le tour du joueur
     * @param {Array} init Position du pion
     * @returns un Array avec toutes les possibilitées
     */
    getFiltredMoves(init) {
        // each color symbols
        let wp = ['w', 'k'];
        let bp = ['b'];
        
        if (this.turn) {
            if (wp.indexOf(this.board[init[0]][init[1]].player) == -1) return [];
            else return this.getMoves(init);
        }
        else {
            if (bp.indexOf(this.board[init[0]][init[1]].player) == -1) return [];
            else return this.getMoves(init);
        }
    }

    /**
     * Retourn 0 si c'est au premier de jouer sinon ca retourne 1
     * @returns le tour du joueur
     */
    getTurn() {
        // on simplifie par une lettre à qui est le tour de jouer
        let s = this.turn ? 'w' : 'b';

        // ajout des pions mangés
        if (this.gamePlayed % 2) {
            // c'est le player1 qui est en noir voir CC
            if (s == 'w') return 2;
            else return 1;
        }
        else {
            // c'est le player1 qui est en blanc voir CC
            if (s == 'w') return 1;
            else return 2;
        }
    }

    /**
     * Vérifie si un mouvement est légale et si cela est le cas il l'efféctue et met à jour l'état de la partie
     * @param {Array} init la position du pion
     * @param {Array} final la position vers laquel nous voulons déplacer le pion
     * @returns 0 si tout s'est passé avec succès sinon retourne un code d'erreur
     */
    move(init, final) {
        // code d'erreur 1 - on joue pas un pion
        if (this.board[init[0]][init[1]].player == null) return 1;
        // code d'erreur 2 - on a la même position de départ que d'arrivé
        if (init[0] == final[0] && init[1] == final[1]) return 2;

        // on simplifie par une lettre à qui est le tour de jouer
        let s = this.turn ? 'w' : 'b';
        
        // list des type de pion de chaque joueur pour les captures
        let p = s != 'b' ? ['w', 'k'] : ['b'];
        let a = s == 'b' ? ['w', 'k'] : ['b'];
        let wp = ['w', 'k'];
        let bp = ['b'];

        // code d'erreur 3 - on essaie de jouer un noir alors que c'est aux blancs de jouer
        if (this.board[init[0]][init[1]].player == 'b' && s != 'b') return 3;
        // code d'erreur 4 - on essaie de jouer un blanc alors que c'est aux noirs de jouer
        if (this.board[init[0]][init[1]].player == 'w' && s == 'b') return 4;
        // code d'erreur 5 - on essaie de jouer le roi alors que c'est aux noirs de jouer
        if (this.board[init[0]][init[1]].player == 'k' && s == 'b') return 5;

        // les noirs ne peuvent pas se déplacer sur une forteresse
        if (this.board[init[0]][init[1]].player == 'b' && this.board[final[0]][final[1]].isFort) return 7;

        // on obtient tous les mouvements pour le pion
        let moves = this.getMoves(init);

        // la variable est vrai si le roi est mangé
        let kingIsEaten = false, kingIsFort = false;

        // vérification si le mouvement est légale
        if (moves.indexOf(`${final[0]}:${final[1]}`) != -1) {
            // déplacement
            this.board[final[0]][final[1]].player = this.board[init[0]][init[1]].player;
            this.board[init[0]][init[1]].player = null;

            if (this.board[final[0]][final[1]].player == 'k' && this.board[final[0]][final[1]].isEnd) kingIsFort = true;

            // nb d'élimination
            let n = 0;

            // implémentation des captures
            // on enlève la direction d'où arrive le pion
            if (final[1] == init[1]) {
                // le deplacement est horizontale
                if (final[0] < init[0]) {
                    // on se déplace vers la gauche
                    if (final[0] - 2 >= 0 && (a.indexOf(this.board[final[0] - 1][final[1]].player) != -1 && (p.indexOf(this.board[final[0] - 2][final[1]].player) != -1 || this.board[final[0] - 2][final[1]].isFort))) {
                        if (this.board[final[0] - 1][final[1]].player == 'k') {
                            if (!this.board[final[0] - 1][final[1]].isFort) {
                                if (this.config.borderProtection) {
                                    if (final[0] - 1 != 0 && final[0] - 1 != this.board.length - 1 && final[1] != 0 && final[1] != this.board.length - 1) kingIsEaten = true;
                                }
                                else {
                                    kingIsEaten = true;
                                }
                            }
                        }
                        else {
                            this.board[final[0] - 1][final[1]].player = null;
                            n++;
                        }
                    }
                }
                else {
                    // on se déplace vers la droite
                    if (final[0] + 2 < this.board.length && (a.indexOf(this.board[final[0] + 1][final[1]].player) != -1 && (p.indexOf(this.board[final[0] + 2][final[1]].player) != -1 || this.board[final[0] + 2][final[1]].isFort))) {
                        if (this.board[final[0] + 1][final[1]].player == 'k') {
                            if (!this.board[final[0] + 1][final[1]].isFort) {
                                if (this.config.borderProtection) {
                                    if (final[0] + 1 != 0 && final[0] + 1 != this.board.length - 1 && final[1] != 0 && final[1] != this.board.length - 1) kingIsEaten = true;
                                }
                                else {
                                    kingIsEaten = true;
                                }
                            }
                        }
                        else {
                            this.board[final[0] + 1][final[1]].player = null;
                            n++;
                        }
                    }
                }
                // verification verticale
                if (final[1] + 2 < this.board.length && (a.indexOf(this.board[final[0]][final[1] + 1].player) != -1 && (p.indexOf(this.board[final[0]][final[1] + 2].player) != -1 || this.board[final[0]][final[1] + 2].isFort))) {
                    if (this.board[final[0]][final[1] + 1].player == 'k') {
                        if (!this.board[final[0]][final[1] + 1].isFort) {
                            if (this.config.borderProtection) {
                                if (final[0] != 0 && final[0] != this.board.length - 1 && final[1] + 1 != 0 && final[1] + 1 != this.board.length - 1) kingIsEaten = true;
                            }
                            else {
                                kingIsEaten = true;
                            }
                        }
                    }
                    else this.board[final[0]][final[1] + 1].player = null;
                    n++;
                }
                if (final[1] - 2 >= 0 && (a.indexOf(this.board[final[0]][final[1] - 1].player) != -1 && (p.indexOf(this.board[final[0]][final[1] - 2].player) != -1 || this.board[final[0]][final[1] - 2].isFort))) {
                    if (this.board[final[0]][final[1] - 1].player == 'k') {
                        if (!this.board[final[0]][final[1] - 1].isFort) {
                            if (this.config.borderProtection) {
                                if (final[0] != 0 && final[0] != this.board.length - 1 && final[1] - 1 != 0 && final[1] - 1 != this.board.length - 1) kingIsEaten = true;
                            }
                            else {
                                kingIsEaten = true;
                            }
                        }
                    }
                    else {
                        this.board[final[0]][final[1] - 1].player = null;
                        n++;
                    }
                }
            }
            else {
                // le déplacement est vertical
                if (final[1] < init[1]) {
                    // on se déplace vers le bas
                    if (final[1] - 2 >= 0 && (a.indexOf(this.board[final[0]][final[1] - 1].player) != -1 && (p.indexOf(this.board[final[0]][final[1] - 2].player) != -1 || this.board[final[0]][final[1] - 2].isFort))) {
                        if (this.board[final[0]][final[1] - 1].player == 'k') {
                            if (!this.board[final[0]][final[1] - 1].isFort) {
                                if (this.config.borderProtection) {
                                    if (final[0] != 0 && final[0] != this.board.length - 1 && final[1] - 1 != 0 && final[1] - 1 != this.board.length - 1) kingIsEaten = true;
                                }
                                else {
                                    kingIsEaten = true;
                                }
                            }
                        }
                        else {
                            this.board[final[0]][final[1] - 1].player = null;
                            n++;
                        }
                    }
                }
                else {
                    // on se déplace vers le haut
                    if (final[1] + 2 < this.board.length && (a.indexOf(this.board[final[0]][final[1] + 1].player) != -1 && (p.indexOf(this.board[final[0]][final[1] + 2].player) != -1 || this.board[final[0]][final[1] + 2].isFort))) {
                        if (this.board[final[0]][final[1] + 1].player == 'k') {
                            if (!this.board[final[0]][final[1] + 1].isFort) {
                                if (this.config.borderProtection) {
                                    if (final[0] != 0 && final[0] != this.board.length - 1 && final[1] + 1 != 0 && final[1] + 1 != this.board.length - 1) kingIsEaten = true;
                                }
                                else {
                                    kingIsEaten = true;
                                }
                            }
                        }
                        else {
                            this.board[final[0]][final[1] + 1].player = null;
                            n++;
                        }
                    }
                }
                // verification verticale
                if (final[0] + 2 < this.board.length && (a.indexOf(this.board[final[0] + 1][final[1]].player) != -1 && (p.indexOf(this.board[final[0] + 2][final[1]].player) != -1 || this.board[final[0] + 2][final[1]].isFort))) {
                    if (this.board[final[0] + 1][final[1]].player == 'k') {
                        if (!this.board[final[0] + 1][final[1]].isFort) {
                            if (this.config.borderProtection) {
                                if (final[0] + 1 != 0 && final[0] + 1 != this.board.length - 1 && final[1] != 0 && final[1] != this.board.length - 1) kingIsEaten = true;
                            }
                            else {
                                kingIsEaten = true;
                            }
                        }
                    }
                    else {
                        this.board[final[0] + 1][final[1]].player = null;
                        n++;
                    }
                }
                if (final[0] - 2 >= 0 && (a.indexOf(this.board[final[0] - 1][final[1]].player) != -1 && (p.indexOf(this.board[final[0] - 2][final[1]].player) != -1 || this.board[final[0] - 2][final[1]].isFort))) {
                    if (this.board[final[0] - 1][final[1]].player == 'k') {
                        if (!this.board[final[0] - 1][final[1]].isFort) {
                            if (this.config.borderProtection) {
                                if (final[0] - 1 != 0 && final[0] - 1 != this.board.length - 1 && final[1] != 0 && final[1] != this.board.length - 1) kingIsEaten = true;
                            }
                            else {
                                kingIsEaten = true;
                            }
                        }
                    }
                    else {
                        this.board[final[0] - 1][final[1]].player = null;
                        n++;
                    }
                }
            }

            // ajout des pions mangés
            if (this.gamePlayed % 2) {
                // c'est le player1 qui est en noir voir CC
                if (s == 'w') this.pawnEaten2 += n;
                else this.pawnEaten1 += n;
            }
            else {
                // c'est le player1 qui est en blanc voir CC
                if (s == 'w') this.pawnEaten1 += n;
                else this.pawnEaten2 += n;
            }

            // vérification de la victoire
            // 1. il n'y a plus de roi victoire aux noirs
            if (kingIsEaten) {
                this.won = true;
                if (this.gamePlayed % 2) {
                    // c'est le player1 qui est en noir voir CC
                    return -1;
                }
                else {
                    // c'est le player1 qui est en blanc voir CC
                    return -2;
                }
            }
            // 2. le roi est capturé avec ses soldat (seulement si c'était aux noirs de jouer)
            if (s == 'b') {
                // il faut vérifier les quatres côtés pour voir pour voir si c'est un groupe qui est liée au roi s'il existe
                if (final[1] + 1 < this.board.length) {
                    if (wp.indexOf(this.board[final[0]][final[1] + 1].player) != -1 && checkWhite(this.board, [final[0], final[1] + 1], {}) == 0) {
                        this.won = true;
                        if (this.gamePlayed % 2) {
                            // c'est le player1 qui est en noir voir CC
                            return -1;
                        }
                        else {
                            // c'est le player1 qui est en blanc voir CC
                            return -2;
                        }
                    }
                }
                // en haut
                if (final[0] + 1 < this.board.length) {
                    if (wp.indexOf(this.board[final[0] + 1][final[1]].player) != -1 && checkWhite(this.board, [final[0] + 1, final[1]], {}) == 0) {
                        this.won = true;
                        if (this.gamePlayed % 2) {
                            // c'est le player1 qui est en noir voir CC
                            return -1;
                        }
                        else {
                            // c'est le player1 qui est en blanc voir CC
                            return -2;
                        }
                    }
                }
                // à gauche
                if (final[1] - 1 >= 0) {
                    if (wp.indexOf(this.board[final[0]][final[1] - 1].player) != -1 && checkWhite(this.board, [final[0], final[1] - 1], {}) == 0) {
                        this.won = true;
                        if (this.gamePlayed % 2) {
                            // c'est le player1 qui est en noir voir CC
                            return -1;
                        }
                        else {
                            // c'est le player1 qui est en blanc voir CC
                            return -2;
                        }
                    }
                }
                // en bas
                if (final[0] - 1 >= 0){
                    if (wp.indexOf(this.board[final[0] - 1][final[1]].player) != -1 && checkWhite(this.board, [final[0] - 1, final[1]], {}) == 0) {
                        this.won = true;
                        if (this.gamePlayed % 2) {
                            // c'est le player1 qui est en noir voir CC
                            return -1;
                        }
                        else {
                            // c'est le player1 qui est en blanc voir CC
                            return -2;
                        }
                    }
                } 
            }

            // 3. le roi a atteint une forterresse dans un coin
            if (kingIsFort) {
                this.won = true;
                if (this.gamePlayed % 2) {
                    // c'est le player1 qui est en noir voir CC
                    return -2;
                }
                else {
                    // c'est le player1 qui est en blanc voir CC
                    return -1;
                }
            }

            let nextCanPlay = false;

            for (let i in this.board) {
                for (let j in this.board[i]) {
                    if (this.board[i][j].player != null &&
                        ((this.board[i][j].player != 'b' && s == 'b') ||
                        (this.board[i][j].player == 'b' && s != 'b')))
                        if (this.getMoves([Number(i), Number(j)]).length > 0) {
                            nextCanPlay = true;
                            break;
                        }
                }
            }

            if (nextCanPlay) {
                // c'est au joueur suivant de jouer
                this.turn = !this.turn;
                
                // succès
                return 0;
            }
            
            // le joueur n'a plus de possibilité pour jouer donc il perd
            if (this.gamePlayed % 2) {
                // c'est le player1 qui est en noir voir CC
                return s == 'b' ? -1 : -2;
            }
            else {
                // c'est le player1 qui est en blanc voir CC
                return s == 'b' ? -2 : -1;
            }
        }
        // code d'erreur 6 - mouvement illégale
        return 6;
    }

    /**
     * Accesseur de l'état du jeu
     * @returns l'état du jeu
     */
    getGame() {
        return {
            board: this.board,
            turn: this.turn
        }
    }
}

// exports
module.exports.Game = Game;
module.exports.Case = Case;
module.exports.defaultGameState11x11 = defaultGameState11x11;
module.exports.defaultGameState13x13 = defaultGameState13x13;
module.exports.checkWhite = checkWhite;