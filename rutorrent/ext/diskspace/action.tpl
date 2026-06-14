<?php

require_once dirname(__FILE__) . '/../../php/util.php';

/*
|--------------------------------------------------------------------------
| Quota configuration
|--------------------------------------------------------------------------
|
| zenfw quota::* uses Debian quota utilities on the root mount.
| Requires: APT package "quota", sudoers allowing www-data to run repquota -u /.
|
*/

const KRATE_QUOTA_MOUNT = '/';

const KRATE_REPQUOTA = '/usr/sbin/repquota';

/**
 * Read user quota usage from repquota.
 *
 * Returns:
 *   [
 *      'total' => int bytes,
 *      'free'  => int bytes,
 *   ]
 *
 * Or null if unavailable / user not found / quotas disabled.
 */
function krate_rutorrent_quota_bytes(string $mount, string $username): ?array
{
    if (
        $username === '' ||
        !is_executable(KRATE_REPQUOTA)
    ) {
        return null;
    }

    $output = @shell_exec(
        '/usr/bin/sudo ' .
        KRATE_REPQUOTA .
        ' -u ' .
        escapeshellarg($mount) .
        ' 2>/dev/null'
    );

    if ($output === null || $output === '') {
        return null;
    }

    foreach (preg_split('/\r?\n/', $output) as $line) {
        $line = trim($line);

        if ($line === '') {
            continue;
        }

        $parts = preg_split('/\s+/', $line);

        if (
            !isset($parts[0], $parts[2], $parts[3]) ||
            $parts[0] !== $username
        ) {
            continue;
        }

        $usedKb = (int) $parts[2];
        $hardKb = (int) $parts[3];

        if ($hardKb <= 0) {
            return null;
        }

        return [
            'total' => $hardKb * 1024,
            'free'  => max(0, ($hardKb - $usedKb) * 1024),
        ];
    }

    return null;
}

/*
|--------------------------------------------------------------------------
| Default filesystem stats
|--------------------------------------------------------------------------
*/

$total = disk_total_space($topDirectory);
$free  = disk_free_space($topDirectory);

/*
|--------------------------------------------------------------------------
| Override with quota values if available
|--------------------------------------------------------------------------
*/

if (isset($quotaUser) && $quotaUser !== '') {
    $quota = krate_rutorrent_quota_bytes(
        KRATE_QUOTA_MOUNT,
        $quotaUser
    );

    if ($quota !== null) {
        $total = $quota['total'];
        $free  = $quota['free'];
    }
}

/*
|--------------------------------------------------------------------------
| JSON response
|--------------------------------------------------------------------------
*/

cachedEcho(
    json_encode([
        'total' => $total,
        'free'  => $free,
    ]),
    'application/json'
);
