# Examinationsuppgift 3 - CMS-verktyg, backend och interaktion med databaser.

Gruppnamn: MAD  
Medlemmar: Magnus Lidmyr, Andreas Åkerlöf, Daniel Hessling  
Repo: https://github.com/Awkes/journal.git  
  
# API ROUTES  
  
## LOG IN/OFF  
  
| GET               | Beskrivning |
| ---               | --- |
| /api/logoff       | Logga ut |
| /api/ping         | Kontrollera inlogg  |

| POST               | Beskrivning |
| ---               | --- |
| /api/login        | Logga in [BODY = user, pass] |

  
## USERS  
    
| GET               | Beskrivning |
| ---               | --- |
| /users            | Hämta alla användare |
| /user/{id}        | Hämta en enskild användare |
  
| POST              | Beskrivning |
| ---               | ---
| /user             | Skapa ny användare [BODY = user, pass] |
  
## ENTRIES  
  
| GET               | Beskrivning |
| ---               | --- |
| /entries          | Hämta alla inlägg |
| /entries?limit=X  | Hämta X antal inlägg |
| /entries?order=X  | Hämta inlägg sorterat i ordning X [ASC eller DESC (ASC är standard)] |
| /entries?userID=X | Hämta inlägg från user med ID X. |
| /entries?search=X | Söker på inlägg där X finns i titel eller innehåll. |
  
(Alla querystrings går att kombinera)  
  
| POST              | Beskrivning |
| ---               | --- |
| /entry            | Skapa nytt inlägg som inloggad användare [BODY = title, content] |
  
| DELETE            | Beskrivning |
| ---               | --- |
| /entry/{id}       | Ta bort ett inlägg med ID {id} |

## LIKES  
  
| GET               | Beskrivning |
| ---               | --- |
| /likes/{id}       | Räkna likes för entry med ID {id} |
  
| POST              | Beskrivning |
| ---               | --- |  
| /like/{id}        |Like:a ett inlägg med ID {id} |
  
| DELETE            | Beskrivning |
| ---               | --- |  
| /like/{id}        | Dislike:a ett inlägg med ID {id} |
  
## COMMENTS

| GET               | Beskrivning |
| ---               | --- |
| /comment          | Hämta alla inlägg |
| /comment?limit=X  | Hämta X antal inlägg |
| /comment?order=X  | Hämta inlägg sorterat i ordning X [ASC eller DESC (ASC är standard)] |

| POST              | Beskrivning |
| ---               | --- |  
| /comment          | Skapa ny kommentar som inloggad användare [BODY = content, entryID] |

| PUT               | Beskrivning |
| ---               | --- |  
| /comment/{id}     | Uppdatera en kommentar som inloggad användare [BODY = content] |

| DELETE            | Beskrivning |
| ---               | --- |  
| /comment          | Ta bort en kommentar som inloggad användare |
