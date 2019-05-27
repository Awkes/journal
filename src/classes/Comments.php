<?php

class Comments extends Mapper{
  public function getComments($entryID, $order, $limit){
    $s = $this->db->prepare("
        SELECT comments.*, users.username FROM comments
        JOIN users ON users.userID = comments.createdBy
        WHERE entryID = :entryID ORDER BY createdAt {$order} {$limit}
    ");
    $s->execute([
        ':entryID' => $entryID,
    ]); 
    return $s->fetchAll(PDO::FETCH_ASSOC);
  }

  public function addComment($comment){
    $s = $this->db->prepare('INSERT INTO comments (entryID, content, createdBy, createdAt) VALUES (:entryID, :content, :createdBy, NOW())');
    if(strlen($comment['content']) > 0 && strlen($comment['content']) <= 250){
      $success = $s->execute([
        ':entryID' => $comment['entryID'],    
        ':content' => $comment['content'],    
        ':createdBy' => $_SESSION['userID']
      ]);
      return array(
        "userID"=>$_SESSION['userID'],
        "title"=>$title,
        "content"=>$content,
        "action"=>'new comment',
        "success"=>$success
      );
    }
    else {
      return array(
        "success" => false,
        "message" => 'Kommentaren måste vara mellan 1-250 tecken!'
      );
    }
  }

  public function editComment($data, $commentID){
    $s = $this->db->prepare('UPDATE comments SET content = :content , createdAt = NOW() WHERE commentID = :commentID AND createdBy = :createdBy');
    $s->bindParam(':content', $data['content'], PDO::PARAM_STR);
    $s->bindParam(':commentID', $commentID, PDO::PARAM_INT);
    $s->bindParam(':createdBy', $_SESSION['userID'], PDO::PARAM_INT);
    $s->execute();
  }
  
  public function deleteComment($commentID){
    $s = $this->db->prepare('DELETE FROM comments WHERE commentID = :commentID AND createdBy = :createdBy');
    $s->execute([
        ':commentID' => $commentID,
        ':createdBy' => $_SESSION['userID']
    ]);
  }
}

?>