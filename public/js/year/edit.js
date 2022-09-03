let year;

window.addEventListener('load', () => {
  year = JSON.parse(document.getElementById('year').value);

  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';

      const participationUpdateStartDate = document.getElementById('participation-update-start-date-input').value;
      const participationUpdateEndDate = document.getElementById('participation-update-end-date-input').value;

      if (participationUpdateStartDate > participationUpdateEndDate)
        return error.innerHTML = 'Branş seçimi başlangıç tarihi bitiş tarihinden sonra olamaz.';

      serverRequest('/year/edit?id=' + year._id, 'POST', {
        participation_update_start_date: participationUpdateStartDate,
        participation_update_end_date: participationUpdateEndDate
      }, res => {
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        
        return window.location = '/year';
      });
    }
  });
});
