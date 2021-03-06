// Generated by CoffeeScript 1.4.0
var Generator, Stream, util;

Stream = require('stream');

util = require('util');

/*

`generator([options])`: Generate random CSV data
================================================

This function is provided for conveniency in case you need to generate random CSV data.

Note, it is quite simple at the moment, more functionnalities could come later. The code 
originates from "./samples/perf.coffee" and was later extracted in case other persons need 
its functionnalities.

Options may include

*   duration          Period to run in milliseconds, default to 4 minutes.
*   nb_columns        Number of fields per record
*   max_word_length   Maximum number of characters per word
*   start             Start the generation on next tick, otherwise you must call resume

Starting a generation

  csv = require 'csv'
  generator = csv.generator
  generator(start: true).pipe csv().to.path "#{__dirname}/perf.out"
*/


Generator = function(options) {
  var _base, _base1, _ref, _ref1;
  this.options = options != null ? options : {};
  if ((_ref = (_base = this.options).duration) == null) {
    _base.duration = 4 * 60 * 1000;
  }
  this.options.nb_columns = 8;
  if ((_ref1 = (_base1 = this.options).max_word_length) == null) {
    _base1.max_word_length = 16;
  }
  this.start = Date.now();
  this.end = this.start + this.options.duration;
  this.readable = true;
  if (this.options.start) {
    process.nextTick(this.resume.bind(this));
  }
  return this;
};

Generator.prototype.__proto__ = Stream.prototype;

Generator.prototype.resume = function() {
  var char, column, line, nb_chars, nb_words, _i, _j, _ref, _ref1;
  this.paused = false;
  while (!this.paused && this.readable) {
    if (Date.now() > this.end) {
      return this.destroy();
    }
    line = [];
    for (nb_words = _i = 0, _ref = this.options.nb_columns; 0 <= _ref ? _i < _ref : _i > _ref; nb_words = 0 <= _ref ? ++_i : --_i) {
      column = [];
      for (nb_chars = _j = 0, _ref1 = Math.ceil(Math.random() * this.options.max_word_length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; nb_chars = 0 <= _ref1 ? ++_j : --_j) {
        char = Math.floor(Math.random() * 32);
        column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)));
      }
      line.push(column.join(''));
    }
    this.emit('data', new Buffer("" + (line.join(',')) + "\n", this.options.encoding));
  }
};

Generator.prototype.pause = function() {
  return this.paused = true;
};

Generator.prototype.destroy = function() {
  this.readable = false;
  this.emit('end');
  return this.emit('close');
};

/*
`setEncoding([encoding])`

Makes the 'data' event emit a string instead of a Buffer. 
encoding can be 'utf8', 'utf16le' ('ucs2'), 'ascii', or 
'hex'. Defaults to 'utf8'.
*/


Generator.prototype.setEncoding = function(encoding) {
  return this.options.encoding = encoding;
};

module.exports = function(options) {
  return new Generator(options);
};

module.exports.Generator = Generator;
