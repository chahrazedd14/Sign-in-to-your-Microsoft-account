<?php
use League\OAuth2\Client\Provider\GenericProvider;
use Microsoft\Graph\Graph;
use Microsoft\Graph\Model;

require_once __DIR__ . '/vendor/autoload.php';
//Display name
const APP_SESS_ID = 'Display name';
// Application (client) ID
const OAUTH_APP_ID = 'Application (client) ID';
// Object ID
const OAUTH_APP_SECRET = 'Object ID';

const OAUTH_REDIRECT_URI = 'http://localhost/appMilene/App-Front/Views/indexuploade.php';
const OAUTH_LOGOUT = "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=".OAUTH_REDIRECT_URI;
const OAUTH_SCOPES = 'openid profile offline_access user.read';
// Directory (tenant) ID
const OAUTH_AUTHORITY = 'https://login.microsoftonline.com/';
const OAUTH_AUTHORIZE_ENDPOINT = '/oauth2/v2.0/authorize';
const OAUTH_TOKEN_ENDPOINT = '/oauth2/v2.0/token';

session_name(APP_SESS_ID);
session_start();


if (isset($_GET["logout"])) {
    unset($_SESSION["user"]); 
    session_destroy();
    session_unset();
    header("Location: login.php");
}

if (isset($_GET["code"])) {
    $code = $_GET["code"];
    $oAuthClient = new GenericProvider([
        'clientId' => OAUTH_APP_ID,
        
//Client secrets (VALUE)
        'clientSecret' => "Client secrets (VALUE)",
        'redirectUri' => OAUTH_REDIRECT_URI,
        'urlAuthorize' => OAUTH_AUTHORITY . OAUTH_AUTHORIZE_ENDPOINT,
        'urlAccessToken' => OAUTH_AUTHORITY . OAUTH_TOKEN_ENDPOINT,
        'urlResourceOwnerDetails' => '',
        'scopes' => OAUTH_SCOPES,
    ]);

    $accessToken = null;
    try {
        // Make the token request
        $accessToken = $oAuthClient->getAccessToken('authorization_code', [
            'code' => $code,
        ]);
    } catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {
/*
        echo $e->getMessage();
        var_dump($e);*/
        //('Location: ' . $host . '/?type=error&message=' . urlencode($e->getMessage()));
    }
    $user = [];
    if (null !== $accessToken) {
        $graph = new Graph();
        $graph->setAccessToken($accessToken->getToken());
        try {
            $azureUser = $graph->createRequest('GET', '/me?$select=displayName,mail,userPrincipalName')
                ->setReturnType(Model\User::class)
                ->execute();


        } catch (Exception $exception) {
            //header('Location: ' . $host . '/?type=error&message=' . urlencode('Unable to get user details: ' . $exception->getMessage()));
        }

        $user = [
            'name' => $azureUser->getDisplayName(),
            'email' => $azureUser->getMail(),
        ];
        $_SESSION['user'] = serialize($user);
    }
}

$name = "Unknown";
if (isset($_SESSION['user'])) {
    $user = unserialize($_SESSION['user']);
    $name = $user["name"];
}


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title> login with ad azure </title>
    <!-- Box Icon  -->
    <link rel="shortcut icon" type="image/png" href="..\medias\favicon.PNG"/>
    <link rel="stylesheet" href="../css/style2.css">
    <link rel="stylesheet" href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css">
  
    <!-- Table Link End Here -->


</head>


<body>

<div class="header">
    <div class="header__burger"><i class='bx bxl-c-plus-plus icon'></i></div>
    <div class="header__logo"><img src="" alt="">
    </div>
    <div class="header__userbar">

        <!-- Notification Area Start -->
        <header>
            <div class="wrapper">
                <div class="notification" id="btn-notification">
                    <i class="fa fa-bell"></i>
                    <div class="notify-count count1 common-count" id="notify-count">
                        0
                    </div>
                    <div class="notification-dropdown" id="notification-dropdown">
                        <div class="items" id="notification-items">
                        </div>
                    </div>
                </div>

            </div>
        </header>
        <!-- Notification Area End -->
        <div class="header__name"><?php echo $name; ?></div>
        <div class="header_dropdown_menu">
            <div class="dropdown">
                <button type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                    <i class="fa fa-angle-down"></i>
                </button>
                <div id="user-option" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="?logout=1"><i class="fa fa-sign-out" aria-hidden="true"></i>
                        Déconnection
                    </a>
                </div>
            </div>
        </div>

    </div>
</div>
<!-- Side Navbar Start Here -->

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>

</body>

</html>