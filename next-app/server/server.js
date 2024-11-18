const { Server } = require("socket.io");
const {v4 : uuidv4, validate : uuidValidate} = require('uuid')
const fs = require('fs');
const moment = require('moment');
const { Game, Case, defaultGameState11x11, defaultGameState13x13 } = require('./game')

// reset game file
fs.writeFileSync('./server/games.json', JSON.stringify({
    games: []
}), 'utf-8', (err) => {
    console.error(err)
});

/**
 * Affichage d'une configuration
 * @param {object} t l'objet en question
 * @param {string} name le nom à afficher
 */
function showConfig(t, name) {
    console.log(`Configuration of the: ${name}`)
    
    for (let i in t) {
        let l = "";
        for (let j in t[i]) {
            if (t[i][j].player != null) l += t[i][j].player;
            else if (t[i][j].isFort) l += 'f';
            else l += ' ';
        }
        console.log(l)
    }
    
    console.log('')
}

// affichages des configurations
// console.log("Affichage des configurations")
// showConfig(defaultGameState11x11, 'Default 11x11')
// showConfig(defaultGameState13x13, 'Default 13x13')

/**
 * Les variables de stockage
 * 
 * PLAYERS - sert à stocker tout sockets des joueurs et les liées à leurs sockets 
 * GAMES - sert à stocker toutes les parties en cours ou attente
 * CODES - les codes déjà utilisées
 * 
 * Ces variables sont des dictionnaires et leurs valeurs sont vidées quand elle ne sont plus utilisées
 */
const PLAYERS = {}
const GAMES = {}
const CODES = []

/**
 * Genere un code unique selon une liste de code
 * @param {Array} codes la liste des codes
 * @returns le code unique
 */
function generateCode(codes) {
    let lot = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += lot[Math.floor(Math.random() * lot.length)];
    }
    return code;
}

/**
 * Un log du serveur web-socket
 * @param {string} event l'évenement
 * @param {string} where l'endroit du code
 * @param {string?} uuid un optionel user, possible null
 */
function logEvent(event, where, uuid) {
    console.log(`${event} @ ${where} ${uuid ? `by ${uuid}` : ''}`)
}

/**
 * Initialisation du serveur websocket
 * Configurez le port depuis le .env
 */
const io = new Server({
    cors: {
        // on accepte toutes les origines cors à changer en cas de nécessité
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("NEW CONNECTION: ", socket.id)

    socket.on('getGames', () => {
        fs.readFile('./server/games.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err)
            } else {
                let games = JSON.parse(data).games;
                let deadspanLimit = moment(new Date()).unix();
                // console.log(deadspanLimit, games)
                games = games.filter((game) => {
                    return game.deadspan > deadspanLimit;
                })
                fs.writeFileSync('./server/games.json', JSON.stringify({
                    games: games
                }), 'utf-8', (err) => {
                    console.error(err)
                });

                socket.emit('getGames', games)
            }
        })
    })
    socket.on('party:create', 
    /**
     * Création de partie 
     * @param {*} config la configuration de la partie
     * @param {*} nick le nom utilisateur
     */
    (config, nick) => {
        try {
            let code = generateCode(CODES);
            let uuid = uuidv4();
            
            // sauvegarde du socket dans PLAYERS
            PLAYERS[uuid] = socket;
            // sauvegarde et initialisation de la partie dans GAMES
            GAMES[code] = new Game(code, config, uuid, nick);

            // renvoie des données à l'utilisateur
            socket.emit('party:create', {
                'status': 0,
                'code': code,
                'uuid': uuid
            })

            logEvent(`création d'une partie (${code})`, `party:create`, uuid);

            // writing games to the waiting file
            fs.readFile('./server/games.json', 'utf-8', (err, data) => {
                if (err) {
                    console.error(err)
                } else {
                    let games = JSON.parse(data).games;
                    let deadspanLimit = moment(new Date()).unix();
                    // console.log(deadspanLimit, games)
                    games = games.filter((game) => {
                        return game.deadspan > deadspanLimit;
                    })
                    games.push({
                        code: code,
                        config: config,
                        deadspan: moment(new Date()).add(5, 'minutes').unix()
                    })
                    fs.writeFileSync('./server/games.json', JSON.stringify({
                        games: games
                    }), 'utf-8', (err) => {
                        console.error(err)
                    });
                }
            })
        } catch (e) {
            console.error(e);
        }
    })
    socket.on('party:join', 
    /**
     * Joindre une partie
     * @param {*} code le code de la partie
     * @param {*} nick le nom utilisateur
     * @returns 
     */
    (code, nick) => {
        try {
            // la partie n'exsite pas
            if (GAMES[code] == null) {
                socket.emit('party:join', {
                    'status': 1,
                    'error': `La partie avec le code ${code} n'existe pas`
                })

                logEvent(`essaie de jointure à une partie (${code})`, `party:join`);
            }
            // la partie est pleine
            else if (GAMES[code].state) {
                socket.emit('party:join', {
                    'status': 1,
                    'error': `La partie avec le code ${code} est pleine`
                })

                logEvent(`essaie de jointure à une partie (${code})`, `party:join`);
            }
            else {
                // màj du fichier games
                fs.readFile('./server/games.json', 'utf-8', (err, data) => {
                    if (err) {
                        console.error(err)
                    } else {
                        let games = JSON.parse(data).games;
                        games = games.filter((game) => {
                            return game.code != code
                        })
                        fs.writeFileSync('./server/games.json', JSON.stringify({
                            games: games
                        }), 'utf-8', (err) => {
                            console.error(err)
                        });
                    }
                })

                let uuid = uuidv4();

                // sauvegarde du socket dans PLAYERS
                PLAYERS[uuid] = socket;

                // ajout du joueur à la partie
                if (GAMES[code].joinPlayer(uuid, nick)) {
                    delete PLAYERS[uuid];
                    socket.emit('party:join', {
                        'status': 1,
                        'error': `La partie avec le code ${code} est pleine`
                    })
                    return;
                }

                socket.emit('party:join', {
                    'status': 0,
                    'uuid': uuid
                })

                // la partie est pleine
                GAMES[code].state = true;

                logEvent(`jointure à une table (${code})`, `party:join`, uuid);
            }
        } catch (e) {
            console.error(e);
        }
    })
    socket.on('party:connection', 
    /**
     * Connexion et reconnexion à une partie
     * @param {*} uuid uuid utilisateur
     * @param {*} code code de la partie
     */
    (uuid, code) => {
        try {
            // sauvegarde du nouveau socket liée au joueur
            if (uuidValidate(uuid)) PLAYERS[uuid] = socket;
            else {
                logEvent(`un joueur inexistant veut se connecter à une partie (${code})`, 'party:connection', uuid)
                return;
            };

            // envoie de l'état du jeu au nouveau socket
            if (GAMES[code] != null) {
                if (GAMES[code].player1 != uuid && GAMES[code].player2 != uuid) logEvent(`essaie de connexion à une table à qui il n\'appartient pas (${code})`, 'party:connection', uuid);
                else {
                    let d = GAMES[code].getGame();
                    let isW = GAMES[code].gamePlayed % 2 == 1 ? 2 : 1;

                    PLAYERS[GAMES[code].player1].emit('game:play', {
                        // données du plateau
                        board: d.board,
                        turn: GAMES[code].getTurn() == 1,
                        gameTurn: GAMES[code].turn,

                        // données d'affichage
                        won: GAMES[code].won,
                        isWhite: isW == 1,
                        whiteIndex: isW,

                        replay: GAMES[code].replay1 || GAMES[code].replay2,

                        // données sur les pions mangées
                        pawnEaten1: GAMES[code].pawnEaten1,
                        pawnEaten2: GAMES[code].pawnEaten2,

                        // données de configuration
                        player1: GAMES[code].username1,
                        player2: GAMES[code].username2,
                        config: GAMES[code].config,

                        state: 1
                    });
                    if (GAMES[code].player2 != null)
                        PLAYERS[GAMES[code].player2].emit('game:play', {
                        // données du plateau
                        board: d.board,
                        turn: GAMES[code].getTurn() == 2,
                        gameTurn: GAMES[code].turn,

                        // données d'affichage
                        won: GAMES[code].won,
                        isWhite: isW == 2,
                        whiteIndex: isW,

                        replay: GAMES[code].replay1 || GAMES[code].replay2,

                        // données sur les pions mangées
                        pawnEaten1: GAMES[code].pawnEaten1,
                        pawnEaten2: GAMES[code].pawnEaten2,

                        // données de configuration
                        player1: GAMES[code].username1,
                        player2: GAMES[code].username2,
                        config: GAMES[code].config,

                        state: 1
                    });
                    logEvent(`connexion à la partie (${code})`, 'party:connection', uuid);
                }
            }  
        } catch (e) {
            console.error(e);
        }
    })
    socket.on('game:resign', 
    /**
     * Abandon
     * @param {*} uuid uuid utilisateur
     * @param {*} code code de la partie
     */
    (uuid, code) => {
        try {
            if (GAMES[code] != null) {
                if (GAMES[code].player1 != uuid && GAMES[code].player2 != uuid) logEvent(`essaie d'abandonner à une table à qui il n\'appartient pas (${code})`, 'game:resign', uuid);
                else {                
                    // suppression des joueurs
                    PLAYERS[GAMES[code].player1].emit('game:resign');
                    PLAYERS[GAMES[code].player2].emit('game:resign');
                    delete PLAYERS[GAMES[code].player1];
                    delete PLAYERS[GAMES[code].player2];
    
                    // suppression de la table
                    delete GAMES[code];
    
                    logEvent(`suppression de la table (${code})`, 'game:resign', uuid);
                }
            }
        } catch (e) {
            console.log('Le joueur a abondonné en étant seul dans la partie')
        }
    })
    socket.on('game:replay', 
    /**
     * Demande de rejoue
     * @param {*} uuid uuid utilisateur
     * @param {*} code code de la partie
     */
    (uuid, code) => {
        try {
            // sauvegarde du nouveau socket liée au joueur
            if (uuidValidate(uuid)) PLAYERS[uuid] = socket;
            else {
                logEvent(`un joueur inexistant veut se connecter à une partie (${code})`, 'game:play', uuid)
                return;
            };

            // envoie de l'état du jeu au nouveau socket
            if (GAMES[code] != null && GAMES[code].won) {
                if (GAMES[code].player1 != uuid && GAMES[code].player2 != uuid) logEvent(`essaie de connexion à une table à qui il n\'appartient pas (${code})`, 'game:play', uuid);
                else {
                    if (GAMES[code].player1 == uuid) {
                        GAMES[code].replay1 = true;

                        if (GAMES[code].replay2) {
                            let g = GAMES[code];

                            // incrémentation des parties jouées
                            g.gamePlayed++;

                            // reset des autres données
                            g.won = false;
                            g.turn = false;
                            g.replay1 = false;
                            g.replay2 = false;
                            g.pawnEaten1 = 0;
                            g.pawnEaten2 = 0;
                            g.board = [];

                            // récupération du template
                            let ref;
                            if (g.config.size == 11) ref= defaultGameState11x11;
                            else ref = defaultGameState13x13;

                            // on place le template dans le board
                            for (let i in ref) {
                                g.board.push([]);
                                for (let j in ref[i]) {
                                    g.board[g.board.length - 1].push(ref[i][j].toObject());
                                }
                            }

                            let d = GAMES[code].getGame();
                            let isW = GAMES[code].gamePlayed % 2 == 1 ? 2 : 1;

                            PLAYERS[GAMES[code].player1].emit('game:play', {
                                // données du plateau
                                board: d.board,
                                turn: GAMES[code].getTurn() == 1,
                                gameTurn: GAMES[code].turn,

                                // données d'affichage
                                won: GAMES[code].won,
                                isWhite: isW == 1,
                                whiteIndex: isW,

                                replay: GAMES[code].replay1 || GAMES[code].replay2,

                                // données sur les pions mangées
                                pawnEaten1: GAMES[code].pawnEaten1,
                                pawnEaten2: GAMES[code].pawnEaten2,

                                // données de configuration
                                player1: GAMES[code].username1,
                                player2: GAMES[code].username2,
                                config: GAMES[code].config,

                                state: 1
                            });
                            if (GAMES[code].player2 != null)
                                PLAYERS[GAMES[code].player2].emit('game:play', {
                                // données du plateau
                                board: d.board,
                                turn: GAMES[code].getTurn() == 2,
                                gameTurn: GAMES[code].turn,

                                // données d'affichage
                                won: GAMES[code].won,
                                isWhite: isW == 2,
                                whiteIndex: isW,

                                replay: GAMES[code].replay1 || GAMES[code].replay2,

                                // données sur les pions mangées
                                pawnEaten1: GAMES[code].pawnEaten1,
                                pawnEaten2: GAMES[code].pawnEaten2,

                                // données de configuration
                                player1: GAMES[code].username1,
                                player2: GAMES[code].username2,
                                config: GAMES[code].config,

                                state: 1
                            });
                        }

                        PLAYERS[GAMES[code].player2].emit('game:replay');
                    }
                    else if (GAMES[code].player2 == uuid) {
                        GAMES[code].replay2 = true;

                        if (GAMES[code].replay1) {
                            let g = GAMES[code];

                            // incrémentation des parties jouées
                            g.gamePlayed++;

                            // reset des autres données
                            g.won = false;
                            g.turn = false;
                            g.replay1 = false;
                            g.replay2 = false;
                            g.pawnEaten1 = 0;
                            g.pawnEaten2 = 0;
                            g.board = [];

                            // récupération du template
                            let ref;
                            if (g.config.size == 11) ref= defaultGameState11x11;
                            else ref = defaultGameState13x13;

                            // on place le template dans le board
                            for (let i in ref) {
                                g.board.push([]);
                                for (let j in ref[i]) {
                                    g.board[g.board.length - 1].push(ref[i][j].toObject());
                                }
                            }

                            let d = GAMES[code].getGame();
                            let isW = GAMES[code].gamePlayed % 2 == 1 ? 2 : 1;

                            PLAYERS[GAMES[code].player1].emit('game:play', {
                                // données du plateau
                                board: d.board,
                                turn: GAMES[code].getTurn() == 1,
                                gameTurn: GAMES[code].turn,

                                // données d'affichage
                                won: GAMES[code].won,
                                isWhite: isW == 1,
                                whiteIndex: isW,

                                replay: GAMES[code].replay1 || GAMES[code].replay2,

                                // données sur les pions mangées
                                pawnEaten1: GAMES[code].pawnEaten1,
                                pawnEaten2: GAMES[code].pawnEaten2,

                                // données de configuration
                                player1: GAMES[code].username1,
                                player2: GAMES[code].username2,
                                config: GAMES[code].config,

                                state: 1
                            });
                            if (GAMES[code].player2 != null)
                                PLAYERS[GAMES[code].player2].emit('game:play', {
                                // données du plateau
                                board: d.board,
                                turn: GAMES[code].getTurn() == 2,
                                gameTurn: GAMES[code].turn,

                                // données d'affichage
                                won: GAMES[code].won,
                                isWhite: isW == 2,
                                whiteIndex: isW,

                                replay: GAMES[code].replay1 || GAMES[code].replay2,

                                // données sur les pions mangées
                                pawnEaten1: GAMES[code].pawnEaten1,
                                pawnEaten2: GAMES[code].pawnEaten2,

                                // données de configuration
                                player1: GAMES[code].username1,
                                player2: GAMES[code].username2,
                                config: GAMES[code].config,

                                state: 1
                            });
                        }

                        PLAYERS[GAMES[code].player1].emit('game:replay');
                    }
                    else {
                        logEvent(`essaie de rejouer alors qu'il n'est pas dans la partie (${code})`, 'game:replay', uuid);
                    }
                }
            }  
        } catch (e) {
            console.error(e);
        }
    })
    socket.on('game:play', 
    /**
     * Jouer un coup
     * @param {*} uuid uuid utilisateur
     * @param {*} code code de la partie
     * @param {*} start position de départ
     * @param {*} final position finale
     */
    (uuid, code, start, final) => {
        try {
            // sauvegarde du nouveau socket liée au joueur
            if (uuidValidate(uuid)) PLAYERS[uuid] = socket;
            else {
                logEvent(`un joueur inexistant veut se connecter à une partie (${code})`, 'game:play', uuid)
                return;
            };

            // envoie de l'état du jeu au nouveau socket
            if (GAMES[code] != null && !GAMES[code].won) {
                if (GAMES[code].player1 != uuid && GAMES[code].player2 != uuid) logEvent(`essaie de connexion à une table à qui il n\'appartient pas (${code})`, 'game:play', uuid);
                else {
                    if (((GAMES[code].getTurn() == 1 && GAMES[code].player1 != uuid) || 
                        (GAMES[code].getTurn() == 2 && GAMES[code].player2 != uuid))) {
                        logEvent(`essaie de jouer pendant le tour de son adversaire (${code})`, 'game:play', uuid);
                    } else {
                        let res = GAMES[code].move(start, final);
                        let d = GAMES[code].getGame();

                        // console.log(JSON.stringify(res), GAMES[code].getTurn(), start, final)

                        PLAYERS[GAMES[code].player1].emit('game:play', {
                            // données du plateau
                            board: d.board,
                            turn: GAMES[code].getTurn() == 1,
                            gameTurn: GAMES[code].turn,

                            // code response
                            code: res,
                            player1: GAMES[code].username1,
                            player2: GAMES[code].username2,

                            pawnEaten1: GAMES[code].pawnEaten1,
                            pawnEaten2: GAMES[code].pawnEaten2,
                        });
                        PLAYERS[GAMES[code].player2].emit('game:play', {
                            // données du plateau
                            board: d.board,
                            turn: GAMES[code].getTurn() == 2,
                            gameTurn: GAMES[code].turn,

                            // code response
                            code: res,
                            player1: GAMES[code].username1,
                            player2: GAMES[code].username2,
    
                            pawnEaten1: GAMES[code].pawnEaten1,
                            pawnEaten2: GAMES[code].pawnEaten2,
                        });
                    }
                }
            }  
        } catch (e) {
            console.error(e);
        }
    })
});

io.listen(require('./config.json').port);