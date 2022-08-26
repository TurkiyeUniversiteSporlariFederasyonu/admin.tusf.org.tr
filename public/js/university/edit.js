let university;
let cities;
let cyprusCities;

function reloadCitySearchInputOptions(cities) {
  document.getElementById('city-input').value = '';
  document.getElementById('city-search-input').value = '';
  const wrapper = document.getElementById('city-options-wrapper');

  wrapper.innerHTML = '';

  cities.forEach(city => {
    const eachOption = document.createElement('div');
    eachOption.classList.add('general-select-input-each-option');
    eachOption.id = city;
    eachOption.innerHTML = city;
    wrapper.appendChild(eachOption);
  });
}

window.addEventListener('load', () => {
  university = JSON.parse(document.getElementById('university').value);
  cities = JSON.parse(document.getElementById('cities').value);
  cyprusCities = JSON.parse(document.getElementById('cyprus-cities').value);

  document.addEventListener('click', event => {
    if (event.target.classList.contains('is-cyprus-university')) {
      setTimeout(() => {
        if (event.target.classList.contains('general-checked-input-item-selected'))
          reloadCitySearchInputOptions(cyprusCities);
        else
          reloadCitySearchInputOptions(cities);
      }, 100);
    }

    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const name = document.getElementById('name-input').value;
      const shortName = document.getElementById('short-name-input').value;
      const city = document.getElementById('city-input').value;
      const rector = document.getElementById('rector-input').value;

      if (!name || !name.trim().length)
        return error.innerHTML = 'Lütfen üniversitenin adını girin.';

      const isCyprusUniversity = document.getElementById('is-cyprus-university-input').querySelector('.general-checked-input-item-selected') ? true : false;

      serverRequest('/university/edit?id=' + university._id, 'POST', {
        name,
        is_cyprus_university: isCyprusUniversity,
        short_name: shortName,
        city,
        rector
      }, res => {
        if (!res.success && res.error == 'duplicated_unique_field')
          return error.innerHTML = 'Bu isimde bir üniversite zaten kaydedilmiş.';
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        
        return window.location = '/university';
      });
    }
  });
});
