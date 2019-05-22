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
    $s = $this->db->prepare('INSERT INTO entries (userID, title, content, createdAt) VALUES (?, ?, ?, NOW())');
    $s->execute([$_SESSION['userID'],$title,$content]);
    return array(
      "userID"=>$_SESSION['userID'],
      "title"=>$title,
      "content"=>$content,
      "action"=>'new entry',
      "success"=>true
    );
  }
  
  // Uppdatera inlägg
  public function updEntry($id,$title,$content) {
    $s = $this->db->prepare('UPDATE entries SET title=?, content=? WHERE entryID=? AND userID=?');
    $s->execute([$title,$content,$id,$_SESSION['userID']]);
    return array(
      "userID"=>$_SESSION['userID'],
      "title"=>$title,
      "content"=>$content,
      "action"=>'update entry',
      "success"=>true
    );
  }
  
  // Ta bort inlägg
  public function delEntry($id) {
    $s = $this->db->prepare('DELETE FROM entries WHERE entryID=? AND userID=?');
    $s->execute([$id,$_SESSION['userID']]);
    return array(
      "id"=>$id,
      "action"=>'delete entry',
      "success"=>true
    );
  }
}
