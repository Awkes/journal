<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  /* Basic protected GET route 
  $app->get('/user/{id}', function ($request, $response, $args) {
    $userID = $args['id'];
    $user = new User($this->db);

    return $response->withJson($user->getUserByID($userID));
  })->add($auth); */

  // Skapa en GET route som hämtar alla användare (tänk på att INTE visa password-fältet)
  $app->get('/users', function ($request, $response) {
    $user = new User($this->db);
    return $response->withJson($user->getAllUsers());
  });//->add($auth);

  // Skapa en GET route som hämtar en enskild användare (tänk på att INTE visa password-fältet )
  $app->get('/user/{id}', function ($request, $response, $args) {
    $user = new User($this->db);
    return $response->withJson($user->getUserById($args['id']));
  })->add($auth);

  // Skapa en POST route som registrerar en ny användare.
  $app->POST('/user', function ($request, $response) {
    $data = $request->getParsedBody();

    if (isset($data['user']) && isset($data['pass'])) {
      $user = new User($this->db);
      return $response->withJson($user->newUser($data['user'],$data['pass']));
    } 
    else {
      return $response->withStatus(400);
    }
  });

};
