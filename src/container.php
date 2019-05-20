<?php

return function ($app) {
    $container = $app->getContainer();

    // view renderer
    $container['renderer'] = function ($c) {
      $settings = $c->get('settings')['renderer'];
      return new \Slim\Views\PhpRenderer($settings['template_path']);
    };

    // database
    $container['db'] = function ($c) {
      $db = $c['settings']['db'];
      $pdo = new PDO(
        'mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'] . ";charset=utf8",
        $db['user'],
        $db['pass']
      );
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
      // We must always return what we want to inject
      return $pdo;
    };
};
