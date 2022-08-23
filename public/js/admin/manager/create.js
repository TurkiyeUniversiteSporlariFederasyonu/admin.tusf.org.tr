window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const email = document.getElementById('email-input').value;
      const name = document.getElementById('name-input').value;

      if (!email || !email.trim().length)
        return error.innerHTML = 'Lütfen yeni kullanıcının e-posta adresinin girin.';

      if (!name || !name.trim().length)
        return error.innerHTML = 'Lütfen yeni kullanıcının adını ve soyadını girin.';

      const roleNodes = document.getElementById('roles-input').querySelectorAll('.general-checked-input-item-selected');
      const roles = [];

      for (let i = 0; i < roleNodes.length; i++)
        roles.push(roleNodes[i].id.replace('checked-input-', ''));

      if (!roles || !roles.length)
        return error.innerHTML = 'Lütfen yeni kullanıcı için en az bir rol seçin.';

      serverRequest('/admin/manager/create', 'POST', {
        email,
        name,
        roles
      }, res => {
        if (!res.success && res.error == 'bad_request')
          return error.innerHTML = 'Lütfen e-posta adresinizi kontrol edin.';
        if (!res.success && res.error == 'duplicated_unique_field')
          return error.innerHTML = 'Bu e-posta adresi ile bir kullanıcı zaten kaydedilmiş. Lütfen farklı bir e-posta adresi deneyin.';
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        
        return window.location = '/admin/manager';
      });
    }
  });
});
