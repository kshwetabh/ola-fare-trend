## NodeJS app to fetch Ola fares for a specific source and destination.

### Screenshot
![Screenshot of data](https://raw.githubusercontent.com/kshwetabh/ola-fare-trend/master/screenshot.JPG)


## To run the project follow these steps:
1. Download the source code from github: `git clone https://github.com/kshwetabh/ola-fare-trend.git)`
2. Install the dependencies: `npm install`
3. On the first run you must create a sqlite3 database
   1. Run this command to create the database and related tables: `node migrate.js`
4. Update the **olaHomeToOfcUrl** and **olaOfcToHomeURL** variables in `config.js` (grab the urls for your routes from here: ![ola](https://book.olacabs.com/location)
5. To start capturing and storing the latest Ola fares run: `node scrap_ola_rates.js`
6. To start UI and see the rates for various categories run: `node server.js`
7. Open browser and navigate to `http://localhost:3001` to access the data on a chart.

## Technolgy stack used:
1. NodeJS
2. Puppeteer to fetch latest fares and store into the database
3. ExpressJS for Web Application frontend
4. VueJS for the frontend (makes in-browser reactivity a breeze)