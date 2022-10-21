const logger = {
	...console,
	success: (...args) => console.log("\x1b[32msuccess\x1b[0m", ...args),
	failure: (...args) => console.error("\x1b[31mfailure\x1b[0m", ...args),
};
