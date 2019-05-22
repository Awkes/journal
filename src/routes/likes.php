<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // GET route som räknar likes
  $app->get('/likes/{id}', function ($request, $response, $args) {  
    $like = new Like($this->db);
    return $response->withJson($like->cntLikes($args['id']));
  });

  // POST route som registrerar en ny like
  $app->post('/like/{id}', function ($request, $response, $args) {  
    $like = new Like($this->db);
    return $response->withJson($like->newLike($args['id']));
  })->add($auth);

  // DELETE route som tar bort en like
  $app->delete('/like/{id}', function ($request, $response, $args) {  
    $like = new Like($this->db);
    return $response->withJson($like->delLike($args['id']));
  })->add($auth);
};
