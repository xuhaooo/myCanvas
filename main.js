var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var penWidth = 5

// document.addEventListener('touchmove', function (e) { e.preventDefault();}, false);
autoSetCanvasSize()
listenToUser()
initColor()
initPenWidth()

function autoSetCanvasSize() {
	setCanvasSize()
	window.onresize = function () {
		setCanvasSize()
	}
	function setCanvasSize() {
		canvas.width = document.documentElement.clientWidth
		canvas.height = document.documentElement.clientHeight
	}
}
save.onclick = function () {
	var url = canvas.toDataURL('image/png')
	// downloadPng.href = url;
	// downloadPng.click()
	var a = document.createElement('a')
	document.body.appendChild(a)
	a.href = url
	a.download = '我的画儿'
	a.target = '_blank'
	a.click()
}
function initPenWidth() {
	thick.onclick = function () {
		penWidth = 10
		context.lineWidth = penWidth
	}
	thin.onclick = function () {
		penWidth = 5
		context.lineWidth = penWidth
	}
}
function initColor() {
	var black = document.getElementById('black')
	var red = document.getElementById('red')
	var yellow = document.getElementById('yellow')
	selectColor(black)
	selectColor(red)
	selectColor(yellow)
	function selectColor(color) {
		color.onclick = function () {
			var childs = color.parentNode.children
			for (var i = 0; i < childs.length; i++) {
				childs[i].classList.remove('selected')
			}
			color.classList.add('selected')
			var activeColor = color.id
			canvasColor(activeColor)
			function canvasColor(color) {
				context.fillStyle = color
				context.strokeStyle = color
			}
		}
	}
}

bin.onclick = function () {
	context.clearRect(
		0,
		0,
		document.documentElement.clientWidth,
		document.documentElement.clientHeight
	)
}

function drawLine(x, y, x2, y2) {
	context.beginPath()
	context.moveTo(x, y)
	context.lineWidth = penWidth
	context.lineTo(x2, y2)
	context.stroke()
}

function drawCircle(x, y, radius) {
	context.beginPath()
	context.arc(x, y, radius, 0, Math.PI * 2)
	context.fill()
}

function listenToUser() {
	var eraser = document.getElementById('eraser')
	var pen = document.getElementById('pen')
	var bin = document.getElementById('bin')

	var enableEraser = false
	var using = false
	var lastPoint = {
		x: undefined,
		y: undefined,
	}
	//特性测试
	if (document.body.ontouchstart !== undefined) {
		canvas.ontouchstart = function (touch) {
			var x = touch.touches[0].clientX
			var y = touch.touches[0].clientY
			using = true
			lastPoint = {
				x: x,
				y: y,
			}
			if (enableEraser) {
				context.clearRect(x - 5, y - 5, 10, 10)
			} else {
				drawCircle(x, y, penWidth / 2)
			}
		}
		canvas.ontouchmove = function (touch) {
			if (!using) {
				return
			}
			var y = touch.touches[0].clientY
			var x = touch.touches[0].clientX
			var newPoint = {
				x: x,
				y: y,
			}
			if (enableEraser) {
				context.clearRect(x - 5, y - 5, 10, 10)
			} else {
				drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
				lastPoint = newPoint
			}
		}
		canvas.ontouchend = function () {
			using = false
			if (!enableEraser) {
				drawCircle(lastPoint.x, lastPoint.y, penWidth / 2)
			}
		}
	} else {
		canvas.onmousedown = function (mouse) {
			var x = mouse.clientX
			var y = mouse.clientY
			using = true
			lastPoint = {
				x: x,
				y: y,
			}
			if (enableEraser) {
				context.clearRect(x - 5, y - 5, 10, 10)
			} else {
				drawCircle(x, y, penWidth / 2)
			}
		}
		canvas.onmousemove = function (mouse) {
			if (!using) {
				return
			}
			var y = mouse.clientY
			var x = mouse.clientX
			var newPoint = {
				x: x,
				y: y,
			}
			if (enableEraser) {
				context.clearRect(x - 5, y - 5, 10, 10)
			} else {
				drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
				lastPoint = newPoint
			}
		}
		canvas.onmouseup = function () {
			using = false
			if (!enableEraser) {
				drawCircle(lastPoint.x, lastPoint.y, penWidth / 2)
			}
		}
	}
	eraser.onclick = function () {
		enableEraser = true
		eraser.classList.add('active')
		pen.classList.remove('active')
	}
	pen.onclick = function () {
		enableEraser = false
		pen.classList.add('active')
		eraser.classList.remove('active')
	}
}
