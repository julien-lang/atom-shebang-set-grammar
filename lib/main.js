'use babel';

export default {
	event1: null,
	event2: null,
	timer1: null,
	
	activate(state) {
		this.event1 = atom.workspace.observeTextEditors(this.callback.bind(this));
		this.event2 = atom.grammars.onDidAddGrammar(this.callback_grammar_added.bind(this));
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
	
	callback_grammar_added(grammar) {
		if (this.timer1 != null) {
			clearTimeout(this.timer1);
			this.timer1 = null;
		}
		
		var self = this;
		this.timer1 = setTimeout(function(){self.callback_all_grammars_loaded();}, 500);
	},
	
	callback_all_grammars_loaded() {
		this.timer1 = null;
		var editors = atom.workspace.getTextEditors();
		for (i = 0; i < editors.length; i++) {
			this.callback(editors[i]);
		}
	},
	
	deactivate() {
		if (this.event1 != null) {
			this.event.dispose();
		}
		
		if (this.event2 != null) {
			this.event2.dispose();
		}
		
		if (this.timer1 != null) {
			clearTimeout(this.timer1);
			this.timer1 = null;
		}
	}
};
