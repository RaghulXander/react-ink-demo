#!/usr/bin/env node
'use strict';
const React = require('react');
const {render} = require('ink');
const meow = require('meow');

const ui = importJsx('./ui.js');

const cli = meow(`
	Usage
	  $ roles-scope-cli
`);

render(React.createElement(ui, cli.flags));
