// @see https://github.com/natemoo-re/clack/tree/main/packages/prompt
import {
	intro,
	outro,
	select,
	spinner,
	isCancel,
	cancel,
	text,
} from '@clack/prompts';

// @todo trying to find out how this really is supposed to work
import { exec as exec } from 'node:child_process';
import fs from 'node:fs';

async function main() {

	const date = new Date();
	const year = date.getFullYear();
	const spin = spinner();
	let command;
	let command2;
	let title;
	let slug;
	let post;

	intro('Create content:');

	const contentType = await select({
		message: 'Pick a content type.',
		options: [
			{ value: "post", label: "Post" },
			{ value: "component", label: "Component", hint: "Documentation page for a Hugo component" },
			{ value: "m2p2", label: "Music to program to" },
			{ value: "labnotes", label: "Notes from the Lab" },
			{ value: "hugonotes", label: "Hugo Release Notes" },
			{ value: "tag", label: "Tag", hint: "Tag description page" },
			{ value: "quit", label: "Quit" },
		]
	});

	if (isCancel(contentType)) {
		cancel('Operation cancelled');
		return process.exit(0);
	};

	switch (contentType) {

		case 'quit':
			cancel('Operation cancelled');
			return process.exit(0);

		case 'component':
			title = await text({
				message: 'Component Name:',
				validate(value) {
					if (value.length === 0) return `Title is required, doh!`;
				}
			});
			slug = title.replace(/ /g, '-').toLowerCase();
			post = `components/${slug}`;
			command = `hugo new --kind components ${post}`;
			command2 = `code content/${post}/index.md`;
			break;

		case 'm2p2':

			let number;
			let increment;
			const filename = "data/dnb/kollitsch/m2p2.json";

			await new Promise((resolve, _reject) => {
				fs.readFile(filename, 'utf8', function (err, buf) {
					if (err) {
						console.log(err);
						cancel(`An error occured: ${err}`);
						process.exit(0);
					}
					let data = JSON.parse(buf);
					number = data.latest;
					console.log(number);
					increment = number + 1;
					console.log(increment);
					data.latest = increment;
					fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
						if (err) console.log(err);
					});
					resolve();
				});
			});
			post = `blog/${year}/music-to-program-to-` + increment;
			command = `hugo new --kind music2program2 ${post}`;
			command2 = `code content/${post}/index.md`;
			break;

		case 'labnotes':
			title = await text({
				message: 'Month:',
				validate(value) {
					if (value.length === 0) return `Month is required, doh!`;
				}
			});
			slug = title.replace(/ /g, '-').toLowerCase();
			post = `blog/${year}/notes-from-the-laboratory-${slug}`;
			command = `hugo new --kind notes-from-the-laboratory ${post}`;
			command2 = `code content/${post}/index.md`;
			break;

		case 'hugonotes':
			title = await text({
				message: 'Hugo Version:',
				validate(value) {
					if (value.length === 0) return `Version is required, doh!`;
				}
			});
			slug = title.replace(/ /g, '-').toLowerCase();
			post = `blog/${year}/hugo-"${title}"-release-notes`;
			command = `hugo --kind hugo-release-notes blog ${post}`;
			command2 = `code content/${post}/index.md`;
			break;

		case 'tag':
			title = await text({
				message: 'Tag Title:',
				validate(value) {
					if (value.length === 0) return `Title is required, doh!`;
				}
			});
			slug = title.replace(/ /g, '-').toLowerCase();
			post = `tags/${slug}`;
			command = `hugo new ${post}`;
			command2 = `code content/${post}/_index.md`;
			break;

		case 'post':
		default:
			title = await text({
				message: 'Post Title:',
				validate(value) {
					if (value.length === 0) return `Title is required, doh!`;
				}
			});
			slug = title.replace(/ /g, '-').toLowerCase();
			post = `blog/${year}/${slug}`;
			command = `hugo new --kind blog ${post}`;
			command2 = `code content/${post}/index.md`;
			break;

	}

	// @todo check if content file already exists and fail gracefully

	spin.start('Creating content files...');

	await new Promise((resolve, _reject) => {
		exec(command, function (
			error,
			_stdout,
			stderr
		) {
			if (error) {
				console.log(error);
				cancel(`An error occured: ${error}`);
				process.exit(0);
			}
			if (stderr) {
				console.log(stderr);
				cancel(`An error occured: ${stderr}`);
				process.exit(0);
			}
			resolve();
		});
	});

	spin.stop('Content created. Opening in VS Code...');

	await new Promise((resolve, _reject) => {
		exec(command2, function (
			error,
			_stdout,
			stderr
		) {
			if (error) {
				console.log(error);
				cancel(`An error occured: ${error}`);
				process.exit(0);
			}
			if (stderr) {
				console.log(stderr);
				cancel(`An error occured: ${stderr}`);
				process.exit(0);
			}
			resolve();
		});
	});

	outro('All done :)');
	process.exit(1);

}

main().catch(console.error);
