'use babel';

export default {
	event1: null,
	
	activate(state) {
		this.event1 = atom.workspace.observeTextEditors(this.callback.bind(this));
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
		if (this.event1 != null) {
			this.event.dispose();
		}
	}
};
