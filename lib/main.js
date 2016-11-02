'use babel';

export default {
	event: null,
	
	activate(state) {
		this.event = atom.workspace.observeTextEditors(this.callback.bind(this));
	},
	
	callback(editor) {
		if (editor.getGrammar() != atom.grammars.nullGrammar) {
			return;
		}
		
		line = editor.lineTextForBufferRow(0);
		if (! line.startsWith('#!')) {
			return;
		}
		
		if (! line.endsWith('python')) {
			return;
		}
		
		grammar = atom.grammars.grammarForScopeName('source.python');
		if (grammar == null) {
			return;
		}
		
		editor.setGrammar(grammar);
	},
	
	deactivate() {
		if (this.event != null) {
			this.event.dispose();
		}
	}
};
