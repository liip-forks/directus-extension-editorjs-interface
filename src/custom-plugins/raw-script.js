import RawToolTool from '@editorjs/raw';

export default class extends RawToolTool {
	/**
	 * Get Tool toolbox settings
	 * icon - Tool icon's SVG
	 * title - title to show in toolbox
	 *
	 * @returns {{icon: string, title: string}}
	 */
	static get toolbox() {
		return {
			icon: '<svg width="19" height="13" viewBox="0 0 19 13"><path d="M18.004 5.794c.24.422.18.968-.18 1.328l-4.943 4.943a1.105 1.105 0 1 1-1.562-1.562l4.162-4.162-4.103-4.103A1.125 1.125 0 1 1 12.97.648l4.796 4.796c.104.104.184.223.239.35zm-15.142.547l4.162 4.162a1.105 1.105 0 1 1-1.562 1.562L.519 7.122c-.36-.36-.42-.906-.18-1.328a1.13 1.13 0 0 1 .239-.35L5.374.647a1.125 1.125 0 0 1 1.591 1.591L2.862 6.341z"/></svg>',
			title: 'Raw Script',
		};
	}
}
