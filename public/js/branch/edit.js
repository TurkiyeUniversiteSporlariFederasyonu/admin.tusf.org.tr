let branch;

window.addEventListener('load', () => {
  branch = JSON.parse(document.getElementById('branch').value);

  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const name = document.getElementById('name-input').value;
      const type = document.getElementById('type-input').value;
      const gender = document.getElementById('gender-input').value;
      const goldCount = document.getElementById('gold-medal-count-input').value;
      const silverCount = document.getElementById('silver-medal-count-input').value;
      const bronzeCount = document.getElementById('bronze-medal-count-input').value;
      const minSize = document.getElementById('team-min-size-input').value;
      const maxSize = document.getElementById('team-max-size-input').value;
      const subbranches = [];
      const categories = [];

      if (!name || !name.trim().length)
        return error.innerHTML = 'Lütfen branş ismini girin.';
      
      if (!type || !type.trim().length)
        return error.innerHTML = 'Lütfen branş tipini seçin.';

      if (!gender || !gender.trim().length)
        return error.innerHTML = 'Lütfen branş cinsiyetini seçin.';

      if (!goldCount || !goldCount.trim().length)
        return error.innerHTML = 'Lütfen branş altın madalya sayısını girin.';

      if (!silverCount || !silverCount.trim().length)
        return error.innerHTML = 'Lütfen branş gümüş madalya sayısını girin.';

      if (!bronzeCount || !bronzeCount.trim().length)
        return error.innerHTML = 'Lütfen branş bronz madalya sayısını girin.';

      if (minSize && !isNaN(parseInt(minSize)) && maxSize && !isNaN(parseInt(maxSize)) && minSize > maxSize)
        return error.innerHTML = 'Takım minimum oyuncu sayısı maksimum oyuncu sayısından fazla olamaz.'

      const subbranchNodes = document.getElementById('subbranches-wrapper').children;
      for (let i = 0; i < subbranchNodes.length; i++)
        subbranches.push(subbranchNodes[i].childNodes[0].innerHTML);

      const categoryNodes = document.getElementById('categories-wrapper').children;
        for (let i = 0; i < categoryNodes.length; i++)
          categories.push(categoryNodes[i].childNodes[0].innerHTML);

      serverRequest('/branch/edit?id=' + branch._id, 'POST', {
        name,
        type,
        gender,
        gold_count: goldCount,
        silver_count: silverCount,
        bronze_count: bronzeCount,
        team_min_size: minSize,
        team_max_size: maxSize,
        subbranches,
        categories
      }, res => {
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        
        return window.location = '/branch';
      });
    }
  });
});
