<?php

class Like extends Mapper {
  // Räkna likes
  public function cntLikes($id) {   
    $s = $this->db->prepare("SELECT COUNT(*) AS likes FROM likes WHERE entryID = ?");
    $s->execute([$id]);
    return $s->fetch(PDO::FETCH_ASSOC);
  }

  // Kontrollera om användare redan gillar en entry
  private function checkLike($id) {
    $s = $this->db->prepare("SELECT * FROM likes WHERE entryID=? AND userID=?");
    $s->execute([$id,$_SESSION['userID']]);
    return $s->fetch(PDO::FETCH_ASSOC);
  }

  // Gilla / Ogilla
  public function likeDislike($id) {
    $action = 'like';
    if (!$this->checkLike($id)) {
      $s = $this->db->prepare("INSERT INTO likes (entryID, userID) VALUES (?, ?)");
    }
    else {
      $s = $this->db->prepare("DELETE FROM likes WHERE entryID=? AND userID=?");
      $action = 'dislike';
    }
    $success = $s->execute([$id,$_SESSION['userID']]);
    return array(
      'entryID'=>$id,
      'action'=>$action,
      'success'=>$success
    );
  }
}
