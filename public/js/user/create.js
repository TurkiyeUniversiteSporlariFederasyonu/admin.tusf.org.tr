window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const email = document.getElementById('email-input').value;
      const universityId = document.getElementById('university-id-input').value;
      const name = document.getElementById('name-input').value;
      const phoneNumber = document.getElementById('phone-input').value;
      const password = document.getElementById('password-input').value;
      const confirmPassword = document.getElementById('confirm-password-input').value;

      if (!email || !email.trim().length)
        return error.innerHTML = 'Lütfen kullanıcının e-posta adresini girin.';

      if (!universityId || !universityId.trim().length)
        return error.innerHTML = 'Lütfen bir üniversite seçin.';

      if (password && password.length && password.length < 8)
        return error.innerHTML = 'Şifreniz en az 8 karakterli olmalıdır.';

      if (password && password.length && password != confirmPassword)
        return error.innerHTML = 'Lütfen girdiğiniz şifreyi onaylayın.';

      serverRequest('/user/create', 'POST', {
        email,
        university_id: universityId,
        name,
        phone_number: phoneNumber,
        password
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
