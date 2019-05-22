<?php

return function ($app) {
  // Add a basic template route
  $app->get('/', function ($request, $response, $args) {
    // Render index view
    return $this->renderer->render($response, 'index.phtml', [
      'title' => 'Journal'
    ]);
  });
};
