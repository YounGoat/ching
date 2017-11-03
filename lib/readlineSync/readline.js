process.on('SIGINT', function () {
	process.exit(1);
});

process.stdin.on('data', function (buf) {
	process.stdout.write(buf);
	process.exit(0);
});
