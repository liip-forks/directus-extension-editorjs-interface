import { Ref, ref } from 'vue';
import { AxiosInstance } from 'axios';

export type UploaderHandler = (selectedImage: EditorJsImage) => void;

type UsableImage = {
	imageDrawerOpen: Ref<boolean>;
	selectedImage: Ref<EditorJsImage | null>;
	closeImageDrawer: () => void;
	openImageDrawer: () => void;
	onImageSelect: (image: DirectusFile) => void;
	onImageEdit: (image: EditorJsImage) => void;
	setFileHandler: (handler: UploaderHandler) => void;
	handleFile: (selectedImage: EditorJsImage) => void;
	getImagePreviewUrl: (imageUrl: string) => string;
	getRokkaHash: (imageId: string) => Promise<string>;
};

type DirectusFile = {
	id: string;
	filename_download: string;
	title: string;
	type: string;
	filesize: number;
	width: number;
	height: number;
	description: string;
	rokka_hash: string;
};

export type EditorJsImage = {
	fileId: string;
	name: string;
	title: string;
	description: string;
	type: string;
	size: number;
	width: number;
	height: number;
	displayWidth: number;
	displayHeight: number;
	fileURL: string;
	url: string;
	linkUrl: string;
	rokkaHash: string;
};

export default function useImage(
	api: AxiosInstance,
	addTokenToURL: (url: string, token?: string) => string
): UsableImage {
	const imageDrawerOpen = ref(false);
	const selectedImage = ref<EditorJsImage | null>(null);
	const fileHandler = ref<UploaderHandler | null>(null);
	const apiBaseUrl = api.defaults.baseURL;

	return {
		imageDrawerOpen,
		selectedImage,
		closeImageDrawer,
		openImageDrawer,
		onImageSelect,
		onImageEdit,
		setFileHandler,
		handleFile,
		getImagePreviewUrl,
		getRokkaHash,
	};

	function closeImageDrawer() {
		selectedImage.value = null;
		imageDrawerOpen.value = false;
		unsetFileHandler();
	}

	function openImageDrawer() {
		imageDrawerOpen.value = true;
	}

	/**
	 * When an image is selected
	 */
	function onImageSelect(image: DirectusFile) {
		const editorJsImage = directusFileToEditorJsImage(image);
		selectedImage.value = editorJsImage;
	}

	/**
	 * When an image is edited
	 */
	function onImageEdit(image: EditorJsImage) {
		// Fill new properties for backwards compatibility
		if (!image.displayWidth) {
			image.displayWidth = image.width;
		}
		if (!image.displayHeight) {
			image.displayHeight = image.height;
		}
		selectedImage.value = image;
	}

	async function getRokkaHash(imageId: string) {
		const image = await api.get(`/files/${imageId}?fields=rokka_hash`);
		return image?.data?.data?.rokka_hash;
	}

	function getImagePreviewUrl(imageUrl: string): string {
		return `${addTokenToURL(imageUrl)}&key=system-large-contain`;
	}

	function unsetFileHandler() {
		fileHandler.value = null;
	}

	function setFileHandler(handler: UploaderHandler) {
		fileHandler.value = handler;
	}

	async function handleFile(newSelectedImage: EditorJsImage) {
		if (fileHandler.value) {
			await fileHandler.value(newSelectedImage);
		}

		closeImageDrawer();
	}

	function directusFileToEditorJsImage(file: DirectusFile): EditorJsImage {
		return {
			fileId: file.id,
			name: file.filename_download,
			title: file.title,
			description: file.description,
			type: file.type,
			size: file.filesize,
			width: file.width,
			height: file.height,
			displayWidth: file.width,
			displayHeight: file.height,
			fileURL: getFileUrl(file.id),
			url: getImageUrl(file.id),
			linkUrl: '',
			rokkaHash: file.rokka_hash,
		};
	}

	function getImageUrl(fileId: string): string {
		return `${apiBaseUrl}assets/${fileId}`;
	}

	function getFileUrl(fileId: string): string {
		return `${apiBaseUrl}files/${fileId}`;
	}
}
