let user;

window.addEventListener('load', () => {
  user = JSON.parse(document.getElementById('user').value);

  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const password = document.getElementById('password-input').value;
      const confirmPassword = document.getElementById('confirm-password-input').value;

      if (!password || !password.trim().length)
        return error.innerHTML = 'Lütfen geçerli bir şifre girin.';

      if (password.trim().length < 8)
        return error.innerHTML = 'Girdiğiniz şifre en az 8 karakterli olmalıdır.';

      if (password.trim() != confirmPassword.trim())
        return error.innerHTML = 'Lütfen şifrenizi tekrar edin.';

      serverRequest('/user/password?id=' + user._id, 'POST', {
        password
      }, res => {
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        
        return window.location = '/user';
      });
    }
  });
});
