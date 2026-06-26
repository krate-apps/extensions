<?php

$diskUpdateInterval = 10;	// in seconds
$notifySpaceLimit = 512;	// in Mb
$partitionDirectory = null;
$freeBytesInMeter = false;
// Krate: prefer repquota user when quotas are enabled (see action.tpl).
$quotaUser = class_exists('User', false) ? User::getUser() : '';
