const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use(cors());

app.use(morgan('tiny'));

function getResults(body) {
  const $ = cheerio.load(body);
  const rows = $('li.result-row');
  const results = [];

  rows.each((index, element) => {
    const result = $(element);
    const title = result.find('.result-title').text();
    const price = $(result.find('.result-price').get(0)).text();
    const image = result.find('div.swipe-wrap div[data-index="0"] img').attr('src');
    results.push({
      title,
      price,
      image
    });
  });
  return results;

}

app.get('/', (request, response) => {
  response.json({
    message: "Hello World 👋"
  });
});

app.get('/search/:location/:search_term', (request, response) => {
  const {
    location,
    search_term
  } = request.params;
  const url = `https://${location}.craigslist.org/search/msa?sort=date&query=${search_term}`;
  fetch(url)
    .then(response => response.text())
    .then(body => {
      const results = getResults(body);
      response.json({
        results
      });
    });

  //response.json({
  //   result: [],
  //   url
  // });
});


app.use('/', (request, response, next) => {
  const error = new Error("not found");
  response.status(400);
  next(error);
});

app.use((error, request, response, next) => {
  response.status(response.statsCode || 500);
  response.json({
    message: error.message
  });

});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});