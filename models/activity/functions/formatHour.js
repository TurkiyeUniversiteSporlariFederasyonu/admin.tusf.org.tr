module.exports = hour => {
  if (!hour || typeof hour != 'string')
    return null;

  const hourSplit = hour.split('.');

  if (hourSplit.length != 2)
    return null;

  if (isNaN(parseInt(hourSplit[0])) || parseInt(hourSplit[0]) < 0 || parseInt(hourSplit[0]) > 23)
    return null;

  if (hourSplit[0].length > 2)
    return null;

  if (hourSplit[0].length == 0)
    hourSplit[0] = '00';
  if (hourSplit[0].length == 1)
    hourSplit[0] = '0' + hourSplit[0];

  if (isNaN(parseInt(hourSplit[1])) || parseInt(hourSplit[1]) < 0 || parseInt(hourSplit[1]) > 59)
    return null;

  if (hourSplit[1].length > 2)
    return null;

  if (hourSplit[1].length == 0)
    hourSplit[1] = '00';
  if (hourSplit[1].length == 1)
    hourSplit[1] = '0' + hourSplit[0];

  return hourSplit.join(':');
}
