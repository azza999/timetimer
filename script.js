const _2PI = Math.PI * 2


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
		this.input.addEventListener("keydown", (e)=>this.checkKey(e))
		this.input.addEventListener("keyup", (e)=>this.setClockDuration(e))
	},
	checkKey: function(e) {

		const num = ["0","1","2","3","4","5","6","7","8","9"]
		const arrow = ["ArrowUp","ArrowBottom","ArrowLeft","ArrowRight","Backspace","Delete","End","Home","Insert","PageDown","PageUp"]

		if (!(num.find(e.key) || arrow.find(e.key))) {
			e.preventDefault()
		}
	},
	setClockDuration: function() {
		Clock.duration = this.input.value
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

		this._duration = Number(InputController.time)
		this.currentTime =  0 //60 * 15 //seconds

		this.speed = 0.1

		this.render()
	},
	//남은시간 수정시 시간 및 상태 설정
	set duration(val) {
		this.pause()
		this._duration = val
		this.currentTime = 0
		this.render()
	},
	initEvent: function () {
		this.startBtn.addEventListener("click",e=>{
			this.start()
			this.toggleBtnVisible()
		})
		this.pauseBtn.addEventListener("click",e=>{
			this.pause()
			this.toggleBtnVisible()
		})
	},
	render: function() {

		this.clockRect = {
			top : {x: this.cvs.width/2, y: 0},
			bottom : {x: this.cvs.width/2, y: this.cvs.height},
			left : {x: 0, y: this.cvs.height/2},
			right : {x: this.cvs.width, y: this.cvs.height/2},
			center : {x: this.cvs.width/2 ,y: this.cvs.height/2}
		}

		this.fillBackground()

		this.fillPassedTime()
	},
	fillBackground: function() {

		this.ctx.fillStyle = '#d44'
		this.ctx.beginPath()
		this.ctx.arc(this.clockRect.center.x,this.clockRect.center.y,this.cvs.width / 2 - 1,0,Math.PI * 2)
		this.ctx.fill()

	},
	fillPassedTime: function() {
		this.ctx.fillStyle = '#fff'
		this.ctx.beginPath()
		this.ctx.moveTo(this.clockRect.center.x, this.clockRect.center.y)
		this.ctx.lineTo(this.clockRect.top.x, this.clockRect.top.y)

		let deg = this.remainTime2Degree(this.currentTime)

		this.ctx.arc(this.clockRect.center.x,this.clockRect.center.y,this.cvs.width/2,-Math.PI / 2, -Math.PI / 2 + deg)
		this.ctx.fill()
	},
	remainTime2Degree: function(time) {
		let percentage = time / this._duration
		let deg = _2PI * percentage
		return deg
	},
	start: function() {
		this.interval = setInterval(()=>{
			this.currentTime += this.speed
			this.render()
		},1000 * this.speed / 10)
	},
	pause: function() {
		console.log(this.interval)
		clearInterval(this.interval)
	},

	// ui control
	toggleBtnVisible: function() {
		this.startBtn.classList.toggle('visible')
		this.pauseBtn.classList.toggle('visible')
	}
}

window.onload = e=>{
	InputController.init()
	InputController.initEvent()
	Clock.init()
	Clock.initEvent()
}
