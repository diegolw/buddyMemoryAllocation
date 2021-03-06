// por Diego Lagranha Weiss, diegolweiss@gmail.com

// A técnica buddy memory allocation é baseada em um algoritmo de alocação de
// memória que divide a memória em partições para tentar satisfazer uma
// requisição de memória da forma mais adequada possível. Este sistema utiliza
// a divisão da memória em metades para tentar proporcionar um best-fit.
// http://pt.wikipedia.org/wiki/Buddy_memory_allocation

var MAX_BUDDY = 1024,
	MIN_BUDDY = 64;

var vector = new Array(MAX_BUDDY),
	buddies = [];

var firstBuddy = {
	size: MAX_BUDDY
};

buddies.push(firstBuddy);

function request(buddy) {
	var position = lowerPartition(buddy);
	var halfSize = buddies[position].size / 2;
	if (halfSize > buddy.size && halfSize >= MIN_BUDDY) {
		splitBuddy(position);
		request(buddy);
	} else {
		buddies[position].process = buddy.process;
	}
}

function lowerPartition(buddy) {
	var error, position;
	for (var i = 0; i < buddies.length; i++) {
		var b = buddies[i];
		if (b.process === buddy.process) {
			throw new Error('Memória já alocada para esse processo!');
		} 
		if (!b.process && b.size > buddy.size) {
			if (typeof position === 'undefined') {			
				position = i;
			}
		}
	}
	return position;
}

function splitBuddy(i) {
	var end = buddies.slice(i);
	var size;
	if (buddies[i + 1]) {
		size = buddies[i + 1].size / 2;
	} else {
		size = MAX_BUDDY / 2;
	}
	buddies.splice(i + 1);
	buddies[i] = {size: size};
	buddies = buddies.concat(end);
	buddies[i + 1].size = size;
}

function release(process) {
	for (var i = 0; i < buddies.length; i++) {
		var b = buddies[i];
		if (b.process === process) {
			return delete b.process;
		}
	}
	throw new Error('Processo inválido!');
}
