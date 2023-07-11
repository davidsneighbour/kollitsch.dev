// @see https://github.com/natemoo-re/clack/tree/main/packages/prompts
import {
	intro,
	outro,
	select,
	spinner,
	isCancel,
	cancel,
	text,
	multiselect
} from '@clack/prompts';
import { exec as exec } from 'node:child_process';
import fs from 'node:fs';

async function main() {

	const date = new Date();
	const year = date.getFullYear();
	const spin = spinner();
	let command;
	let command2;
	let title;
	let slug, slug_pre;
	let post;

	intro('Release:');

	const selectedSteps = await multiselect({
		message: 'Select the release steps:',
		options: [
			{ value: 'update', label: 'Update' },
			{ value: 'release', label: 'Release' },
			{ value: 'lint', label: 'Lint' },
			{ value: 'deploy', label: 'Deploy' },
			{ value: 'notify', label: 'Notify' },
		],
		required: false,
		initialValues: ['update', 'release', 'deploy']
	});

	if (selectedSteps.includes('notify')) {
		const selectedNetworks = await multiselect({
			message: 'Select the networks to notify:',
			options: [
				{ value: 'reddit', label: 'Reddit' },
				{ value: 'discord', label: 'Discord' },
				{ value: 'linkedin', label: 'LinkedIn' },
				{ value: 'mastodon', label: 'Mastodon' },
			],
			required: false,
			initialValues: ['reddit', 'discord', 'mastodon']
		});
	}

	if (isCancel(selectedSteps)) {
		cancel('Operation cancelled');
		return process.exit(0);
	};

	selectedSteps.forEach((element) => {

		switch (element) {

			case 'update':
				break;

			case 'release':
				break;

			case 'lint':
				break;

			case 'deploy':
				break;

			case 'notify':

				break;

			default:
				console.error('something weird happened');
				break;

		}
		// @todo check if content file already exists and fail gracefully
		// spin.start('Creating content files...');

		// await /** @type {Promise<void>} */(new Promise((resolve, _reject) => {
		// 	exec(command, function (
		// 		error,
		// 		_stdout,
		// 		stderr
		// 	) {
		// 		if (error) {
		// 			console.log(error);
		// 			cancel(`An error occured: ${error}`);
		// 			process.exit(0);
		// 		}
		// 		if (stderr) {
		// 			console.log(stderr);
		// 			cancel(`An error occured: ${stderr}`);
		// 			process.exit(0);
		// 		}
		// 		resolve();
		// 	});
		// }));
		// spin.stop('Content created. Opening in VS Code...');

	});

	outro('All done :]');
	process.exit(0);

}

main().catch(console.error);
