Monitor the document for newly added elements matching a query selector.

# Usage

Include this in your userscript using [`@require`](https://wiki.greasespot.net/Metadata_Block#.40require). It is recommended to [use a permalink](https://docs.github.com/repositories/working-with-files/using-files/getting-permanent-links-to-files) instead of referring to `master`.

```js
// ==UserScript==
// @name example
// @version 1.0
// @require https://github.com/binki/binki-userscript-on-query-selector/raw/master/binki-userscript-on-query-selector.js
// ==UserScript==

binkiOnQuerySelector('a.btn-primary', button => {
  button.click();
});
```

# API

```js
binkiOnQuerySelector(selectors, handler);
```

Parameters:

* `selectors` is a string of CSS selectors to query. Note that, since this is powered by mutation events, it is inappropriate to use pseudo classes such as `:focus` which can change without the document being mutated.
* `handler` is a function with a single `element` parameter which is called for all existing elements matching the `selectors` and any newly added elements matching `selectors`.

Return: none.

```js
binkiBuildOnQuerySelector(element);
```

Parameters:

* `element` is the [`Element`](https://dom.spec.whatwg.org/#interface-element) whose [`querySelector`](https://dom.spec.whatwg.org/#dom-parentnode-queryselector) function is called and which is monitored for mutation events.

Returns: a `function` functioning like `binkiOnQuerySelect()` scoped to the specific `element`.
