Array.prototype.find = function(finding) {
	let newArr = []
	this.map(ele=>{
		if (ele == finding)
			newArr.push(ele)
	})
	return newArr.length ? newArr : null;
};


const InputController = {
	init: function() {
		this.input = document.getElementById('input-time')
		console.log('init')
		this._time = null
	},
	initEvent: function() {
		this.input.addEventListener("keydown", this.checkKey)
	},
	checkKey: function(e) {

		const num = ["0","1","2","3","4","5","6","7","8","9"]
		const arrow = ["ArrowUp","ArrowBottom","ArrowLeft","ArrowRight","Backspace","Delete","End","Home","Insert","PageDown","PageUp"]

		if (!(num.find(e.key) || arrow.find(e.key))) {
			e.preventDefault()
		}
		console.log(InputController.time)
	},
	get time() {
		return InputController.input.value.match(/\d\d\d\d/) ? InputController.input.value : null
	}
}

const Clock = {
	init: function() {
		this.cvs = document.getElementById('timer')
		this.ctx = this.cvs.getContext('2d')
		this.startBtn = document.getElementById('start')
		this.pauseBtn = document.getElementById('pause')

		this.duration = Number(InputController.time) * 60
		this.currentTime = 60 * 14 //seconds

		this.render()
	},
	initEvent: function() {

	},
	render: function() {

		let width = this.cvs.width
		let height = this.cvs.height

		let clockRect = {
			top : {x: width/2, y: 0},
			bottom : {x: width/2, y: height},
			left : {x: 0, y: height/2},
			right : {x: width, y: height/2},
			center : {x: width/2 ,y: height/2}
		}


		this.ctx.fillStyle = '#d44'

		this.ctx.beginPath()
		this.ctx.arc(clockRect.center.x,clockRect.center.y,width/2,0,Math.PI * 2)
		this.ctx.fill()

		this.ctx.fillStyle = '#fff'

		this.ctx.beginPath()
		this.ctx.arc(clockRect.center.x,clockRect.center.y,width/2,-Math.PI /2,Math.PI * 2 * (this.currentTime / this.duration) * 100 )
		this.ctx.fill()

		console.log(this.currentTime / this.duration * 100)


	},
}

window.onload = e=>{
	InputController.init()
	InputController.initEvent()
	Clock.init()
	Clock.initEvent()
}