import BaseImageTool from '@editorjs/image';
import Uploader from './editorjs-uploader';

const tunes = [
	{
		name: 'configure',
		icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m7.646 18.333-.313-2.625q-.208-.125-.458-.27-.25-.146-.458-.271l-2.438 1.021-2.354-4.063 2.083-1.583V9.458L1.625 7.875l2.354-4.063 2.438 1.021q.208-.125.458-.27.25-.146.458-.271l.313-2.625h4.708l.313 2.625q.208.125.458.271.25.145.458.27l2.438-1.021 2.354 4.063-2.063 1.583v1.084l2.063 1.583-2.354 4.063-2.438-1.021q-.208.125-.458.271-.25.145-.458.27l-.313 2.625ZM10 12.979q1.229 0 2.104-.875T12.979 10q0-1.229-.875-2.104T10 7.021q-1.229 0-2.104.875T7.021 10q0 1.229.875 2.104t2.104.875Zm0-1.75q-.5 0-.865-.364-.364-.365-.364-.865t.364-.865q.365-.364.865-.364t.865.364q.364.365.364.865t-.364.865q-.365.364-.865.364ZM10.021 10Zm-.854 6.583h1.666l.25-2.166q.605-.167 1.167-.5.562-.334 1.021-.792l2.021.854.833-1.375-1.771-1.354q.104-.292.146-.604.042-.313.042-.646 0-.292-.042-.594t-.125-.635l1.771-1.375-.834-1.375-2.02.875q-.48-.479-1.032-.802-.552-.323-1.156-.49l-.271-2.187H9.167l-.271 2.187q-.604.167-1.156.49-.552.323-1.011.781l-2.021-.854-.833 1.375 1.75 1.354q-.083.333-.125.646-.042.312-.042.604t.042.594q.042.302.125.635l-1.75 1.375.833 1.375 2.021-.854q.459.458 1.011.781.552.323 1.156.49Z"/></svg>`,
		isToggle: false,
	},
];

/**
 * Patch allows custom uploader.
 * https://github.com/editor-js/image/blob/master/src/index.js
 */
export class ImageTool extends BaseImageTool {
	constructor(params: any) {
		super(params);

		// hide unused caption element
		this.ui.nodes.caption.hidden = true;

		this.uploader = new Uploader({
			config: this.config,
			onUpload: (response: any) => this.onUpload(response),
			onError: (error: any) => this.uploadingFailed(error),
			dispatchChange: params.block.dispatchChange,
		});
	}

	set data(data) {
		this.image = data.file;

		this._data.caption = data.caption || '';
		this.ui.fillCaption(this._data.caption);
	}

	/**
	 * Return Tool data
	 *
	 * @private
	 *
	 * @returns {ImageToolData}
	 */
	get data() {
		return this._data;
	}

	set image(file: { url?: any }) {
		this._data.file = file || {};

		if (file && file.url) {
			// Remove image element if already added to editor (happens when image gets edited)
			if (this.ui.nodes.imageEl) {
				this.ui.nodes.imageEl.remove();
			}
			const imageUrl = this.config.uploader.getImagePreviewUrl(file.url);
			this.ui.fillImage(imageUrl);
		}
	}

	// overwrite paste actions (copy/paste, drag&drop) that files can only be chosen in the file chooser of directus
	static get pasteConfig() {
		return {};
	}

	renderSettings() {
		const wrapper = document.createElement('div');

		tunes.forEach((tune) => {
			let button = document.createElement('div');

			button.classList.add('cdx-settings-button');
			button.innerHTML = tune.icon;
			button.addEventListener('click', () => {
				this._toggleTune(tune.name);
				if (tune.isToggle) {
					button.classList.toggle('cdx-settings-button--active');
				}
			});
			wrapper.appendChild(button);
		});

		return wrapper;
	}

	/**
	 * @private
	 * Click on the Settings Button
	 * @param {string} tune — tune name from this.settings
	 */
	_toggleTune(tune) {
		if (tune === 'configure') {
			const currentFile = this.data?.file;
			if (currentFile) {
				// Pass copy of current file to not overwrite its data before save
				this.config.uploader.onImageEdit({ ...currentFile });
				// onSelectFile calls uploadSelectedFile internally which opens image drawer and prepares callback functions
				this.ui.onSelectFile();
			}
		}
	}
}
