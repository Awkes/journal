# Examinationsuppgift 3 - CMS-verktyg, backend och interaktion med databaser.

Gruppnamn: MAD  
Medlemmar: Magnus Lidmyr, Andreas Åkerlöf, Daniel Hessling  
Repo: https://github.com/Awkes/journal.git  
  
# API ROUTES  
  
## USERS  
  
GET  
/users              Hämta alla användare  
/user/{id}          Hämta en enskild användare  
  
POST  
/user               Skapa ny användare [BODY = user, pass]  
  
## ENTRIES  
  
GET  
/entries            Hämta alla inlägg  
/entries?limit=X    Hämta X antal inlägg  
/entries?order=X    Hämta inlägg sorterat i ordning X [ASC eller DESC (ASC är standard)]  
/entries?userID=X   Hämta inlägg från user med ID X.  
  
(Alla querystrings går att kombinera)  
  
POST  
/entry              Skapa nytt inlägg som inloggad användare [BODY = title, content]  
  
DELETE  
/entry/{id}         Ta bort ett inlägg med ID {id}  

## LIKES  
  
GET  
/likes/{id}         Räkna likes för entry med ID {id}  
  
POST  
/like/{id}          Like:a ett inlägg med ID {id}  
  
DELETE  
/like/{id}          Dislike:a ett inlägg med ID {id}
  
## LOG IN/OFF  
   
/api/login          Logga in [BODY = user, pass]  
/api/logoff         Logga ut  
/api/ping           Kontrollera inlogg  
