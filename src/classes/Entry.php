<?php

class Entry extends Mapper {
  // Hämta inlägg
  public function getEntries($user,$order,$limit,$search) {   
    $s = $this->db->prepare("
      SELECT entries.*, users.username FROM entries 
      JOIN users ON users.userID = entries.createdBy
      WHERE (title LIKE :search OR content LIKE :search)
      $user
      ORDER BY createdAt $order $limit
    ");
    $s->execute([':search'=>"%$search%"]);
    return $s->fetchAll(PDO::FETCH_ASSOC);
  }

  // Hämta ett inlägg
  public function getEntry($id) {
    $s = $this->db->prepare("
      SELECT entries.*, users.username FROM entries
      JOIN users ON users.userID = entries.createdBy
      WHERE entryID=?
    ");
    $success = $s->execute([$id]);
    return $s->fetch(PDO::FETCH_ASSOC);
  }

  // Skapa nytt inlägg
  public function newEntry($title,$content) {
    if(strlen($title) > 1 && strlen($content) > 1){
      $s = $this->db->prepare('INSERT INTO entries (createdBy, title, content, createdAt) VALUES (?, ?, ?, NOW())');
      $success = $s->execute([$_SESSION['userID'],$title,$content]);
      return array(
        "userID"=>$_SESSION['userID'],
        "title"=>$title,
        "content"=>$content,
        "action"=>'new entry',
        "success"=>$success
      );
    }else {
      return array(
        "succes" => false,
        "message" => 'Tomma input fält'
      );
    }
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

  // Redigera inlägg
  public function editEntry($content) {
    $s = $this->db->prepare('UPDATE entries SET title = :title, content = :content, createdAt = NOW() WHERE entryID = :entryID');
    $s->execute([
      ':title' => $content['title'],
      ':content' => $content['content'],
      ':entryID' => $content['entryID'],
    ]);
    var_dump($content['title']);
  }
}

