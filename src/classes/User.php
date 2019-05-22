<?php

class User extends Mapper {
  // public function getUserByID($userID) {
  //   $statement = $this->db->prepare("SELECT * FROM users WHERE userID = :userID");
  //   $statement->execute([
  //     ':userID' => $userID
  //   ]);
  //   return $statement->fetch(PDO::FETCH_ASSOC);
  // }

  // Hämta alla användare
  public function getAllUsers() {
    $statement = $this->db->prepare('SELECT userID, username FROM users');
    $statement->execute();
    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // Hämta enskild användare
  public function getUserByID($userID) {
    $statement = $this->db->prepare('SELECT userID, username FROM users WHERE UserID=?');
    $statement->execute([$userID]);
    return $statement->fetch(PDO::FETCH_ASSOC);
  }

  // Kontrollera om användare existerar
  public function checkUser($user) {
    $statement = $this->db->prepare('SELECT username FROM users WHERE userName=?');
    $statement->execute([$user]);
    $result = $statement->fetch(PDO::FETCH_ASSOC);
    return isset($result['userName']) ? true : false;
  }
  
  // Skapa ny användare
  public function newUser($user,$pass) {
    // Kontrollera om användare redan existerar, isåfall returnera fel.
    if ($this->checkUser($user)) {
      return array(
        "user"=>$user,
        "success"=>false,
        "message"=>'User already exists'
      );
    }
    // Annars skapa användare
    else {
      $s = $this->db->prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      $s->execute([$user,password_hash($pass, PASSWORD_BCRYPT)]);
      return array(
        "user"=>$user,
        "success"=>true
      );
    }
  }

}
