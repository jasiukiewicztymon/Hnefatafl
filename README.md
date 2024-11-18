# Hnefatafl

Bienvenu dans le repo Gitlab du TPI2024 de `Jasiukiewicz Tymon`.

## Structure

`/diagrammes` - Vous trouverez tout les diagrammes pour comprendre le fonctionnement de l'application

`/next-app` - C'est le répertoire de l'application

`/next-app/server/` - C'est le serveur websocket

## Installation des dépendances

Si vous n'avez pas installé les dépendances veuillez utiliser la commande suivante dans le rértoire de l'application (/next-app):

```shell
npm install
```

## Démarrage du serveur

Avant de démarer n'oubliez pas de modifier les fichiers de configuration qui se trouve respectivement dans `/next-app/server/config.json` et `/next-app/src/config.json` pour fournir les données pour la connexion entre le client web et le serveur websocket.

Pour démarrer le serveur web effectuez:

```shell
npm run dev
```

Pour démarrer le serveur web-socket effectuez:

```shell
npm run websocket-server
```

## Test unitaire

Pour effectuer les tests unitaires veuillez utiliser la command suivante:

```shell
npm run test
```
