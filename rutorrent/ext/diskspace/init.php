<?php

eval(FileUtil::getPluginConf($plugin['name']));

if (is_null($partitionDirectory)) {
	if (User::isLocalMode() && rTorrentSettings::get()->linkExist && file_exists(rTorrentSettings::get()->directory)) {
		$partitionDirectory = rTorrentSettings::get()->directory;
	} else {
		$partitionDirectory = &$topDirectory;
	}
}

if (!function_exists('disk_total_space') || !function_exists('disk_free_space') ||
	(disk_total_space($partitionDirectory) === false) || (disk_free_space($partitionDirectory) === false)) {
	$jResult .= 'plugin.disable();';
} else {
	$jResult .= 'plugin.interval = '.$diskUpdateInterval.'; plugin.notifySpaceLimit = '.($notifySpaceLimit * 1024 * 1024).';';
	$jResult .= 'plugin.freeBytesInMeter = '.($freeBytesInMeter ? 1 : 0).';';
	$theSettings->registerPlugin($plugin['name'], $pInfo['perms']);
}
