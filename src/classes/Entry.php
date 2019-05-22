<?php

class Entry extends Mapper {
  // Hämta inlägg
  public function getEntries($user,$order,$limit) {   
    $s = $this->db->prepare("SELECT * FROM entries $user ORDER BY createdAt $order $limit");
    $s->execute();
    return $s->fetchAll(PDO::FETCH_ASSOC);
  }
  
  // Skapa nytt inlägg
  public function newEntry($title,$content) {
    $s = $this->db->prepare('INSERT INTO entries (createdBy, title, content, createdAt) VALUES (?, ?, ?, NOW())');
    $success = $s->execute([$_SESSION['userID'],$title,$content]);
    return array(
      "userID"=>$_SESSION['userID'],
      "title"=>$title,
      "content"=>$content,
      "action"=>'new entry',
      "success"=>$success
    );
  }
  
  // Uppdatera inlägg
  public function updEntry($id,$title,$content) {
    $s = $this->db->prepare('UPDATE entries SET title=?, content=? WHERE entryID=? AND createdBy=?');
    $success = $s->execute([$title,$content,$id,$_SESSION['userID']]);
    return array(
      "userID"=>$_SESSION['userID'],
      "title"=>$title,
      "content"=>$content,
      "action"=>'update entry',
      "success"=>$success
    );
  }
  
  // Ta bort inlägg
  public function delEntry($id) {
    $s = $this->db->prepare('DELETE FROM entries WHERE entryID=? AND createdBy=?');
    $success = $s->execute([$id,$_SESSION['userID']]);
    return array(
      "id"=>$id,
      "action"=>'delete entry',
      "success"=>$success
    );
  }
}
