<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';


  $app->get('/comment/{entryID}', function($request, $response, $args){

    $entryID = $args['entryID'];
    $qryString = $request->getQueryParams();
    // Begränsa antalet
    $limit = (isset($qryString['limit']) && is_numeric($qryString['limit'])) 
      ? 'LIMIT '.$qryString['limit'] : '';
    // Välj order
    $order = (isset($qryString['order']) && $qryString['order'] == 'desc') 
      ? 'DESC' : 'ASC';

      $comment = new Comments($this->db);

    return $response->withJson($comment->getComments($entryID,$order,$limit));
  });

  $app->post('/comment', function($request, $response){

    $data = $request->getParsedBody();
    if(isset($data['content'])){

      $comment = new Comments($this->db);
      return $response->withJson($comment->addComment($data));

    }else{
        return $response->withStatus(400);
    }

  })->add($auth);

  $app->put('/comment/{id}', function($request, $response, $args){
    if(isset($data['content']) && isset($args['id'])) {
      $data = $request->getParsedBody();
      $commentID = $args['id'];
      $comment = new Comments($this->db);
  
      return $response->withJson($comment->editComment($data, $commentID));
    }else {
      return $response->withStatus(400);
    }
  })->add($auth);

  $app->delete('/comment/{id}', function($request, $response, $args){

    $commentID = $args['id'];
    $comment = new Comments($this->db);

    return $response->withJson($comment->deleteComment($commentID));
  })->add($auth);

};
