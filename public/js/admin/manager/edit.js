let manager;

window.addEventListener('load', () => {
  manager = JSON.parse(document.getElementById('manager').value);

  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const name = document.getElementById('name-input').value;

      if (!name || !name.trim().length)
        return error.innerHTML = 'Lütfen kullanıcının adını ve soyadını girin.';

      const roleNodes = document.getElementById('roles-input').querySelectorAll('.general-checked-input-item-selected');
      const roles = [];

      for (let i = 0; i < roleNodes.length; i++)
        roles.push(roleNodes[i].id.replace('checked-input-', ''));

      if (!roles || !roles.length)
        return error.innerHTML = 'Lütfen kullanıcı için en az bir rol seçin.';

      serverRequest('/admin/manager/edit?id=' + manager._id.toString(), 'POST', {
        name,
        roles
      }, res => {
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        
        return window.location = '/admin/manager';
      });
    }
  });
});
