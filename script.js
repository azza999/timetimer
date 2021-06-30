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
		this.hourInput = document.getElementById('input-time-hour')
		this.minuteInput = document.getElementById('input-time-minute')
		this._time = null
	},
	initEvent: function() {
		this.hourInput.addEventListener("keydown", e=>this.checkKey(e))
		this.hourInput.addEventListener("keyup", (e)=>{this.checkKey(e);this.setClockDuration(e)})

		this.minuteInput.addEventListener("keydown", e=>this.checkKey(e))
		this.minuteInput.addEventListener("keyup", (e)=>{this.checkKey(e);this.setClockDuration(e)})
	},
	checkKey: function(e) {

		// 키 검증
		const num = ["0","1","2","3","4","5","6","7","8","9"]
		const arrow = ["ArrowUp","ArrowBottom","ArrowLeft","Tab","ArrowRight","Backspace","Delete","End","Home","Insert","PageDown","PageUp",":"]

		console.log(e)

		if (!(num.find(e.key) || arrow.find(e.key))) {
			console.log('default')
			return e.preventDefault()
		}


	},
	setClockDuration: function() {
		Clock.duration = this.time
	},

	get time() {
		return InputController.hourInput.value * 3600 + InputController.minuteInput.value * 60
	}
}

const Clock = {
	init: function() {
		this.cvs = document.getElementById('timer')
		this.ctx = this.cvs.getContext('2d')
		this.startBtn = document.getElementById('start')
		this.pauseBtn = document.getElementById('pause')
		this.hideBtn = document.getElementById('ui-hide')
		this.remainTime = {
			h10: document.getElementById('remain-hour-10'),
			h1: document.getElementById('remain-hour-1'),
			m10: document.getElementById('remain-minute-10'),
			m1: document.getElementById('remain-minute-1'),
			s10: document.getElementById('remain-second-10'),
			s1: document.getElementById('remain-second-1')
		}
		this.title = document.getElementsByTagName('title')[0]

		this.timePrefix = 1 // for debug

		this._duration = Number(InputController.time)
		this.currentTime =  0 //60 * 15 //seconds

		this.speed = 0.01
		this.status = 'stopped'

		// background
		this.bgcvs = document.getElementById('timer-background')
		this.bgctx = this.bgcvs.getContext('2d')

		this.render()
		this.renderBackground()
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
		this.renderCurrentTime()

		Hand.render(this.currentTime, this.duration)
	},
	fillBackground: function() {

		this.ctx.fillStyle = '#d33'
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
	renderCurrentTime: function() {

		let rounded = Math.round(this.currentTime)

		let hour =  Math.floor(rounded / 3600)
		let minute = Math.floor(rounded / 60) - hour * 60
		let second = rounded - hour * 3600 - minute * 60

		this.remainTime.h10.innerHTML = Math.floor(hour / 10)
		this.remainTime.h1.innerHTML = hour % 10
		this.remainTime.m10.innerHTML = Math.floor(minute / 10)
		this.remainTime.m1.innerHTML = minute % 10
		this.remainTime.s10.innerHTML = Math.floor(second / 10)
		this.remainTime.s1.innerHTML = second % 10
	},
	start: function() {
		this.status = 'running'

		this.interval = setInterval(()=>{
			this.currentTime += this.speed
			this.currentTime = Math.round(this.currentTime*100)/100
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

	},

	//background
	renderBackground: function() {

		let deg = 10

		this.bgctx.translate(this.bgcvs.width / 2, this.bgcvs.height / 2)
		
		this.bgctx.beginPath()
		this.bgctx.arc(0,0,30,0,_2PI)
		this.bgctx.fill()

		this.bgctx.strokeStyle = '#000'
		this.bgctx.lineWidth = 3
		
		// this.bgctx.beginPath()
		// this.bgctx.arc(0,0,this.bgcvs.width / 2 - 10, 0, _2PI)
		// this.bgctx.stroke()


		for (let i = 0; i < 360; i += deg) {
			let lengthPrefix = i % 15 == 0 ? 10 : 0
			this.bgctx.lineWidth = i % 15 == 0 ? 3 : 1
			
			this.bgctx.beginPath()
			this.bgctx.moveTo(0,-this.bgcvs.height / 2 + 70)
			this.bgctx.lineTo(0,-this.bgcvs.height / 2 + 50 - lengthPrefix)
			this.bgctx.stroke()
			this.bgctx.rotate(Math.PI * 2 * deg / 360)
		}



		this.bgctx.moveTo
	},
}

const Hand = {
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
		this.ctx.moveTo(-7,0)
		this.ctx.lineTo(0,-this.cvs.height/2)
		this.ctx.lineTo(7,0)
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
