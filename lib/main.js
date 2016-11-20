'use babel';

import { CompositeDisposable } from 'atom';
import packageConfig from './config-schema.json';

export default {
	config: packageConfig,
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
		var changeGrammarIfAlreadySet = atom.config.get('shebang-set-grammar.changeGrammarIfAlreadySet');
		if (! changeGrammarIfAlreadySet) {
			if (editor.getGrammar() != atom.grammars.nullGrammar) {
				return;
			}
		}
		
		var bin_name = this.read_shebang(editor);
		if (bin_name == null) {
			return;
		}
		
		var aliases = atom.config.get('shebang-set-grammar.aliases');
		try {
			aliases = JSON.parse(aliases);
		}
		catch(err) {
			console.error("Inavlid \"aliases\" setting value: "+err);
			aliases = {};
		}
		
		if (bin_name in aliases) {
			bin_name = aliases[bin_name];
		}
		
		grammar = atom.grammars.grammarForScopeName('source.'+bin_name);
		if (grammar == null) {
			return;
		}
		
		editor.setGrammar(grammar);
	},
	
	read_shebang(editor) {
		/*
			#! /usr/bin/python 	=> python
			#! /usr/bin/python -e 	=> python
			#! /bin/bash 			=> bash
			#! perl -e 			=> perl
		*/
		
		var line = editor.lineTextForBufferRow(0);
		if (! line.startsWith('#!')) {
			return null;
		}
		
		line = line.substr(2).trim();
		
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
