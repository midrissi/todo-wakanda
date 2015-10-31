(function() {
	var m = model.Task;

	m.events.init = function () {
		this.created_at = new Date();
	};

	(m.setAll = function(isDone) {
		var col;

		if(isDone === true){
			col = this.query('done === null || done === false');
		}else{
			col = this.query('done === true');
		}
		
		col.forEach(function(t) {
			t.done = isDone === true;
			t.save();
		});
	}).scope = 'public';

	(m.clearCompleted = function() {
		this.query('done === :1', true).remove();
		return true;
	}).scope = 'public';
})();