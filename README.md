# Gabon SDGs

This project is created for "Direction Générale de la Statistique Gabon" and consist of visualizations showing data on Gabon SDGs. 

## Features
* Load and display data for the different SDGs

__Link for the visualization__
[https://sdg-gabon.netlify.app/](https://sdg-gabon.netlify.app/)

## Related Repos
* [__SDGsGabon-data__](https://github.com/UNDP-Data/SDGsGabon-data): This repository contains the data for the visualizations
* [__SDGsGabon-dataTest__](https://github.com/UNDP-Data/SDGsGabon-data): This repository contains the test data for the visualizations (meant to test updates on the data)

## Global CSS for UI
__Link for stylesheets__
* https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css (see https://getbootstrap.com/)
* https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraph.css

## Build with
* __Svelte__: Used as MVC framework.
* __Vite__: Used to build your code.
* __Various D3 Libraries__: Used for visualizations, adding interaction and reading the csv data file.
* __Sveltestrap__: Bootstrap for svelte, css grid used for responsiveness, js for the dropdown.

## Installation
__The files which need to be installed to make the visualization visible in the server are in the folder 'dist' (only these files need to be uploaded). The procedure below is only needed for further development of the application.__

This project uses `npm`. For installation you will need to install `node` and `npm`, if you don't already have it. `node` and `npm` can be installed from [here](https://nodejs.org/en/download/).

To install the project, simply clone the the repo and them run `npm install` in the project folder. You can use terminal on Mac and Command Prompt on Windows.

Run the terminal or command prompt and then run the following

```
git clone https://github.com/UNDP-Data/SDGsGabon
cd SDGsGabon
npm install
```
## Local Development
To start the project locally, you can run `npm run dev` in the project folder in terminal or command prompt.

```bash
npm run dev
```

This will run the app in development mode. Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

The page will reload if you make edits. You will also see any errors in the console.

To build the compiler and all the other modules included in the package:

```bash
npm run build
```
## Author
Design and development: [**Roxana Torre**](mailto:roxana.torre@undp.org)