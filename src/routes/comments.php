<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Hämta alla kommentarer för ett inlägg
  $app->get('/comments/{entryID}', function($request, $response, $args){
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

  // Hämta en kommentar
  $app->get('/comment/{id}', function($request, $response, $args){
    $id = $args['id'];
    $comment = new Comments($this->db);
    return $response->withJson($comment->getComment($id));
  });

  // Skapa kommentar
  $app->post('/comment', function($request, $response){
    $data = $request->getParsedBody();
    if(isset($data['content'])){
      $comment = new Comments($this->db);
      return $response->withJson($comment->addComment($data));
    }else{
        return $response->withStatus(400);
    }
  })->add($auth);

  // Redigera kommentar
  $app->put('/comment/{id}', function($request, $response, $args){
    $data = $request->getParsedBody();
    if(isset($data['content']) && isset($args['id'])) {
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
