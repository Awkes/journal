<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // GET route som hämtar inlägg
  $app->get('/entries', function ($request, $response) {  
    $entry = new Entry($this->db);
    // Läs in eventuella qrystrings
    $qryString = $request->getQueryParams();
    // Begränsa antalet
    $limit = (isset($qryString['limit']) && is_numeric($qryString['limit'])) 
      ? 'LIMIT '.$qryString['limit'] : '';
    // Välj order
    $order = (isset($qryString['order']) && $qryString['order'] == 'desc') 
      ? 'DESC' : 'ASC';
    // Hämta från specifik user
    $user = (isset($qryString['user']) && is_numeric($qryString['user'])) 
      ? 'WHERE createdBy = '.$qryString['user'] : '';
    return $response->withJson($entry->getEntries($user,$order,$limit));
  });

  // POST route som sparar ett nytt inlägg för en viss användare.
  $app->post('/entry', function ($request, $response) {
    $data = $request->getParsedBody();
    if (isset($data['title']) && isset($data['content'])) {
      $entry = new Entry($this->db);
      return $response->withJson($entry->newEntry($data['title'],$data['content']));
    } 
    else {
      return $response->withStatus(400);
    }
  })->add($auth);

  // PUT route som uppdaterar ett inlägg för en viss användare.
  $app->put('/entry/{id}', function ($request, $response, $args) {
    $data = $request->getParsedBody();
    if (isset($data['title']) && isset($data['content'])) {
      $entry = new Entry($this->db);
      return $response->withJson($entry->updEntry($args['id'],$data['title'],$data['content']));
    } 
    else {
      return $response->withStatus(400);
    }
  })->add($auth);

  // DELETE route som raderar ett inlägg.
  $app->delete('/entry/{id}', function ($request, $response, $args) {
    $entry = new Entry($this->db);
    return $response->withJson($entry->delEntry($args['id']));
  })->add($auth);

};
