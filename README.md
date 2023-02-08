# templateslot.js
Lightweight JavaScript utility for HTML `<template>` .

## Installation (CDN jsDelivr)
Include in your application :
```html
<script src="https://cdn.jsdelivr.net/gh/tmpmachine/templateslot.js@v1.0.0/templateslot.js"></script>
```
or use minified version :
```html
<script src="https://cdn.jsdelivr.net/gh/tmpmachine/templateslot.js@v1.0.0/templateslot.min.js"></script>
```

## Method & Dictionary
fill(options) : Returns `DocumentFragment` of filled cloned nodes.

options
- data `object` : Pass data to be filled unto cloned template.
- template `node` : A clone of template element to be used.
- modifier `function` : callback function on each template clone.

### Reserved Dataset
- data-slot : String path for data. Set element `textContent` value.
- data-slot-html : Set `innerHTML` instead of `textContent`, used together with `data-slot`. Leave the blank for value.
- data-template : CSS query selector for nested template.

## Usage

### Basic Usage
```html
<template id='tmp-list-posts'>
	<div style="border:1px solid;margin-bottom:1rem;padding:1rem;">
	  First name : <span data-slot='name.first'></span>
	  Last name : <span data-slot='name.last'></span>
	</div>
</template>
  
<script>
	let inputData = {
	  name: {
		first: 'Jhon',
		last: 'Doe',
	  },
	};

	let el = window.templateSlot.fill({
	  data: inputData, 
	  template: document.querySelector('#tmp-list-posts').content.cloneNode(true), 
	});
	
	// document.body.append(el);
</script>
```

### Modifier Example

```html
<template id='tmp-list-posts'>
	<div style="border:1px solid;margin-bottom:1rem;padding:1rem;">
		<div class="container">
		  First name : <span data-slot='name.first'></span>
		  Last name : <span data-slot='name.last'></span>
		</div>
	</div>
</template>
  
<script>
	let inputData = {
	  name: {
		first: 'Jhon',
		last: 'Doe',
	  },
	};

	let el = window.templateSlot.fill({
	  data: inputData, 
	  template: document.querySelector('#tmp-list-posts').content.cloneNode(true), 
	  modifier: (el, data) => {
		if (data.name.first == 'Jhon') {
			// do something 
			// el.querySelectorAll('.container')[0].style.background = 'lightblue';
		}
	  },
	});
	
	// document.body.append(el);
</script>
```

### Nested Templates
`data-slot` attribute must be specified. Leave it empty to pass initial data. `data-template` is a CSS query value for template element.

```html
<template id='tmp-list-posts'>
	<div style="border:1px solid;margin-bottom:1rem;padding:1rem;">
	  First name : <span data-slot='name.first'></span>
	  <div data-slot='' data-template='#tmp-summary'></div>
	</div>
</template>

<template id='tmp-summary'>
	<div>
		Last name : <span data-slot='name.last'></span>
	</div>
</template>
  
<script>
	let inputData = {
	  name: {
		first: 'Jhon',
		last: 'Doe',
	  },
	};

	let el = window.templateSlot.fill({
	  data: inputData, 
	  template: document.querySelector('#tmp-list-posts').content.cloneNode(true), 
	});
	
	// document.body.append(el);
</script>
