'use babel';

import { CompositeDisposable } from 'atom';
import packageConfig from './config-schema.json';

export default {
	config: packageConfig,
	events: null,
	timer1: null,
	bin2grammar: {
		'bash': 'shell',
		'sh': 'shell'
	},
	
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
		var changeGrammarIfAlreadySet = atom.config.get('shebang-set-grammar.changeGrammarIfAlreadySet');
		if (! changeGrammarIfAlreadySet) {
			if (editor.getGrammar() != atom.grammars.nullGrammar) {
				return;
			}
		}
		
		line = editor.lineTextForBufferRow(0);
		if (! line.startsWith('#!')) {
			return;
		}
		
		var bin_name = this.get_shebang_basename(line.substr(2).trim());
		if (bin_name in this.bin2grammar) {
			bin_name = this.bin2grammar[bin_name];
		}
		
		grammar = atom.grammars.grammarForScopeName('source.'+bin_name);
		if (grammar == null) {
			return;
		}
		
		editor.setGrammar(grammar);
	},
	
	get_shebang_basename(line) {
		/*
			/usr/bin/python 	=> python
			/usr/bin/python -e 	=> python
			/bin/bash 			=> bash
			perl -e 			=> perl
		*/
		
		var parts = line.split(/[\s\t]+/);
		for (var i=parts.length-1; i>0; i--) {
			if (parts[i].startsWith("-")) {
				continue;
			}
			
			return parts[i];
		}
		
		parts = parts[0].split("/");
		return parts[parts.length - 1];
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
