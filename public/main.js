(function(){
  
  // Knyt templates till views
  const views = {
    login: ['loginFormTemplate','registerFormTemplate'/*, Alla inlägg */],
    loggedIn: ['loggedInTemplate'/*, Alla inlägg */],
  }

  // views
  const renderView = (view) => {
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

      // Hämta in data till view
    });
  }

  renderView(views.login);

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
        console.log(response)
        if (!response.ok) {
          return Error(response.statusText);
        }
        else {
         return response.json();
        }
      })
      .then(data => {
        renderView(views.loggedIn);
      });
  });



  // Hämta alla users
  const getAllUsers = () => {
    fetch('/users')
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });
  }

})(); // Namespace end
