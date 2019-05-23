// (function(){
  
  // Knyt templates till views
  const views = {
    headerLoggedIn     : ['navTemplate','memberLogoutTemplate'],
    entriesNotLoggedIn : ['loginFormTemplate','registerFormTemplate','searchTemplate','entriesTemplate'],
    entriesLoggedIn    : ['searchTemplate','entriesTemplate'],
    showEntry          : ['showEntryTemplate'],
    newEntry           : ['newEntryTemplate'],
    editEntry          : ['editEntryTemplate'],
    users              : ['membersTemplate']
  }

  // Basic View
  class BaseView {
    renderView(view) {
      // Definera target
      const target = document.querySelector('main');
      target.innerHTML = '';
      // Loopa igenom vår view
      view.forEach(template => {
        // Hämta template
        const templateMarkup = document.querySelector('#'+template).innerHTML;
        
        // Skapa div och läs in innehållet från template
        const content = document.createElement('div');
        content.innerHTML = templateMarkup;
        
        // Skriva ut innehållet i target
        target.append(content);
      });
    }
  }
  


  (new BaseView).renderView(views.entriesNotLoggedIn);
  
  

  // loginForm
  const loginForm = document.querySelector('#loginForm');
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    fetch('/api/login',{
      method : 'POST',
      body   : formData
    })
      .then(response => {
        (!response.ok)
          ?  document.querySelector('#loginFormError').innerText = 'Fel användarnamn eller lösenord.'
          : (new BaseView).renderView(views.entriesLoggedIn);
      });
  });
 


// })(); // Namespace end
