export default class Controller {
  #view
  #camera
  #worker
  #blinkCounter = 0

  constructor({ view, camera, worker, videoUrl }) {
    this.#view = view
    this.#camera = camera
    this.#worker = this.#configureWorker(worker)

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
    this.#view.setVideoSrc = videoUrl
  }

  #configureWorker(worker) {
    let ready = false
    worker.onmessage = ({ data }) => {
      if (data === 'READY') {
        this.#view.enableButton()
        ready = true
        return
      }

      const blinked = data.blinked
      this.#blinkCounter += blinked
      this.#view.togglePlayVideo()
    }

    return {
      send(message) {
        if (!ready) return
        worker.postMessage(message)
      }
    }
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('not detecting eye blink yet')
    return controller.init()
  }

  async init() {
    console.log('init')
  }

  loop() {
    const video = this.#camera.video
    const image = this.#view.getVideoFrame(video)
    this.#worker.send(image)
    this.log('detecting eye blink')

    setTimeout(() => this.loop(), 100)
  }

  log(text) {
    const times = ` - blinked times: ${this.#blinkCounter}`
    this.#view.log(`status ${text}`.concat(this.#blinkCounter ? times : ''))
  }

  onBtnStart() {
    this.log('initializing detection')
    this.#blinkCounter = 0
    this.loop()
  }
}