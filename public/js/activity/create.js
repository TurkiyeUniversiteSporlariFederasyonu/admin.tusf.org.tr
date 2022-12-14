window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.id == 'save-button') {
      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const branchId = document.getElementById('branch-id-input').value;
      const type = document.getElementById('type-input').value;
      const stage = document.getElementById('stage-input').value;
      const organizer = document.getElementById('university-search-input').value;
      const gender = document.getElementById('gender-input').value;
      const otherDetails = document.getElementById('other-details-input').value;
      const isActive = document.getElementById('is-active-input').querySelector('.general-checked-input-item-selected') ? true : false;
      const isOnCalendar= document.getElementById('is-on-calendar-input').querySelector('.general-checked-input-item-selected') ? true : false;
      const isWithoutAgeControl = document.getElementById('is-without-age-control-input').querySelector('.general-checked-input-item-selected') ? true : false;
      const athleteCount = document.getElementById('athlete-count-input').value;
      const foreignAthleteCount = document.getElementById('foreign-athlete-count-input').value;
      const startDate = document.getElementById('start-date-input').value;
      const endDate = document.getElementById('end-date-input').value;
      const lastApplicationDate = document.getElementById('last-application-date-input').value;
      const federationRepresentative = {
        name: document.getElementById('federation-representative-name-input').value,
        phone_number: document.getElementById('federation-representative-phone-input').value,
      };
      const techniqueMeeting = {
        time: document.getElementById('technique-meeting-date-input').value.trim().length && document.getElementById('technique-meeting-hour-input').value.trim().length ? document.getElementById('technique-meeting-date-input').value + ' ' + document.getElementById('technique-meeting-hour-input').value : null,
        place: document.getElementById('technique-meeting-place-input').value,
      };

      if (!branchId || !branchId.trim().length)
        return error.innerHTML = 'L??tfen faaliyet bran????n?? se??iniz.';

      if (!type || !type.trim().length)
        return error.innerHTML = 'L??tfen faaliyet tipini se??iniz.';

      if (!stage || !stage.trim().length)
        return error.innerHTML = 'L??tfen faaliyet etab??n?? se??iniz.';

      if (!organizer || !organizer.trim().length)
        return error.innerHTML = 'L??tfen faaliyeti d??zenleyen kurumu yaz??n.';

      if (!gender || !gender.trim().length)
        return error.innerHTML = 'L??tfen faaliyetin cinsiyetini se??iniz.';
      
      serverRequest('/activity/create', 'POST', {
        branch_id: branchId,
        type,
        stage,
        organizer,
        gender,
        other_details: otherDetails,
        is_active: isActive,
        is_on_calendar: isOnCalendar,
        is_without_age_control: isWithoutAgeControl,
        athlete_count: athleteCount,
        foreign_athlete_count: foreignAthleteCount,
        start_date: startDate,
        end_date: endDate,
        last_application_date: lastApplicationDate,
        federation_representative: federationRepresentative,
        technique_meeting: techniqueMeeting
      }, res => {
        if (!res.success && res.error == 'duplicated_unique_field')
          return error.innerHTML = 'Bu ??zelliklere sahip bir faaliyet zaten mevcut. L??tfen yeni bir faaliyet yaratmak yerine o faaliyeti d??zenleyin.';
        if (!res.success)
          return error.innerHTML = 'Bilinmeyen bir hata olu??tu. L??tfen daha sonra tekrar deneyin.';
        
        return window.location = '/activity';
      });
    }
  });
});
