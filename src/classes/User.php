<?php

class User extends Mapper {
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
  private function checkUser($user) {
    $statement = $this->db->prepare('SELECT username FROM users WHERE username=?');
    $statement->execute([$user]);
    $result = $statement->fetch(PDO::FETCH_ASSOC);
    return isset($result['username']) ? true : false;
  }
  
  // Skapa ny användare
  public function newUser($user,$pass) {
    // Om användarnamn och lösenord är mindre än 4 tecken, returnera fel
    if (strlen($user) < 4 || strlen($pass) < 4) {
      return array(
        "user"=>$user,
        "success"=>false,
        "message"=>'Användarnamn och lösenord måste vara minst 4 tecken.'
      );
    }
    // Kontrollera om användare redan existerar, isåfall returnera fel.
    elseif ($this->checkUser($user)) {
      return array(
        "user"=>$user,
        "success"=>false,
        "message"=>"Användaren $user existerar redan, försök med ett annat användarnamn."
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