(function(){
  // Knyt templates till views
  const views = {
    headerLoggedIn       : ['logoTemplate','memberLogoutTemplate','navTemplate','searchTemplate'],
    headerNotLoggedIn    : ['logoTemplate','searchTemplate'],
    entriesNotLoggedIn   : ['loginFormTemplate','registerFormTemplate','entriesTemplate'],
    entriesLoggedIn      : ['entriesTemplate'],
    showEntryLoggedIn    : ['showEntryTemplate','showEntryCommentTemplate','showEntryCommentsTemplate'],
    showEntryNotLoggedIn : ['showEntryTemplate','showEntryCommentsTemplate'],
    newEntry             : ['newEntryTemplate'],
    editEntry            : ['editEntryTemplate'],
    users                : ['membersTemplate'],
    userRegistered       : ['loginFormTemplate','memberSuccessTemplate','entriesTemplate']
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
        // Läs in innehållet från template
        const content = document.createElement('template');
        content.innerHTML = templateMarkup;       
        // Skriva ut innehållet i target
        target.append(content.content);
      });
      updateEventListeners();
    }
  }

  // Views för inlägg
  class EntryView extends BaseView {
    // Bestäm view baserat på om man är inloggad, utloggad eller nyregistrerad
    loadView(entries='all',registered=false) {
      checkLogin().then(data => {
        registered
          ? this.renderView(views.userRegistered)
          : this.renderView(data.loggedIn ? views.entriesLoggedIn : views.entriesNotLoggedIn);
        this.loadEntries(entries);
      });
    }

    // Ladda in inlägg, all = alla, private = inloggad användare, 
    loadEntries(entries='all') {
      const target = document.querySelector('#entriesListing');
      let url, title;
      if (entries === 'private') {
        url = '/entries?user='+sessionStorage.getItem('userID')+'&order=desc';
        title = 'Mina inlägg';
      }
      else if (entries === 'search') {
        url = '/entries?search='+sessionStorage.getItem('searchString')+'&order=desc';
        title = 'Sökresultat';
      }
      else {
        url = '/entries?order=desc';
        title = 'Alla inlägg';
      }
      let fragment = document.createDocumentFragment();
      // Skapa rubrik
      const heading = document.createElement('h1');
      heading.textContent = title;
      fragment.append(heading);      
      // Hämta och läs in inlägg
      fetch(url)
        .then(response => response.ok ? response.json() : new Error(response.statusText))
        .then(data => {
          if (data.length > 0) {
            let count = 0; // Håller reda på när ny pagineringsvy ska skapas
            let pageIndex = 1;  // Används för att numrera pagineringsvyer
            let page = document.createElement('div'); // Skapar första pagineringsvyn
            page.setAttribute('data-page', pageIndex);
            data.forEach(post => {
              // Kontrollera om vi uppnåt 20 inlägg, appenda isf aktuell page
              // fragment och skapa sedan en ny
              if (count === 20) {
                count = 0; // Nollställ count
                pageIndex++; // Öka på pageIndex
                fragment.append(page);
                page = document.createElement('div'); // Skapar nästa pagineringsvy
                page.setAttribute('data-page', pageIndex);
                page.classList.add('paging-hidden');
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
            paging.classList.add('paging');
            for (let i = 1; i <= pageIndex; i++) {
              const listItem = document.createElement('li');
              const pagingLink = document.createElement('a');
              pagingLink.setAttribute('href','');
              pagingLink.setAttribute('data-page', i);
              pagingLink.textContent = i;
              if (i === 1) pagingLink.classList.add('paging-active');
              listItem.append(pagingLink);
              paging.append(listItem);
            }
            // Appenda sista page och paginering
            fragment.append(page,paging);
          }
          else {
            // Om inga inlägg hittas visa det
            const noEntries = document.createElement('div');
            noEntries.classList.add('no-entries');
            noEntries.textContent = 'Inga inlägg hittades.';
            fragment.append(noEntries);
          }
          // Skriv ut allt på sidan
          target.innerHTML = '';
          target.append(fragment);
        })
        .catch(error => console.error(error));
    }

    showEntry(id) {
      checkLogin().then(data => {
        // Välj vy beroende på om man är inloggad eller ej
        const loggedIn = data.loggedIn;
        loggedIn
          ? this.renderView(views.showEntryLoggedIn)
          : this.renderView(views.showEntryNotLoggedIn);
        // Hämta inlägg
        fetch('/entry/'+id)
          .then(response => response.ok ? response.json() : new Error(response.statusText))
          .then(data => {
            // Skriv ut inlägg
            const titleElement = document.querySelector('#showEntryTitle');
            const dateElement = document.querySelector('#showEntryDate');
            const userElement = document.querySelector('#showEntryUser');
            const contentElement = document.querySelector('#showEntryContent');
            titleElement.textContent = data.title;
            dateElement.textContent = data.createdAt;
            userElement.textContent = data.username;
            contentElement.textContent = data.content;
            // Ta bort länkar för att gilla och/eller editera, ta bort om man inte är inloggad som rätt användare
            if (!loggedIn) 
              document.querySelectorAll('#showEntryLike, #showEntryLinks').forEach(link => link.remove());
            else if(sessionStorage.userID !== data.createdBy)
              document.querySelector('#showEntryLinks').remove();
            this.getLikes(id);   // Hämta och skriv ut likes
            this.getComments(id,loggedIn) // Hämta och skriv ut kommentarer
          })
          .catch(error => console.error(error));
      });
    }

    getLikes(id) {
      fetch('/likes/'+id)
      .then(response => response.ok ? response.json() : new Error(response.statusText))
      .then(data => {
        const likeCountElement = document.querySelector('#showEntryLikes');
        likeCountElement.textContent = data.likes;
      })
      .catch(error => console.error(error));
    }

    getComments(id,loggedIn) {
      const target = document.querySelector('#showEntryComments');
      let fragment = document.createDocumentFragment();
      // Hämta och läs in kommentarer
      fetch('/comment/'+id+'?order=desc')
        .then(response => response.ok ? response.json() : new Error(response.statusText))
        .then(data => {
          if (data.length > 0) {
            let count = 0; // Håller reda på när ny pagineringsvy ska skapas
            let pageIndex = 1;  // Används för att numrera pagineringsvyer
            let page = document.createElement('div'); // Skapar första pagineringsvyn
            page.setAttribute('data-page', pageIndex);
            data.forEach(post => {
              // Kontrollera om vi uppnåt 5 kommentarer, appenda isf aktuell page
              // fragment och skapa sedan en ny
              if (count === 5) {
                count = 0; // Nollställ count
                pageIndex++; // Öka på pageIndex
                fragment.append(page);
                page = document.createElement('div'); // Skapar nästa pagineringsvy
                page.setAttribute('data-page', pageIndex);
                page.classList.add('paging-hidden');
              } 
              // Skapa kommentaren
              const comment = document.createElement('div');
              const content = document.createElement('p');
              const bottom = document.createElement('div')
              const posted = document.createElement('span');
              comment.classList.add('post');
              bottom.classList.add('showEntryCommentBottom');
              content.textContent = post.content;
              posted.textContent = post.createdAt +' - '+ post.username;
              bottom.append(posted);
              // Om man är inloggad och rätt användare lägg till redigera/ta bort länkar
              if (loggedIn && sessionStorage.userID === post.createdBy) {
                const commentLinks = document.createElement('span');
                const editComment = document.createElement('a');
                const deleteComment = document.createElement('a');
                editComment.textContent = 'Redigera';
                deleteComment.textContent = 'Ta bort';
                editComment.setAttribute('data-editid',post.commentID);
                deleteComment.setAttribute('data-delid',post.commentID);
                editComment.setAttribute('href','');
                deleteComment.setAttribute('href','');
                commentLinks.append(editComment,' | ',deleteComment);
                bottom.append(commentLinks);
              }
              comment.append(content, bottom);
              // Appenda comment på aktuell page
              page.append(comment);
              // Räkna inlägget
              count++;
            });
            // Skapa pagineringslänkar
            const paging = document.createElement('ul'); // Lista för paginglänkar
            paging.classList.add('paging');
            for (let i = 1; i <= pageIndex; i++) {
              const listItem = document.createElement('li');
              const pagingLink = document.createElement('a');
              pagingLink.setAttribute('href','');
              pagingLink.setAttribute('data-page', i);
              pagingLink.textContent = i;
              if (i === 1) pagingLink.classList.add('paging-active');
              listItem.append(pagingLink);
              paging.append(listItem);
            }
            // Appenda sista page och paginering
            fragment.append(page,paging);
          }
          else {
            // Om inga kommentarer hittas visa det
            const noEntries = document.createElement('div');
            noEntries.classList.add('no-entries');
            noEntries.textContent = 'Inga kommentarer hittades.';
            fragment.append(noEntries);
          }
          // Skriv ut allt på sidan
          target.innerHTML = '';
          target.append(fragment);
        })
        .catch(error => console.error(error));
    }
    
    editEntry() {

    }
  }

  // Views för users
  class UserView extends BaseView {
    listAllUsers() {
      this.renderView(views.users);
      const target = document.querySelector('#allUsers');
      let fragment = document.createDocumentFragment();
      // Skapa rubrik
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      const heading = document.createElement('h1');
      heading.textContent = 'Registrerade medlemmar';
      th.append(heading);
      tr.append(th);
      thead.append(th);
      fragment.append(thead);
      // Hämta och läs in alla användare
      fetch('/users')
        .then(response => response.ok ? response.json() : new Error(response.statusText))
        .then(data => {
          if (data.length > 0) {
            data.forEach(user => {
              // Skapa HTML för aktuell user
              const tr = document.createElement('tr');
              const td = document.createElement('td');
              td.textContent = user['username'];
              tr.append(td);
              fragment.append(tr);
            });
          }
          else {
            // Om inga users finns visa detta
            const noUsers = document.createElement('div');
            noUsers.classList.add('no-entries');
            noEntries.textContent = 'Inga användare hittades.';
            fragment.append(noEntries);
          }
          // Skriv ut allt på sidan
          target.innerHTML = '';
          target.append(fragment);
        })
        .catch(error => console.error(error));
    }
  }

  // Skriv ut meny och utloggningsknapp om vi är inloggad
  checkLogin().then(data => {
    (new BaseView).renderView(data.loggedIn ? views.headerLoggedIn : views.headerNotLoggedIn, 'header');
  });

  // Skriv ut main views
  if (sessionStorage.getItem('activeView') === 'privateEntries') (new EntryView).loadView('private');
  else if (sessionStorage.getItem('activeView') === 'showEntry') (new EntryView).showEntry(sessionStorage.getItem('entryID'));
  else if (sessionStorage.getItem('activeView') === 'newEntry') (new EntryView).renderView(views.newEntry);
  else if (sessionStorage.getItem('activeView') === 'allUsers') (new UserView).listAllUsers(views.listAllUsers);
  else (new EntryView).loadView();
 
  // Funktion för att uppdatera selectorer och eventlisteners
  function updateEventListeners() {
    // Login + Logoff + Register
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) loginForm.addEventListener('submit', login);
    const logout = document.querySelector('#logoff');
    if (logout) logout.addEventListener('click' , logoff);
    const registerForm = document.querySelector('#registerForm');
    if (registerForm) registerForm.addEventListener('submit' , registerUser);
    const loggedInMember = document.querySelector('#loggedInMember');
    if (loggedInMember) loggedInMember.textContent = sessionStorage.getItem('username');

    // Logo + Menyval
    const logo = document.querySelector('#logo');
    if (logo) logo.addEventListener('click', loadAllEntries);
    const navAllEntries = document.querySelector('#navAllEntries');
    if (navAllEntries) navAllEntries.addEventListener('click', loadAllEntries);
    const navPrivateEntries = document.querySelector('#navPrivateEntries');
    if (navPrivateEntries) navPrivateEntries.addEventListener('click', loadPrivateEntries);
    const navNewEntry = document.querySelector('#navNewEntry');
    if (navNewEntry) navNewEntry.addEventListener('click', writeNewEntry);
    const navAllUsers = document.querySelector('#navAllUsers');
    if (navAllUsers) navAllUsers.addEventListener('click', listAllUsers);
    
    // Sök
    const searchEntries = document.querySelector('#searchEntries');
    if (searchEntries) searchEntries.addEventListener('submit', searchAllEntries);
    const searchString = document.querySelector('#searchString');

    // Entries visning/redigering
    const entriesListing = document.querySelector('#entriesListing');
    if (entriesListing) entriesListing.addEventListener('click', handleEntriesEvents);

    // Entry comments visning/redigering
    const showEntryComments = document.querySelector('#showEntryComments');
    if (showEntryComments)  showEntryComments.addEventListener('click', handleEntryCommentsEvents);
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

  function searchAllEntries(e) {
    e.preventDefault();
    (new EntryView).loadView('search', searchString.value);
    sessionStorage.setItem('activeView', 'searchEntries');
    sessionStorage.setItem('searchString', searchString.value);
    e.target.reset();
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
    else if (e.target.matches('.paging a')) {
      const pages = document.querySelectorAll('#entriesListing > div');
      pagingViewer(pages,e);
    }
  }

  function handleEntryCommentsEvents(e) {
    e.preventDefault();
    // Lägg till eventlisteners för
    // tabort
    // redigera

    // Klick på paging byter sida i pagingvyn
    if (e.target.matches('.paging a')); {
      const pages = document.querySelectorAll('#showEntryComments > div');
      pagingViewer(pages,e);
    }
  }

  function pagingViewer(pages,e) {
    // Visar vald vy, gömmer resten
    pages.forEach(el => {
      (el.dataset.page === e.target.dataset.page)
        ? el.classList.remove('paging-hidden')
        : el.classList.add('paging-hidden');
    });
    // Markerar vald vy i pagingnavigationen
    const paging = document.querySelectorAll('.paging a');
    paging.forEach(el => {
      (el.dataset.page === e.target.dataset.page)
        ? el.classList.add('paging-active')
        : el.classList.remove('paging-active');
    });
  }

  function listAllUsers(e) {
    e.preventDefault();
    (new UserView).listAllUsers();
    sessionStorage.setItem('activeView', 'allUsers');
  }

  // Login
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

  // Logoff
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

  // Registrera användare
  function registerUser(e) {
    e.preventDefault();
    const formData = new FormData(registerForm);
    fetch('/user',{
      method : 'POST',
      body   : formData
    })
    .then(response => response.ok ? response.json() : new Error(response.statusText))
    .then(data => {
      !data.success
        ? document.querySelector('#registerFormError').textContent = data.message
        : (new EntryView).loadView('all',true);
    })
    .catch(error => console.error(error));
  }

})(); // Namespace end