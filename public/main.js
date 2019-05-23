// (function(){
  // Initiera sessionStorage-variabler om dem inte redan finns
  // if (!sessionStorage.getItem('activeView')) sessionStorage.setItem('activeView','');
  // if (!sessionStorage.getItem('userID')) sessionStorage.setItem('userID','');
  // if (!sessionStorage.getItem('username')) sessionStorage.setItem('username','');

  // Knyt templates till views
  const views = {
    headerLoggedIn     : ['logoTemplate','navTemplate','memberLogoutTemplate'],
    headerNotLoggedIn  : ['logoTemplate'],
    entriesNotLoggedIn : ['loginFormTemplate','registerFormTemplate','searchTemplate','entriesTemplate'],
    entriesLoggedIn    : ['searchTemplate','entriesTemplate'],
    showEntry          : ['showEntryTemplate'],
    newEntry           : ['newEntryTemplate'],
    editEntry          : ['editEntryTemplate'],
    users              : ['membersTemplate']
  }

  // Basic View
  class BaseView {
    renderView(view, targetName='main') {
      // Definera target
      const target = document.querySelector(targetName);
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
      updateEventListeners();
    }
  }

  // View för flera inlägg
  class EntryView extends BaseView {
    // Bestäm view baserat på om man är inloggad eller ej
    loadView (entries='all') {
      checkLogin().then(data => {
        this.renderView(data.loggedIn ? views.entriesLoggedIn : views.entriesNotLoggedIn);
        this.loadEntries(entries);
      });
    }

    // Ladda in inlägg all = alla, private = inloggad användare
    loadEntries(entries='all') {
      const target = document.querySelector('#entriesListing');
      let url, title;
      if (entries === 'private') {
        url = '/entries?user='+sessionStorage.getItem('userID')+'&order=desc'
        title = 'Dina inlägg';
      }
      else {
        url = '/entries?order=desc';
        title = 'Alla inlägg';
      }
      let fragment = document.createDocumentFragment();
      // Skapa rubrik
      const heading = document.createElement('h2');
      heading.textContent = title;
      fragment.append(heading);
      // Skapa sökruta

      // Hämta och läs in inlägg
      fetch(url)
        .then(response => response.ok ? response.json() : new Error(response.statusText))
        .then(data => {
          data.forEach(post => {
            const entry = document.createElement('div');
            const heading = document.createElement('h3');
            const date = document.createElement('p')
            const content = document.createElement('p');
            const user = document.createElement('p');
            entry.classList.add('post');
            entry.setAttribute('data-id',post.entryID);
            heading.textContent = post.title;
            date.textContent = post.createdAt;
            content.textContent = post.content;
            user.textContent = 'ANVÄNDARNAMN';
            entry.append(heading,date,content,user);
            fragment.append(entry);
          });
          // Skriv ut
          target.innerHTML = '';
          target.append(fragment);
        });
    }

    showEntry() {

    }

    editEntry() {

    }
  }

  // Skriv ut meny och utloggningsknapp om vi är inloggad
  checkLogin().then(data => {
    (new BaseView).renderView(data.loggedIn ? views.headerLoggedIn : views.headerNotLoggedIn, 'header');
  });

  // Skriv ut main views
  if (sessionStorage.getItem('activeView') === 'privateEntries') {

  }
  else if (sessionStorage.getItem('activeView') === 'viewEntry') {
    
  }
  else if (sessionStorage.getItem('activeView') === 'newEntry') {

  }
  // Om ingen activeView är vald, kör view för startsida (meddelanden), om vi inte är inloggad visas inloggnings och registreringsformulär
  else { (new EntryView).loadView() }
 
  // Funktion för att uppdatera eventlisteners
  const updateEventListeners = () => {
    // Login - Logoff
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) loginForm.addEventListener('submit', login);
    const logout = document.querySelector('#logoff');
    if (logout) logout.addEventListener('click' , logoff);

    // Menyval
    const navAllEntries = document.querySelector('#navAllEntries');
    if (navAllEntries) navAllEntries.addEventListener('click', e => { 
      e.preventDefault();
      (new EntryView).loadView();
    });
    const navPrivateEntries = document.querySelector('#navPrivateEntries');
    if (navPrivateEntries) navPrivateEntries.addEventListener('click', e => { 
      e.preventDefault();
      (new EntryView).loadView('private');
    });
  }

  // Loginfunktion
  function login(e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    fetch('/api/login',{
      method : 'POST',
      body   : formData
    })
    .then(response => {
      if (!response.ok) {
        document.querySelector('#loginFormError').innerText = 'Fel användarnamn eller lösenord.'
      }
      else {
        (new BaseView).renderView(views.headerLoggedIn, 'header');
        (new BaseView).renderView(views.entriesLoggedIn);
        return response.json();
      } 
    })
    .then(data => {
      sessionStorage.setItem('userID',data.userID);
      sessionStorage.setItem('username',data.username);
    });
  }
  
  // Logofffunktion
  function logoff(e) {
    e.preventDefault();
    console.log('funkar')
    fetch('/api/logoff')
    .then(response => {
        console.log(response);
        (new BaseView).renderView(views.headerNotLoggedIn);
        (new BaseView).renderView(views.entriesNotLoggedIn);
        sessionStorage.clear();
    });
  }

  // Funktion för att kolla inloggningsstatus
  function checkLogin() {
    return fetch('/api/ping')
      .then(response => response.ok ? response.json() : new Error(response.statusText))
      .catch(error => console.error(error));
  }



// })(); // Namespace end
