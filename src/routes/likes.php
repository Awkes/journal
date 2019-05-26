<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // GET route som räknar likes
  $app->get('/likes/{id}', function ($request, $response, $args) {  
    $like = new Like($this->db);
    return $response->withJson($like->cntLikes($args['id']));
  });
  
  // GET route som gillar/ogillar ett inlägg
  $app->get('/like/{id}', function ($request, $response, $args) {  
    $like = new Like($this->db);
    return $response->withJson($like->likeDislike($args['id']));
  })->add($auth);
};
