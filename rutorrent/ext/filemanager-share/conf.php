<?php
// duration & links limits
// 0 = unlimited

$share_limits = [
    // max expire time for a share in hours
    'duration' => (int)($_ENV['RU_FLM_SHARE_MAX_DURATION'] ?? 1), // 0 - unlimited
    // max links per user
    'links' => (int)($_ENV['RU_FLM_SHARE_MAX_LINKS'] ?? 0), // 0 - unlimited
];

$shareKey = $_ENV['RU_FLM_SHARE_KEY'] ?? '';
if ($shareKey === '') {
    $profile = $_ENV['RU_PROFILE_PATH'] ?? $_SERVER['RU_PROFILE_PATH'] ?? '';
    if ($profile !== '') {
        $keyFile = rtrim($profile, '/') . '/settings/share.key';
        if (is_readable($keyFile)) {
            $shareKey = trim((string) file_get_contents($keyFile));
        }
    }
}

return [
    'limits' => $share_limits,

    // whether a password is mandatory for link creation
    'require_password' => false,

    // url with the path where a symlink to share.php can be found
    // example: http://mydomain.com/share.php
    // 'endpoint' = '//'.$_SERVER['HTTP_HOST'].'/rutorrent/plugins/filemanager-share/share.php',
    // relative url example
    // 'endpoint' = './plugins/filemanager-share/share.php',
    'endpoint' => $_ENV['RU_FLM_SHARE_ENDPOINT'] ?? '',

    // key used for storing encrypted data (generated per user in settings/share.key)
    "key" => $shareKey,

    // automatically remove shares - only when removing the file or the containing directory
    "remove_share_on_file_delete" => false,

    // automatically remove expired shares - called only when removing
    "purge_expired_shares" => true
];
