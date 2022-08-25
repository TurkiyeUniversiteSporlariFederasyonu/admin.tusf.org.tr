const DATE_FIELD_LENGTH = 10;

module.exports = date => {
  if (!date || typeof date != 'string')
    return null;

  if (date.length > DATE_FIELD_LENGTH)
    return null;

  const dateSplit = date.split('.');

  if (dateSplit.length != 3)
    return null;

  if (dateSplit[0].length > 2)
    return null;

  if (isNaN(parseInt(dateSplit[0])) || parseInt(dateSplit[0]) < 1 || parseInt(dateSplit[0]) > 31)
    return null;

  if (dateSplit[0].length == 1)
    dateSplit[0] = '0' + dateSplit[0]

  if (dateSplit[1].length > 2)
    return null;

  if (isNaN(parseInt(dateSplit[1])) || parseInt(dateSplit[1]) < 1 || parseInt(dateSplit[1]) > 12)
    return null;

  if (dateSplit[1].length == 1)
    dateSplit[1] = '0' + dateSplit[1];

  if (dateSplit[2].length != 4)
    return null;

  if (isNaN(parseInt(dateSplit[2])) || parseInt(dateSplit[2]) < 2000 || parseInt(dateSplit[2]) > ((new Date()).getFullYear() + 1))
    return null;

  return dateSplit.join('.');
}
