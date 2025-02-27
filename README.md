# jsau-webserver
[![pipeline status](https://gitlab.sorbonne-paris-nord.fr/11924788/jsau-webserver/badges/main/pipeline.svg)](https://gitlab.sorbonne-paris-nord.fr/11924788/jsau-webserver/-/pipelines)

[![Coverage](https://gitlab.sorbonne-paris-nord.fr/11924788/jsau-webserver/badges/main/coverage.svg)](https://gitlab.sorbonne-paris-nord.fr/11924788/jsau-webserver/-/commits/main)

## Description
Serveur web générant dynamiquement des pages HTML en utilisant EJS et gérant les requêtes des utilisateurs.

## Prérequis
- Node.js (via NVM, version recommandée : `20.17`)
- npm
- Express.js
- EJS (moteur de template)
- Method-override (pour gérer les requêtes DELETE depuis des formulaires HTML)

## Installation
```sh
nvm install 20.17
nvm use 20.17
npm install
```

## Lancement du serveur
```sh
npm start
```

## CI/CD et Qualité
- `npm run lint` : Vérifie la qualité du code
- `npm run stylelint` : Vérifie les styles CSS
- `npm run test` : Exécute les tests unitaires avec Jest

## Auteur
- **Soumia Meddas**  
  Email : soumia.meddas@outlook.fr
