<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';



 /*  $app->post('/addComment', function($request, $response){
    
    $data = $request->getParsedBody();
    $comment = new Comment($this->db);

    return $response->withJson($comment->addComment($data));
  }); *//* ->add($auth); */

};
