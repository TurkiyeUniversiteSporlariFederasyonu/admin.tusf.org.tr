let user;

window.addEventListener('load', () => {
  user = JSON.parse(document.getElementById('user').value);

  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const universityId = document.getElementById('university-id-input').value;
      const name = document.getElementById('name-input').value;
      const phoneNumber = document.getElementById('phone-input').value;

      if (!universityId || !universityId.trim().length)
        return error.innerHTML = 'Lütfen bir üniversite seçin.';

      serverRequest('/user/edit?id=' + user._id, 'POST', {
        university_id: universityId,
        name,
        phone_number: phoneNumber
      }, res => {
        if (!res.success && res.error == 'duplicated_unique_field')
          return error.innerHTML = 'Bu e-posta adresi ile bir kullanıcı zaten kaydedilmiş.';
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        
        return window.location = '/user';
      });
    }
  });
});
