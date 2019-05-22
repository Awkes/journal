<?php

class Comments extends Mapper{


    public function getComments($entryID, $order, $limit){

    $s = $this->db->prepare("SELECT * from comments WHERE entryID = :entryID ORDER BY createdAt {$order} {$limit}");
        $s->execute([
            ':entryID' => $entryID,
        ]); 
        return $s->fetchAll(PDO::FETCH_ASSOC);
    }
    public function addComment($comment){
        $s = $this->db->prepare('INSERT INTO comments (entryID, content, createdBy, createdAt) VALUES (:entryID, :content, :createdBy, NOW())');
        $succes = $s->execute([
          ':entryID' => $comment['entryID'],    
          ':content' => $comment['content'],    
          ':createdBy' => $SESSION['userID']    
        ]);
    }   

    public function editComment($data, $commentID){
        $s = $this->db->prepare('UPDATE comments SET content = :content , createdAt = NOW() WHERE commentID = :commentID AND createdBy = :createdBy');
        $s->bindParam(':content', $data['content'], PDO::PARAM_STR);
        $s->bindParam(':commentID', $commentID, PDO::PARAM_INT);
        $s->bindParam(':createdBy', $SESSION['userID'], PDO::PARAM_STR);
        $s->execute();
  }
  
      public function deleteComment($commentID){
        $s = $this->db->prepare('DELETE FROM comments WHERE commentID = :commentID AND createdBy = :createdBy');
        $s->execute([
            ':commentID' => $commentID,
            ':createdBy' => $SESSION['userID']
        ]);
    }

}


?>