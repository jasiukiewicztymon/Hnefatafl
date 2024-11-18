var assert = require('assert');
const { describe } = require('mocha');
const { Game, checkWhite } = require('../server/game')

describe('Moteur du jeu', () => {
    // mouvements uniques
    describe('mouvements normaux', () => {
        const g = new Game('123456', {
            size: 11
        });

        it('nous ne pouvons pas utiliser une position de départ où il n\'y a pas de pion', () => {
            assert(g.move([0, 0], [1, 1]) == 1)
        });
        it('nous ne pouvons pas commencer avec les blancs', () => {
            assert(g.move([5, 3], [5, 3]) == 2)
        })
        it('nous ne pouvons pas jouer avec les blancs quand c\'est aux noirs de jouer', () => {
            assert(g.move([3, 5], [2, 5]) == 4)
        })
        it('nous ne pouvons pas sauter par deçu des pions', () => {
            assert(g.move([5, 0], [5, 2]) == 6)
        })
        it('nous ne pouvons pas nous arrêter sur un autre pions', () => {
            assert(g.move([3, 0], [3, 5]) == 6)
        })

        it('le pion blanc en coordonnées 5:3 devrait avoir 9 mouvements possibles', () => {
            assert(g.getMoves([5, 3]).length == 9)
        })
        it('une case vide devrait avoir 0 mouvements possible', () => {
            assert(g.getMoves([0, 0]).length == 0)
        })
        it('le roi devrait avoir 0 mouvement possible', () => {
            assert(g.getMoves([5, 5]).length == 0)
        })
        it('le pion noir en coordonnées 3:0 devrait avoir 5 mouvements possibles', () => {
            assert(g.getMoves([3, 0]).length == 6)
        })
        it('le pion noir en coordonnées 4:0 devrait avoir 3 mouvements possibles', () => {
            assert(g.getMoves([4, 0]).length == 3)
        })
        it('le pion noir en coordonnées 5:1 devrait avoir 11 mouvements possibles', () => {
            assert(g.getMoves([5, 1]).length == 11)
        })
    })
    // custom mouvements in cross
    describe('mouvements en croix', () => {
        const g = new Game('123456', {
            size: 11,
            mouvements: 1
        });

        it('le pion noir en coordonnées 3:0 devrait avoir 2 mouvmenets possibles', () => {
            assert(g.getMoves([3, 0]).length == 2)
        })
        it('les noirs se déplace de 3:0 en 3:1', () => {
            assert(g.move([3, 0], [3, 1]) == 0)
        })
        it('maintenant le pions en coordonnées 3:1 devrait avoir 4 mouvements possibles', () => {
            assert(g.getMoves([3, 1]).length == 4)
        })
        it('le roi devrait avoir 0 mouvements possibles', () => {
            assert(g.getMoves([5, 5]).length == 0)
        })
    })
    // custom mouvements (adjacents)
    describe('mouvements adjacents', () => {
        const g = new Game('123456', {
            size: 11,
            mouvements: 2
        });

        it('le pion noir en coordonnées 3:0 devrait avoir 4 mouvements possibles', () => {
            assert(g.getMoves([3, 0]).length == 4)
        })
        it('les noirs se déplace de 3:0 en 3:1', () => {
            assert(g.move([3, 0], [3, 1]) == 0)
        })
        it('maintenant le pions noir en coordonnées 3:1 devrait avoir 7 mouvements possibles', () => {
            assert(g.getMoves([3, 1]).length == 7)
        })
        it('le roi devrait avoir 0 mouvements possibles', () => {
            assert(g.getMoves([5, 5]).length == 0)
        })
    })
    // deplacement dans un vrai partie
    describe('mouvements dans une partie simulée', () => {
        const g = new Game('123456', {
            size: 11
        });
        it('les noirs se déplace de 3:0 en 3:4', () => {
            assert(g.move([3, 0], [3, 4]) == 0);
        })
        it('les noirs ne peuvent pas réjouer leurs coup', () => {
            assert(g.move([3, 4], [3, 0]) == 3);
        })
        it('les blancs se déplacent de 5:3 en 1:3', () => {
            assert(g.move([5, 3], [1, 3]) == 0);
        })
        it('les noirs se déplace de 3:4 en 1:4', () => {
            assert(g.move([3, 4], [1, 4]) == 0);
        })
        it('les blancs se déplace de 5:4 en 5:2', () => {
            assert(g.move([5, 4], [5, 2]) == 0);
        })
        it('les blancs ne peuvents pas réjouer leurs coup', () => {
            assert(g.move([5, 5], [5, 3]) == 5);
        })
        it('les noirs se déplacent de 5:1 en 0:1', () => {
            assert(g.move([5, 1], [0, 1]) == 0);
        })
        it('les blancs se déplacent de 5:5 en 5:3', () => {
            assert(g.move([5, 5], [5, 3]) == 0);
        })
    })
    // capture dans une vrai partie
    describe('capture normale dans une partie simulée', () => {
        const g = new Game('123456', {
            size: 11
        });
        it('les noirs se déplacent de 3:0 en 3:1', () => {
            assert(g.move([3, 0], [3, 1]) == 0);
        })
        it('les blancs se déplacent de 4:4 en 1:4', () => {
            assert(g.move([4, 4], [1, 4]) == 0);
        })
        it('les noirs efféctuent une capture par le déplacement de 0:3 en 1:3', () => {
            assert(g.move([0, 3], [1, 3]) == 0);
        })
        it('le pion blanc en 1:4 devrait disparaître', () => {
            assert(g.board[1][4].player == null && g.pawnEaten2 == 1);
        })
    })
    // capture avec forteresse dans une vrai partie
    describe('capture avec un fort dans une partie simulée', () => {
        const g = new Game('123456', {
            size: 11
        });
        it('les noirs se déplacent de 5:1 en 1:1', () => {
            assert(g.move([5, 1], [1, 1]) == 0);
        })
        it('les blancs se déplacent de 5:3 en 5:2', () => {
            assert(g.move([5, 3], [5, 2]) == 0);
        })
        it('les noirs se déplacent de 1:1 en 0:1', () => {
            assert(g.move([1, 1], [0, 1]) == 0);
        })
        it('les blancs éffectuent une capture par le déplacement de 5:2 en 0:2', () => {
            assert(g.move([5, 2], [0, 2]) == 0);
        })
        it('le pion noir en 0:1 devrait disparaître', () => {
            assert(g.board[0][1].player == null && g.pawnEaten1 == 1);
        })
    })
    // deux captures dans un vrai partie
    describe('capture double dans une partie simulée', () => {
        const g = new Game('123456', {
            size: 11
        });
        it('les noirs se déplacent de 3:10 en 3:8', () => {
            assert(g.move([3, 10], [3, 8]) == 0);
        })
        it('les blancs se déplacent de 5:7 en 2:7', () => {
            assert(g.move([5, 7], [2, 7]) == 0);
        })
        it('les noirs se déplacent de 4:10 en 4:9', () => {
            assert(g.move([4, 10], [4, 9]) == 0);
        })
        it('les blancs se déplacent de 2:7 en 2:10', () => {
            assert(g.move([2, 7], [2, 10]) == 0);
        })
        it('les noirs se déplacent de 3:0 en 3:1', () => {
            assert(g.move([3, 0], [3, 1]) == 0);
        })
        it('les blancs se déplacent de 2:10 en 4:10', () => {
            assert(g.move([2, 10], [4, 10]) == 0);
        })
        it('les noirs se déplacent de 3:1 en 3:0', () => {
            assert(g.move([3, 1], [3, 0]) == 0);
        })
        it('les blancs se déplacent de 4:4 en 2:4', () => {
            assert(g.move([4, 4], [2, 4]) == 0);
        })
        it('les noirs se déplacent de 3:0 en 3:1', () => {
            assert(g.move([3, 0], [3, 1]) == 0);
        })
        it('les blancs se déplacent de 2:4 en 2:8', () => {
            assert(g.move([2, 4], [2, 8]) == 0);
        })
        it('les noirs se déplacent de 3:1 en 3:0', () => {
            assert(g.move([3, 1], [3, 0]) == 0);
        })
        it('les blancs éffectuent une double capture par le déplacement de 4:6 en 4:8', () => {
            assert(g.move([4, 6], [4, 8]) == 0);
        })
        it('les pions noirs en 3:8 et 4:9 devraient disparaître', () => {
            assert(g.board[3][8].player == null && g.board[4][9].player == null && g.pawnEaten1 == 2);
        })
    })
    // test de victoire des noirs par la capture du roi
    describe('une victoire noir par la capture du roi dans une partie simulée', () => {
        const g = new Game('123456', {
            size: 11
        });
        it('les noirs se déplacent de 3:10 en 3:6', () => {
            assert(g.move([3, 10], [3, 6]) == 0);
        })
        it('les blancs se déplacent de 5:7 en 1:7', () => {
            assert(g.move([5, 7], [1, 7]) == 0);
        })
        it('les noirs se déplacent de 5:9 en 5:7', () => {
            assert(g.move([5, 9], [5, 7]) == 0);
        })
        it('le pion blanc en coordonnées 5:6 devrait disparaître', () => {
            assert(g.board[5][6].player == null && g.pawnEaten2 == 1);
        })
        it('les blancs se déplacent de 5:5 en 5:6', () => {
            assert(g.move([5, 5], [5, 6]) == 0);
        })
        it('les noirs se déplacent de 5:7 en 2:7', () => {
            assert(g.move([5, 7], [2, 7]) == 0);
        })
        it('le pion blanc en coordonnées 1:7 devrait disparaître', () => {
            assert(g.board[1][7].player == null && g.pawnEaten2 == 2);
        })
        it('les blancs se déplacent de 5:6 en 5:9', () => {
            assert(g.move([5, 6], [5, 9]) == 0);
        })
        it('les noirs se déplacent de 4:10 en 4:9', () => {
            assert(g.move([4, 10], [4, 9]) == 0);
        })
        it('les blancs se déplacent de 5:3 en 5:2', () => {
            assert(g.move([5, 3], [5, 2]) == 0);
        })
        it('les noirs se déplacent de 6:10 en 6:9 et ainsi capture le roi', () => {
            assert(g.move([6, 10], [6, 9]) == -2);
        })
    })
    // test de la fonction checkWhite
    describe("vérification de la fonction checkWhite qui vérifie si le roi avec ses pions adjacents sont encerclés", () => {
        it('les blancs sont encerclés (cas no1)', () => {
            assert(checkWhite(
                [
                    [{ player: null }, { player: 'b' }, { player: 'b' }, { player: 'b' }, { player: null }],
                    [{ player: 'b' }, { player: 'w' }, { player: 'w' }, { player: 'w' }, { player: 'b' }],
                    [{ player: 'b' }, { player: 'w' }, { player: 'k' }, { player: 'w' }, { player: 'b' }],
                    [{ player: 'b' }, { player: 'w' }, { player: 'w' }, { player: 'w' }, { player: 'b' }],
                    [{ player: null }, { player: 'b' }, { player: 'b' }, { player: 'b' }, { player: null }], 
                ],
                [1, 1], {}
            ) == 0)
        })
        it('les blancs sont encerclés (cas no2)', () => {
            assert(checkWhite(
                [
                    [{ player: null }, { player: 'b' }, { player: 'b' }, { player: 'b' }, { player: null }],
                    [{ player: 'b' }, { player: 'w' }, { player: 'w' }, { player: 'w' }, { player: 'b' }],
                    [{ player: null }, { player: 'b' }, { player: 'k' }, { player: 'w' }, { player: 'b' }],
                    [{ player: 'b' }, { player: 'w' }, { player: 'w' }, { player: 'w' }, { player: 'b' }],
                    [{ player: null }, { player: 'b' }, { player: 'b' }, { player: 'b' }, { player: null }], 
                ],
                [1, 1], {}
            ) == 0)
        })
        it('les blancs sont encerclés (cas no3)', () => {
            assert(checkWhite(
                [
                    [{ player: null }, { player: 'b' }, { player: 'b' }, { player: null }],
                    [{ player: 'b' }, { player: 'w' }, { player: 'k' }, { player: 'b' }],
                    [{ player: null }, { player: 'b' }, { player: 'b' }, { player: null }]
                ],
                [1, 1], {}
            ) == 0)
        })
        it('les blancs ne sont pas encerclés', () => {
            assert(checkWhite(
                [
                    [{ player: null }, { player: 'b' }, { player: 'b' }, { player: 'b' }, { player: null }],
                    [{ player: 'b' }, { player: 'w' }, { player: 'w' }, { player: 'w' }, { player: 'b' }],
                    [{ player: null }, { player: 'w' }, { player: 'k' }, { player: 'w' }, { player: 'b' }],
                    [{ player: 'b' }, { player: 'w' }, { player: 'w' }, { player: 'w' }, { player: 'b' }],
                    [{ player: null }, { player: 'b' }, { player: 'b' }, { player: 'b' }, { player: null }], 
                ],
                [1, 1], {}
            ) == -1)
        })
    })
    // victoire par les blanc avec le roi qui se place sur une forteresse
    describe('une vicroire blanche par le déplacement du roi sur un fort', () => {
        const g = new Game('123456', {
            size: 5
        });
        g.board = [
            [{ player: null, isFort: true, isEnd: true }, { player: 'k', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }],
            [{ player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: true, isEnd: true }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: true, isEnd: true }]
        ]
        g.turn = !g.turn;
        it("le roi se déplace sur un fort", () => {
            assert(g.move([0, 1], [0, 0]) == -1); // max problem
        })
    })
    // victoire des noirs par encerclement
    describe('une victoire noire par l\'encerclement du roi et ses pions adjacents', () => {
        const g = new Game('123456', {
            size: 5
        });
        g.board = [
            [{ player: null, isFort: true, isEnd: true }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: 'b', isFort: false, isEnd: false }, { player: 'k', isFort: false, isEnd: false }, { player: 'w', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }],
            [{ player: null, isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'w', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: true, isEnd: true }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: 'w', isFort: false, isEnd: false }, { player: null, isFort: true, isEnd: true }]
        ]
        it("les noirs encerclent le roi et ses pions adjacents", () => {
            assert(g.move([1, 4], [1, 3]) == -2); // max problem
        })
    })
    // la règle sur le roi incapturable le sur bord
    describe('vérification du fonctionnement de la règle du roi incapturable sur la bordure du plateau', () => {
        const g = new Game('123456', {
            size: 5
        });
        const g1 = new Game('123456', {
            size: 5,
            borderProtection: true
        });
        g.board = [
            [{ player: null, isFort: true, isEnd: true }, { player: 'b', isFort: false, isEnd: false }, { player: 'k', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: 'b', isFort: false, isEnd: false }, { player: 'w', isFort: false, isEnd: false }, { player: 'w', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }],
            [{ player: null, isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'w', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: true, isEnd: true }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: true, isEnd: true }]
        ]
        g1.board = structuredClone(g.board);
        it("les noirs capture le roi sur la bordure quand la règle n'est pas activée", () => {
            assert(g.move([1, 3], [0, 3]) == -2);
        })
        it("les noirs ne capture pas le roi sur la bordure quand la règle est activée", () => {
            assert(g1.move([1, 3], [0, 3]) == 0);
        })
        it("la partie n'est pas terminée", () => {
            assert(g1.won == false);
        })
    })
    // la règle du joueur qui n'a pas de mouvement légaux perd
    describe('vérification du fonctionnement de la règle du joueur qui n\'a pas de mouvement légal', () => {
        const g = new Game('123456', {
            size: 5,
            borderProtection: true
        });
        g.board = [
            [{ player: null, isFort: true, isEnd: true }, { player: 'b', isFort: false, isEnd: false }, { player: 'k', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: 'b', isFort: false, isEnd: false }, { player: 'w', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }],
            [{ player: 'w', isFort: false, isEnd: false }, { player: 'w', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: 'b', isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: true, isEnd: true }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: true, isEnd: true }]
        ]
        it("les noirs se déplacent de 1:3 en 0:3 ainsi bloquant les blancs", () => {
            assert(g.move([1, 3], [0, 3]) == -2);
        })
    })
    // le roi ne peut pas se faire manger sur sa forteresse
    describe('vérification du fonctionnement de la règle du roi qui ne peut pas se faire capturer sur une forteresse', () => {
        const g = new Game('123456', {
            size: 5,
            borderProtection: true
        });
        g.board = [
            [{ player: null, isFort: true, isEnd: true }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: true, isEnd: true }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: true, isEnd: true }, { player: 'b', isFort: false, isEnd: false }, { player: 'k', isFort: true, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: true, isEnd: true }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: 'b', isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }],
            [{ player: null, isFort: true, isEnd: true }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }, { player: null, isFort: false, isEnd: false }]
        ]
        it("les noirs se déplacent de 3:3 en 2:3 pour essayer de capturer le roi", () => {
            assert(g.move([3, 3], [2, 3]) == 0);
        })
        it("la partie n'est pas terminée", () => {
            assert(!g.win);
        })
    })

    /*describe('test', () => {
        const g = new Game('123456', {
            size: 13
        });
        console.log(g.getMoves([4, 0]));
    })*/
})

