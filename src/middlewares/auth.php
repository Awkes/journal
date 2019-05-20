<?php

return function ($request, $response, $next) {
  if (isset($_SESSION['loggedIn']) && $_SESSION['loggedIn'] == true) {
    return $next($request, $response);
  } else {
    return $response->withStatus(401);
  }
};
