<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // GET route som hämtar alla användare
  $app->get('/users', function ($request, $response) {
    $user = new User($this->db);
    return $response->withJson($user->getAllUsers());
  })->add($auth);

  //GET route som hämtar en enskild användare
  $app->get('/user/{id}', function ($request, $response, $args) {
    $user = new User($this->db);
    return $response->withJson($user->getUserById($args['id']));
  })->add($auth);

  // POST route som registrerar en ny användare.
  $app->POST('/user', function ($request, $response) {
    $data = $request->getParsedBody();

    if (isset($data['username']) && isset($data['password'])) {
      $user = new User($this->db);
      return $response->withJson($user->newUser($data['username'],$data['password']));
    } 
    else {
      return $response->withStatus(400);
    }
  });
};
