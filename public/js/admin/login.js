window.addEventListener('load', () => {
  document.getElementById('form').onsubmit = event => {
    event.preventDefault();

    const password = document.getElementById('password-input').value;
    const error = document.getElementById('error');

    error.innerHTML = '';

    if (!password || !password.length)
      return error.innerHTML = 'Lütfen geçerli bir şifre girin.';

    serverRequest('/admin/login', 'POST', {
      password
    }, res => {
      if (!res.success)
        return error.innerHTML = 'Girdiğiniz şifre yanlış.';

      return window.location = '/admin';
    });
  }
});
