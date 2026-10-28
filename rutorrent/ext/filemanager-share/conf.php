<?php
// duration & links limits
// 0 = unlimited

// max expire time for a share in hours
$conf['duration'] = $_ENV['RU_FLM_SHARE_MAX_DURATION'] ?? 1; // 0 - unlimited

// max links per user
$conf['links'] = $_ENV['RU_FLM_SHARE_MAX_LINKS'] ?? 0; // 0 - unlimited

// Krate: per-user key at /var/lib/krate/rutorrent/<user>/settings/share.key
$krateShareKey = '';
$krateRuUser = $_SERVER['REMOTE_USER']
	?? $_ENV['REMOTE_USER']
	?? $_SERVER['REDIRECT_REMOTE_USER']
	?? $_SERVER['PHP_AUTH_USER']
	?? $_ENV['PHP_AUTH_USER']
	?? '';
$krateProfilePath = $_SERVER['RU_PROFILE_PATH'] ?? $_ENV['RU_PROFILE_PATH'] ?? '';
if ($krateRuUser === '' && $krateProfilePath !== ''
	&& preg_match('#/rutorrent/([a-z_][a-z0-9_-]*)/?$#i', $krateProfilePath, $krateM)) {
	$krateRuUser = $krateM[1];
}
$krateShareKeyPath = '';
if ($krateProfilePath !== '') {
	$krateShareKeyPath = rtrim($krateProfilePath, '/') . '/settings/share.key';
} elseif ($krateRuUser !== '' && preg_match('/^[a-z_][a-z0-9_-]*$/i', $krateRuUser)) {
	$krateShareKeyPath = '/var/lib/krate/rutorrent/' . strtolower($krateRuUser) . '/settings/share.key';
}
if ($krateShareKeyPath !== '' && is_readable($krateShareKeyPath)) {
	$krateShareKey = trim((string) file_get_contents($krateShareKeyPath));
}

return [
    'limits' => $conf,

    // whether a password is mandatory for link creation
    'require_password' => false,

    // url with the path where a symlink to share.php can be found
    // example: http://mydomain.com/share.php
    // 'endpoint' = '//'.$_SERVER['HTTP_HOST'].'/rutorrent/plugins/filemanager-share/share.php',
    // relative url example
    // 'endpoint' = './plugins/filemanager-share/share.php',
    'endpoint' => $_ENV['RU_FLM_SHARE_ENDPOINT'] ?? '',

    // key used for storing encrypted data
    "key" => $_ENV['RU_FLM_SHARE_KEY'] ?? $krateShareKey,

    // automatically remove shares - only when removing the file or the containing directory
    "remove_share_on_file_delete" => false,

    // automatically remove expired shares - called only when removing
    "purge_expired_shares" => true
];
