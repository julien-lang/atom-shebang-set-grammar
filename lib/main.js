'use babel';

import { CompositeDisposable } from 'atom';

export default {
	events: null,
	timer1: null,
	
	activate(state) {
		this.subscriptions = new CompositeDisposable();
		this.subscriptions.add(
			atom.workspace.observeTextEditors(this.callback.bind(this))
		);
		this.subscriptions.add(
			atom.grammars.onDidAddGrammar(this.callback_grammar_added.bind(this))
		);
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
		if (this.events != null) {
			this.events.dispose();
			this.events = null;
		}
		
		if (this.timer1 != null) {
			clearTimeout(this.timer1);
			this.timer1 = null;
		}
	}
};
