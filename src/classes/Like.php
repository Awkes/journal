<?php

class Like extends Mapper {
  // Räkna likes
  public function cntLikes($id) {   
    $s = $this->db->prepare("SELECT COUNT(*) AS likes FROM likes WHERE entryID = ?");
    $s->execute([$id]);
    return $s->fetch(PDO::FETCH_ASSOC);
  }

  // Kontrollera om användare redan like:at en entry
  private function checkLike($id) {
    $s = $this->db->prepare("SELECT * FROM likes WHERE entryID=? AND userID=?");
    $s->execute([$id,$_SESSION['userID']]);
    return $s->fetch(PDO::FETCH_ASSOC);
  }

  // Ny like
  public function newLike($id) {
    $success = false;
    if (!$this->checkLike($id)) {
      $s = $this->db->prepare("INSERT INTO likes (entryID, userID) VALUES (?, ?)");
      $success = $s->execute([$id,$_SESSION['userID']]);
    }
    return array(
      'entryID'=>$id,
      'action'=>'like',
      'success'=>$success
    );
  }
  
  // Ta bort like
  public function delLike($id) {
    $success = false;
    if ($this->checkLike($id)) {
      $s = $this->db->prepare("DELETE FROM likes WHERE entryID=? AND userID=?");
      $success = $s->execute([$id,$_SESSION['userID']]);
    }
    return array(
      'entryID'=>$id,
      'action'=>'dislike',
      'success'=>$success
    );
  }
}
