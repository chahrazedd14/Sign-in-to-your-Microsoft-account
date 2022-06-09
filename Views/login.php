<?php
declare (strict_types=1);

use League\OAuth2\Client\Provider\GenericProvider;
use Microsoft\Graph\Graph;
use Microsoft\Graph\Model;

const APP_SESS_ID = "MMVConvert";

const OAUTH_APP_ID = 'bb305635-780e-4fd6-a67c-85c68b8fbd13';
const OAUTH_APP_SECRET = '19cc192b-73e5-42bc-bbfb-1eea15f154d9';

const OAUTH_REDIRECT_URI = 'http://localhost/appMilene/App-Front/Views/indexuploade.php';
const OAUTH_SCOPES = 'openid profile offline_access user.read';
const OAUTH_AUTHORITY = 'https://login.microsoftonline.com/2ae77e8b-d7b3-4d51-8130-f9c216107799';
const OAUTH_AUTHORIZE_ENDPOINT = '/oauth2/v2.0/authorize';
const OAUTH_TOKEN_ENDPOINT = '/oauth2/v2.0/token';

$title = 'Hello public world!';

require_once __DIR__ . '/vendor/autoload.php';

//
// THIS IS A PROOF OF CONCEPT! DO NOT USE IN PRODUCTION!!!
//

$https = false;
if (isset($_SERVER['HTTPS'])) {
    $https = true;
} elseif (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && 'https' === $_SERVER['HTTP_X_FORWARDED_PROTO']) {
    $https = true;
}

// Get the root op the application
$host = sprintf('%s://%s', ($https ? 'https' : 'http'), $_SERVER['HTTP_HOST']);

// Simple PHP routing
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestPath = rtrim($path, '/');

if (isset($_GET['q'])) {

    $requestPath = $_GET['q'];
}

$user = null;

// If we run buit-in PHP web server, we want static files to be served directly
if ('cli-server' === php_sapi_name()) {
    $staticExtensions = ['jpg', 'jpeg', 'gif', 'png', 'ico', 'js', 'css'];
    $currentExtension = pathinfo($path, PATHINFO_EXTENSION);
    if (in_array($currentExtension, $staticExtensions)) {
        return false;
    }
}

session_name(APP_SESS_ID);
session_start();

// Checking for user
$user = [];
if (isset($_SESSION['user'])) {
    $user = unserialize($_SESSION['user']);
    $title = 'Hello private world';
}

// Checking for messages
$style = 'success';
$displayMessage = '';
if (isset($_GET['type']) && isset($_GET['message'])) {
    $styles = ['success', 'error'];
    if (in_array($_GET['type'], $styles)) {
        $style = $_GET['type'];
    }
    $displayMessage = $_GET['message'];
}


if (isset($_REQUEST['submit'])) {
    $oAuthClient = new GenericProvider([
        'clientId' => OAUTH_APP_ID,
        'clientSecret' => 'Wxk8Q~NEFqclRZmH2M25~t2p5dxrSGSZeljGhdty',
        'redirectUri' => OAUTH_REDIRECT_URI,
        'urlAuthorize' => OAUTH_AUTHORITY . OAUTH_AUTHORIZE_ENDPOINT,
        'urlAccessToken' => OAUTH_AUTHORITY . OAUTH_TOKEN_ENDPOINT,
        'urlResourceOwnerDetails' => '',
        'scopes' => OAUTH_SCOPES,
    ]);

    $authUrl = $oAuthClient->getAuthorizationUrl();
    $_SESSION['oauthState'] = $oAuthClient->getState();
    header('Location: ' . $authUrl);
}


?>


<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>MMV External Login</title>


    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
  

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
            crossorigin="anonymous"></script>
    <link rel="stylesheet" href="../css/style.css">


</head>

<body class="text-center">


<form class="form-signin" method="POST" action="login.php">
    <span id="logo1"><img src="https://media.resalys.com/mmv_new/images/logommv.png" alt="MMV Logo"></span>
    <!-- <p>Please sign in</p> -->


    <button class="btn btn-lg btn-primary btn-block" type="submit" name="submit" value="1">
        <svg width="22" height="22" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="e399c19f-b68f-429d-b176-18c2117ff73c" x1="-1032.172" x2="-1059.213" y1="145.312"
                                y2="65.426" gradientTransform="matrix(1 0 0 -1 1075 158)"
                                gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#114a8b"></stop>
                    <stop offset="1" stop-color="#0669bc"></stop>
                </linearGradient>
                <linearGradient id="ac2a6fc2-ca48-4327-9a3c-d4dcc3256e15" x1="-1023.725" x2="-1029.98" y1="108.083"
                                y2="105.968" gradientTransform="matrix(1 0 0 -1 1075 158)"
                                gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-opacity=".3"></stop>
                    <stop offset=".071" stop-opacity=".2"></stop>
                    <stop offset=".321" stop-opacity=".1"></stop>
                    <stop offset=".623" stop-opacity=".05"></stop>
                    <stop offset="1" stop-opacity="0"></stop>
                </linearGradient>
                <linearGradient id="a7fee970-a784-4bb1-af8d-63d18e5f7db9" x1="-1027.165" x2="-997.482" y1="147.642"
                                y2="68.561" gradientTransform="matrix(1 0 0 -1 1075 158)"
                                gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#3ccbf4"></stop>
                    <stop offset="1" stop-color="#2892df"></stop>
                </linearGradient>
            </defs>
            <path fill="url(#e399c19f-b68f-429d-b176-18c2117ff73c)"
                  d="M33.338 6.544h26.038l-27.03 80.087a4.152 4.152 0 0 1-3.933 2.824H8.149a4.145 4.145 0 0 1-3.928-5.47L29.404 9.368a4.152 4.152 0 0 1 3.934-2.825z"></path>
            <path fill="#0078d4"
                  d="M71.175 60.261h-41.29a1.911 1.911 0 0 0-1.305 3.309l26.532 24.764a4.171 4.171 0 0 0 2.846 1.121h23.38z"></path>
            <path fill="url(#ac2a6fc2-ca48-4327-9a3c-d4dcc3256e15)"
                  d="M33.338 6.544a4.118 4.118 0 0 0-3.943 2.879L4.252 83.917a4.14 4.14 0 0 0 3.908 5.538h20.787a4.443 4.443 0 0 0 3.41-2.9l5.014-14.777 17.91 16.705a4.237 4.237 0 0 0 2.666.972H81.24L71.024 60.261l-29.781.007L59.47 6.544z"></path>
            <path fill="url(#a7fee970-a784-4bb1-af8d-63d18e5f7db9)"
                  d="M66.595 9.364a4.145 4.145 0 0 0-3.928-2.82H33.648a4.146 4.146 0 0 1 3.928 2.82l25.184 74.62a4.146 4.146 0 0 1-3.928 5.472h29.02a4.146 4.146 0 0 0 3.927-5.472z"></path>
        </svg>
        Log in with Azure AD
    </button>

</form>


<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js"
        integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"
        integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13"
        crossorigin="anonymous"></script>
</body>
</html>
