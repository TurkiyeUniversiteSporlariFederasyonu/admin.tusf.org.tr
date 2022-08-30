window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const name = document.getElementById('name-input').value;
      const startDate = document.getElementById('start-date-input').value;
      const endDate = document.getElementById('end-date-input').value;
      const activityIdList = [];

      if (!name || !name.trim().length)
        return error.innerHTML = 'Lütfen olimpiyat ismini girin.';

      if (!startDate || !startDate.trim().length)
        return error.innerHTML = 'Lütfen olimpiyatın başlangıç tarihini girin.';

      if (!endDate || !endDate.trim().length)
        return error.innerHTML = 'Lütfen olimpiyatın bitiş tarihini girin.';

      const activityNodes = document.getElementById('activities-wrapper').children;
      for (let i = 0; i < activityNodes.length; i++)
        activityIdList.push(activityNodes[i].childNodes[0].id);

      serverRequest('/contest/create', 'POST', {
        name,
        startDate,
        endDate,
        activity_id_list: activityIdList
      }, res => {
        if (!res.success && res.error == 'duplicated_unique_field')
          return error.innerHTML = 'Bu isimde bir olimpiyat zaten mevcut.';
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        
        return window.location = '/contest';
      });
    }
  });
});
