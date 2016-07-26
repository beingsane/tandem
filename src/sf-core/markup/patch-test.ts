import {
  diff
} from './diff';

import {
  INode
} from './base';

import { patch } from './patch';
import { expect } from 'chai';

describe(__filename + '#', function() {
  [
    // node value change
    ['hello', 'world'],

    // add attribute
    ['<div />', '<div id="b" />'],

    // update attribute
    ['<div id="a" />', '<div id="b" />'],

    // remove attribute
    ['<div  id="b" />', '<div />'],

    // add child
    ['<div />', '<div>hello</div>'],

    // remove child
    ['<div />', '<div></div>'],

    // replace child
    ['<div />', '<div><!--hello--></div>'],

    // move child
    ['<div><span></span>ab</div>', '<div>ab<span></span></div>'],

    // Other Smokey, Mc. Smoke tests

    ['<div>hello</div>', '<div>hello<!--world--></div>'],

    // <li>1</li><li>2</li><li>3</li><li>0</li>
    // <li>3</li><li>1</li><li>2</li><li>0</li>

    [
      `<div><ul><li>1</li><li>2</li><li>3</li></ul></div>`,
      `<div><ul><li>3</li><li>2</li><li>1</li><li>0</li></ul></div>`
    ],

    [
      `<div>
          <h1>1</h1>
          <h2>2</h2>
          <h3>3</h3>
        </div>`,
      `<div>
          <h3>3</h3>
          <h2>2</h2>
          <h1>1</h1>
        </div>`
    ],


  ].forEach(function([source, destSource]) {
    it(`can diff and patch ${source} to ${destSource}`, function() {
      var a = document.createElement('div');
      a.innerHTML = source.replace(/>[\s\n\t\r]+</g, "><");
      var b = document.createElement('div');
      b.innerHTML = destSource.replace(/>[\s\n\t\r]+</g, "><");
      const changes = diff(a as any, b as any);
      patch(a as any, changes);
      expect(a.innerHTML).to.equal(b.innerHTML);
    });
  });
});