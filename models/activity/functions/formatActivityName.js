const isSeasonValid = require('../../../utils/isSeasonValid');

const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const gender_names = {
  male: 'Erkek',
  female: 'Kadın',
  mix: 'Erkek - Kadın'
};
const city_values = ['Gazimağusa', 'Girne', 'Güzelyurt', 'İskele', 'Lefke', 'Lefkoşa', 'Adana', 'Adıyaman', 'Afyon', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir',   'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya',   'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya',  'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',  'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak',  'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'];

module.exports = data => {
  if (!data || typeof data != 'object')
    return null;

  if (!data.season || !isSeasonValid(data.season))
    return null;

  if (!data.branch_name || typeof data.branch_name != 'string' || !data.branch_name.trim().length || !data.branch_name.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return null;

  if (!data.organizer || typeof data.organizer != 'string' || !data.organizer.trim().length || data.organizer.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return null;

  if (!data.gender || !gender_names[data.gender.toString()])
    return null;

  if (!data.city || !city_values.includes(data.city))
    return null;

  return data.season.trim() + ' ' + data.branch_name.trim() + ' ' + (data.stage && typeof data.stage == 'string' ? data.stage.trim() + ' ' : '') + (data.type && typeof data.type == 'string' ? data.type.trim() + ' ' : '') + data.organizer.trim() + ' ' + data.city.trim() + ' (' + gender_names[data.gender.toString()] + ')';
}
