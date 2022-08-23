module.exports = (university, callback) => {
  if (university.logo && university.short_name && university.city)
    return callback(null, true);
    
  return callback(null, false);
}
