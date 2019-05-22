<?php

class Entry extends Mapper {
  // Hämta inlägg
  public function getEntries($user,$order,$limit) {   
    $s = $this->db->prepare("SELECT * FROM entries $user ORDER BY createdAt $order $limit");
    $s->execute();
    return $s->fetchAll(PDO::FETCH_ASSOC);
  }
  
  // Skapa nytt inlägg
  public function newEntry($userid,$title,$content) {
    $s = $this->db->prepare('INSERT INTO entries (userID, title, content, createdAt) VALUES (?, ?, ?, NOW())');
    $s->execute([$userid,$title,$content]);
    return array(
      "userID"=>$userid,
      "title"=>$title,
      "content"=>$content,
      "action"=>'new entry',
      "success"=>true
    );
  }
  
  // Ta bort inlägg
  public function delEntry($userid,$id) {
    $s = $this->db->prepare('DELETE FROM entries WHERE entryID=? AND userID=?');
    $s->execute([$id,$userid]);
    return array(
      "id"=>$id,
      "action"=>'delete entry',
      "success"=>true
    );
  }

  //20 inläggen som ska visas på
public function indexEntry(){
  $s = $this->db->prepare('SELECT * FROM entries ORDER BY createdAt DESC limit 20');
  $s->execute();
  return $s->fetchAll(PDO::FETCH_ASSOC);
}


//addcomment
public function addComment($comment){

  $s = $this->db->prepare('INSERT INTO comments (entryID, content, createdBy, createdAt) VALUES (:entryID, :content, :createdBy, NOW())');
  $s->execute([
    ':entryID' => $comment['entryID'],    
    ':content' => $comment['content'],    
    ':createdBy' => $comment['createdBy']    
  ]);
  
}

}

