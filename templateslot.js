window.templateSlot = (function() {
      
  let SELF = {};
  
  function getErrorObject(){
	try { throw Error('') } catch(err) { return err; }
  }
  
  function logErrorLine() {
	let err = getErrorObject();
	let caller_lines = err.stack.split('\n');
	let caller_line = err.stack.split('\n')[caller_lines.length-1];
	let index = caller_line.indexOf('at ');
	let clean = caller_line.slice(index+2, caller_line.length);
	return clean;
  }
  
  // https://www.30secondsofcode.org/js/s/get
  const getDataFromStrPath = (from, ...selectors) =>
  [...selectors].map(s =>
	s
	  .replace(/\[([^\[\]]*)\]/g, '.$1.')
	  .split('.')
	  .filter(t => t !== '')
	  .reduce((prev, cur) => prev && prev[cur], from)
  );
  
  SELF.fill = function(options) {
	let depth = 0;
	let errorLogs = [];
	let el = fillSlotDepth(options.data, options.template, options.modifier, depth, errorLogs);
	for (let log of errorLogs) {
	  let logMsg = logErrorLine();
	  if (log.type == 'not-found') {
		console.error('data-template="'+log.templateId+'": template not found at' + logMsg);
	  } else if (log.type == 'multi-element') {
		console.error('data-template="'+log.templateId+'": multiple template elements found. Using the first one.' + logMsg);          
	  }
	}
	return el;
  };
  
  function fillSlotDepth(data, templateEl, modifierFunc, depth, errorLogs, templateId) {
	
	let docFrag = document.createDocumentFragment();
	if (Array.isArray(data)) {
	   if (data.length == 1 && Object.is(data[0], undefined)) {
	     return docFrag;
	   }
	  for (let d of data) {
		let el = fillSlotDepth(d, templateEl.cloneNode(true), modifierFunc, depth + 1, errorLogs, templateId);
		docFrag.append(el)
	  }
	  return docFrag
	}
	
	for (let el of templateEl.querySelectorAll('[data-slot]')) {
	  let keyPath = el.dataset.slot;
	  let slotData = getDataFromStrPath(data, keyPath);
	  
	  if (el.matches('[data-template]')) {
		let templateId = el.dataset.template;
		if (document.querySelectorAll(templateId).length > 0) {
		  if (document.querySelectorAll(templateId).length > 1) {
			if (!errorLogs.find(x => x.type == 'multi-element' && 
				x.templateId == templateId)) {
				
			  errorLogs.push({
				templateId,
				type: 'multi-element',
			  })
			}
		  }
		  let elRes = fillSlotDepth(slotData, document.querySelector(templateId).content.cloneNode(true), modifierFunc, depth, errorLogs, templateId);
		  el.append(elRes);
		} else {
		  if (!errorLogs.find(x => x.type == 'not-found' && 
			  x.templateId == templateId)) {
			  
			errorLogs.push({
			  templateId,
			  type: 'not-found',
			})
		  }
		}
	  } else {
		if (el.matches('[data-slot-html]')) {
		  el.innerHTML = slotData;
		} else {
		  el.textContent = slotData;
		}
	  }
	}
	
	if (modifierFunc) {
	  modifierFunc(templateEl, data, templateId);
	}
	
	return templateEl;
  }
  
  return SELF;
  
})();
