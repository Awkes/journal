(function(){
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
    loadView(entries='all') {
      checkLogin().then(data => {
        this.renderView(data.loggedIn ? views.entriesLoggedIn : views.entriesNotLoggedIn);
        this.loadEntries(entries);
      });
    }

    // Ladda in inlägg, all = alla, private = inloggad användare
    loadEntries(entries='all') {
      const target = document.querySelector('#entriesListing');
      let url, title;
      if (entries === 'private') {
        url = '/entries?user='+sessionStorage.getItem('userID')+'&order=desc';
        title = 'Mina inlägg';
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
      
      // Skapa sökruta ------------------------------------!
      
      // Hämta och läs in inlägg
      fetch(url)
        .then(response => response.ok ? response.json() : new Error(response.statusText))
        .then(data => {
          let count = 0; // Håller reda på när ny pagineringsvy ska skapas
          let pageIndex = 1;  // Används för att numrera pagineringsvyer
          let page = document.createElement('div'); // Skapar första pagineringsvyn
          page.setAttribute('data-page', pageIndex);
          data.forEach(post => {
            // Kontrollera om vi uppnåt 20 inlägg, appenda isf aktuell page
            // fragment och skapa sedan en ny
            if (count === 5) {
              count = 0; // Nollställ count
              pageIndex++; // Öka på pageIndex
              fragment.append(page);
              page = document.createElement('div'); // Skapar nästa pagineringsvy
              page.setAttribute('data-page', pageIndex);
              page.classList.add('entries-hidden');
            } 
            // Skapa HTML för aktuell entry
            const entry = document.createElement('div');
            const heading = document.createElement('h3');
            const posted = document.createElement('p');
            const content = document.createElement('p');
            entry.classList.add('post');
            entry.setAttribute('data-entryid',post.entryID);
            heading.textContent = post.title;
            posted.textContent = post.createdAt +' - '+ post.username;
            content.textContent = post.content.length > 100 
              ? post.content.substring(0,100)+' ...' 
              : post.content;
            entry.append(heading,posted,content);
            // Appenda entry på aktuell page
            page.append(entry);
            // Räkna inlägget
            count++;
          });
          // Skapa pagineringslänkar
          const paging = document.createElement('ul'); // Lista för paginglänkar
          paging.classList.add('entries-paging');
          for (let i = 1; i <= pageIndex; i++) {
            const listItem = document.createElement('li');
            const pagingLink = document.createElement('a');
            pagingLink.setAttribute('href','');
            pagingLink.setAttribute('data-page', i);
            pagingLink.textContent = i;
            if (i === 1) pagingLink.classList.add('entries-paging-active');
            listItem.append(pagingLink);
            paging.append(listItem);
          }
          // Appenda sista page och paginering, skriv sedan ut allt
          fragment.append(page,paging);
          target.innerHTML = '';
          target.append(fragment);
        });
    }

    showEntry(id) {
      this.renderView(views.showEntry);
    }
    
    editEntry() {

    }
  }

  // Skriv ut meny och utloggningsknapp om vi är inloggad
  checkLogin().then(data => {
    (new BaseView).renderView(data.loggedIn ? views.headerLoggedIn : views.headerNotLoggedIn, 'header');
  });

  // Skriv ut main views
  if (sessionStorage.getItem('activeView') === 'privateEntries') (new EntryView).loadView('private');
  else if (sessionStorage.getItem('activeView') === 'showEntry') (new EntryView).showEntry();
  else if (sessionStorage.getItem('activeView') === 'newEntry') (new EntryView).renderView(views.newEntry);
  else (new EntryView).loadView();
 
  // Funktion för att uppdatera eventlisteners
  function updateEventListeners() {
    // Login - Logoff
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) loginForm.addEventListener('submit', login);
    const logout = document.querySelector('#logoff');
    if (logout) logout.addEventListener('click' , logoff);

    // Menyval
    const navAllEntries = document.querySelector('#navAllEntries');
    if (navAllEntries) navAllEntries.addEventListener('click', loadAllEntries);
    const navPrivateEntries = document.querySelector('#navPrivateEntries');
    if (navPrivateEntries) navPrivateEntries.addEventListener('click', loadPrivateEntries);
    const navNewEntry = document.querySelector('#navNewEntry');
    if (navNewEntry) navNewEntry.addEventListener('click', writeNewEntry);
    
    // Entry visning/redigering
    const entriesListing = document.querySelector('#entriesListing');
    if (entriesListing) document.addEventListener('click', handleEntriesEvents);
  }

  // Funktioner för att ladda vyer
  function loadAllEntries(e) {
    e.preventDefault();
    (new EntryView).loadView();
    sessionStorage.setItem('activeView', 'allEntries');
  }

  function loadPrivateEntries(e) {
    e.preventDefault();
    (new EntryView).loadView('private');
    sessionStorage.setItem('activeView', 'privateEntries');
  }

  function writeNewEntry(e) {
    e.preventDefault();
    (new EntryView).renderView(views.newEntry);
    sessionStorage.setItem('activeView', 'newEntry');
  }

  function handleEntriesEvents(e) {
    e.preventDefault();
    // Klick på poster laddar ett inlägg
    if (e.target.matches('.post, .post *')) {
      const entryID = e.path.find(el => el.dataset.entryid).dataset.entryid;
      (new EntryView).showEntry(entryID);
      sessionStorage.setItem('activeView', 'showEntry');
      sessionStorage.setItem('entryID', entryID);
    }
    // Klick på paging byter sida i pagingvyn
    else if (e.target.matches('.entries-paging a')) {
      const pages = document.querySelectorAll('#entriesListing > div');
      pages.forEach(el => {
        (el.dataset.page === e.target.dataset.page)
          ? el.classList.remove('entries-hidden')
          : el.classList.add('entries-hidden');
      });
      const paging = document.querySelectorAll('.entries-paging a');
      paging.forEach(el => {
        (el.dataset.page === e.target.dataset.page)
          ? el.classList.add('entries-paging-active')
          : el.classList.remove('entries-paging-active');
      });
    }
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
        (new EntryView).loadView();
        return response.json();
      } 
    })
    .then(data => {
      sessionStorage.setItem('userID',data.userID);
      sessionStorage.setItem('username',data.username);
    });
  }
  
  // Logoffunktion
  function logoff(e) {
    e.preventDefault();
    fetch('/api/logoff')
    .then(response => {
        console.log(response);
        (new BaseView).renderView(views.headerNotLoggedIn, 'header');
        (new EntryView).loadView();
        sessionStorage.clear();
    });
  }

  // Funktion för att kolla inloggningsstatus
  function checkLogin() {
    return fetch('/api/ping')
      .then(response => response.ok ? response.json() : new Error(response.statusText))
      .catch(error => console.error(error));
  }

})(); // Namespace end
