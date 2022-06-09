<?php
declare (strict_types = 1);

use Microsoft\Graph\Model;

const APP_SESS_ID = '';

const OAUTH_APP_ID = '';
const OAUTH_APP_SECRET = '';

const OAUTH_REDIRECT_URI = '/appMilene/App-Front/views/callback.php';
const OAUTH_SCOPES = 'openid profile offline_access user.read';
const OAUTH_AUTHORITY = '';
const OAUTH_AUTHORIZE_ENDPOINT = '/oauth2/v2.0/authorize';
const OAUTH_TOKEN_ENDPOINT = '/oauth2/v2.0/token';

$title = 'Hello public world!';

require_once __DIR__ . '/vendor/autoload.php';

session_destroy();
setcookie(APP_SESS_ID, '', time() - 1000);
header('Location: login.php');
