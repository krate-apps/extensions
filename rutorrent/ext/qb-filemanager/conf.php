<?php

$fm['tempdir'] = '/tmp';
$fm['mkdperm'] = 755;

// Only register archive tools that exist on the host (manifest: unrar, p7zip-full, zip, tar).
$krateArchiveBins = [
	'rar' => '/usr/bin/rar',
	'unrar' => '/usr/bin/unrar',
	'zip' => '/usr/bin/zip',
	'unzip' => '/usr/bin/unzip',
	'tar' => '/bin/tar',
];
foreach ($krateArchiveBins as $name => $path) {
	if (is_executable($path)) {
		$pathToExternals[$name] = $path;
	}
}
// Extraction uses the "rar" external; unrar-only hosts can still unpack RAR archives.
if (!isset($pathToExternals['rar']) && isset($pathToExternals['unrar'])) {
	$pathToExternals['rar'] = $pathToExternals['unrar'];
}

$fm['archive']['types'] = [];
if (isset($pathToExternals['rar']) && is_executable('/usr/bin/rar')) {
	$fm['archive']['types'][] = 'rar';
}
foreach (['zip', 'tar', 'gzip', 'bzip2'] as $type) {
	$fm['archive']['types'][] = $type;
}

$fm['archive']['compress'][0] = range(0, 5);
$fm['archive']['compress'][1] = ['-0', '-1', '-9'];
$fm['archive']['compress'][2] = $fm['archive']['compress'][3] = $fm['archive']['compress'][4] = [0];
