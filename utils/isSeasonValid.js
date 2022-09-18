const SEASON_LENGTH = 11;

module.exports = season => {
  if (!season || typeof season != 'string')
    return false;

  season = season.trim();

  if (season.length != SEASON_LENGTH)
    return false;
  
  if (season.split(' - ').length != 2)
    return false;

  let year1 = season.split(' - ')[0];
  let year2 = season.split(' - ')[1];

  if (isNaN(parseInt(year1)))
    return false;

  if (isNaN(parseInt(year2)))
    return false;

  year1 = parseInt(year1);
  year2 = parseInt(year2);

  if (year1 < 1900 || year1 > (new Date()).getFullYear())
    return false;

  if (year2 != year1 + 1)
    return false;

  return true;
}
