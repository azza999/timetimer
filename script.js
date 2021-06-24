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
		return InputController.input.value
	}
}

const Clock = {
	init: function() {
		this.cvs = document.getElementById('timer')
		this.ctx = this.cvs.getContext('2d')
		this.startBtn = document.getElementById('start')
		this.pauseBtn = document.getElementById('pause')
		this.title = document.getElementsByTagName('title')[0]

		this.timePrefix = 1 // for debug

		this._duration = Number(InputController.time)
		this.currentTime =  0 //60 * 15 //seconds

		this.speed = 0.01
		this.status = 'stopped'

		this.render()
	},
	//남은시간 수정시 시간 및 상태 설정
	set duration(val) {
		this.pause()
		this._duration = val
		this.currentTime = 0
		this.render()
	},
	get duration() {
		return this._duration
	},
	initEvent: function () {
		this.startBtn.addEventListener("click",e=>{
			this.start()
		})
		this.pauseBtn.addEventListener("click",e=>{
			this.pause()
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
		this.renderTitle()

		Hand.render(this.currentTime, this.duration)
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

		let deg = this.remainTime2Degree()

		this.ctx.arc(this.clockRect.center.x,this.clockRect.center.y,this.cvs.width/2,-Math.PI / 2, -Math.PI / 2 + deg)
		this.ctx.fill()
	},
	remainTime2Degree: function() {
		let percentage = this.currentTime / this._duration
		let deg = _2PI * percentage
		return deg
	},
	renderTitle: function() {
		this.title.innerHTML = Math.floor(this.currentTime) + ' - ' + this.status
	},
	start: function() {
		this.status = 'running'

		this.interval = setInterval(()=>{
			this.currentTime += this.speed
			this.render()

			this.currentTime >= this.duration ? this.stop() : null;

		},1000 * this.speed / this.timePrefix)
		this.updateUI()
	},
	pause: function() {
		this.status = 'paused'

		clearInterval(this.interval)
		this.updateUI()
	},
	stop: function() {
		this.status = 'stopped'

		this.currentTime = 0
		clearInterval(this.interval)

		this.render()

		this.updateUI()

		alert('timer end!')
	},

	// ui control
	updateUI: function() {
		if(this.status == 'running') {
			this.startBtn.classList.remove('visible')
			this.pauseBtn.classList.add('visible')
		} else {
			this.startBtn.classList.add('visible')
			this.pauseBtn.classList.remove('visible')
		}

	}
}

let Hand = {
	init: function() {
		this.cvs = document.getElementById('timer-hand')
		this.ctx = this.cvs.getContext('2d')
		this.handRect = {
			center: {x: this.cvs.width / 2, y: this.cvs.height / 2}
		}

		this.deg = null;

	},
	render: function(cTime,duration) {


		this.deg = cTime / duration * Math.PI * 2

		this.cvs.width = this.cvs.width

		this.renderCenter()
		this.renderHand()

	},
	renderCenter: function() {

		this.ctx.fillStyle = "#333"
		this.ctx.beginPath()
		this.ctx.arc(this.handRect.center.x, this.handRect.center.y, this.cvs.width / 4, 0, _2PI)
		this.ctx.fill();
	},
	renderHand: function() {
		this.ctx.fillStyle = '#333'

		
		this.ctx.translate(this.cvs.width / 2,this.cvs.height / 2);
		this.ctx.rotate(this.deg)

		this.ctx.beginPath()
		this.ctx.moveTo(-5,0)
		this.ctx.lineTo(0,-this.cvs.height/2)
		this.ctx.lineTo(5,0)
		this.ctx.fill()

		this.ctx.rotate(-this.deg)
		this.ctx.translate(-this.cvs.width / 2, this.cvs.height / 2);
	},
}

window.onload = e=>{
	InputController.init()
	InputController.initEvent()
	
	Hand.init();
	Hand.render();
	
	Clock.init()
	Clock.initEvent()

}
