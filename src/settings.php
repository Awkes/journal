<?php

return [
  'settings' => [
    'displayErrorDetails' => true, // set to false in production
    'addContentLengthHeader' => false, // Allow the web server to send the content-length header

    // Renderer settings
    'renderer' => [
      'template_path' => __DIR__ . '/views/',
    ],

    // Database settings
    'db' => [
      /* 'host' => '127.0.0.1', */
      'host' => 'localhost:8889',
      'user' => 'root',
      /* 'pass' => '', */
      'pass' => 'root',
      'dbname' => 'journal'
    ]
  ],
];
