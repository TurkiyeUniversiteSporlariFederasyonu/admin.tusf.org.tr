const json2csv = require('json-2-csv');

const Result = require('../../../models/result/Result');

module.exports = (req, res) => {
  req.query.season = '2021 - 2022';
  req.query.by = 'medal';

  Result.createAndGetMedalOrderBy(req.query, (err, order) => {
    if (err)
      return res.redirect('/error?message=' + err);

    json2csv.json2csv(order, (err, csv) => {
      if (err) return res.redirect('/');

      return res.attachment('Madalya Sıralaması (2021 - 2022).csv').send(csv);
    });
  });
}
