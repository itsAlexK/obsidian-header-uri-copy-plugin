import { Plugin, Notice, TFile, HeadingCache } from "obsidian";

const illegalHeadingCharsRegex = /[!"#$%&()*+,.:;<=>?@^`{|}~\/\[\]\\]/g;
function sanitizeHeading(heading: string) {
	return heading
		.replace(illegalHeadingCharsRegex, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export default class HeaderUriPlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor((element, context) => {
			const headers = element.findAll("h2");

			for (let header of headers) {
				const icon = createSpan({
					cls: "copy-to-clipboard-icon",
					text: "\xa0📋",
				});
				icon.toggleClass("show-on-hover", false);
				var textToCopy = header.innerText.trim();
				var activeFile = this.app.workspace.getActiveFile();

				icon.onclick = (event) => {
					if (textToCopy && activeFile !== null) {
						event.stopPropagation();
						this.handleHeading(activeFile, textToCopy);
						new Notice(`Copied '${textToCopy}' to clipboard!`);
					}
				};
				header.appendChild(icon);
			}
		});
	}

	handleHeading(file: TFile, header: string) {
		const vault = this.app.vault.getName();
		const filePath = file.basename;
		const cleansedHeading = sanitizeHeading(header);

		const url = `obsidian://advanced-uri?vault=${vault}&filepath=${filePath}&heading=${cleansedHeading}`;
		navigator.clipboard.writeText(encodeURI(url));
	}
}
