<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Login route
  $app->post('/api/login', function ($request, $response) {
    $data = $request->getParsedBody();
    if ($data['username'] && $data['password']) {    
      // Hämta användare i DB
      $s = $this->db->prepare("SELECT * FROM users WHERE username=?");
      $s->execute([$data['username']]);
      $user = $s->fetch(PDO::FETCH_ASSOC);
      // Kontrollera lösenord
      if (password_verify($data['password'], $user['password'])) {
        $_SESSION['loggedIn'] = true;
        $_SESSION['username'] = $data['username'];
        $_SESSION['userID'] = $user['userID'];
        return $response->withJson([
          'userID' => $user['userID'],
          'username' => $user['username'],
          'loggedIn' => true
        ]);
      }
    }  
    return $response->withStatus(401);
  });

  // Utloggning
  $app->get('/api/logoff', function ($request, $response) {
    session_unset();
    return $response->withJson(["loggoff"=>true]);
  })->add($auth);

  // Ping route
  $app->get('/api/ping', function ($request, $response, $args) {
    return $response->withJson(['loggedIn' => true]);
  })->add($auth);
};
