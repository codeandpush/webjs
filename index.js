/**
 * Created by anthony on 06/07/2017.
 */
class ServerLocation {

    constructor(serialized) {
        this.serialized = serialized || {}
        this._type = ServerLocation
    }

    getPropertValue(propertyName, defaultValue) {
        return this.serialized[propertyName] || defaultValue
    }

    get host() {
        /**
         * "www.bbc.co.uk"
         */
        return this.getPropertValue('host', 'localhost')
    }

    get hostname() {
        /***
         * "www.bbc.co.uk"
         */
        this.getPropertValue('host', 'localhost')
    }


    get href() {
        /***
         * "http://www.bbc.co.uk/news/education-40504754"
         */
        this.getPropertValue('host', 'localhost')
    }

    get origin() {
        /***
         * "http://www.bbc.co.uk"
         */
        this.getPropertValue('host', 'localhost')
    }

    get pathname() {
        /***
         * "/news/education-40504754"
         */
        this.getPropertValue('host', 'localhost')
    }

    get port() {
        return this.getPropertValue('port', '11616')
    }

    get protocol() {
        /***
         * "http:"
         */
        return this.getPropertValue('protocol', 'http:')
    }

    get reload() {

    }


    get search() {

    }

    static get default() {
        return new this.type
    }

    static get none() {
        return null
    }

    static array(...locations) {
    return locations
}

static set type(otherType) {
    this._type = otherType || ServerLocation
}

static get type() {
    return this._type
}
}

const EventEmitter = Emitter

class Renderable {

    constructor(name, superClassName) {
        this.name = name
        this.superClassName = superClassName || null
    }

    get model() {
        return {}
    }

    set mixins(newMixings) {
        this._mixins = newMixings
    }

    get mixins(){
        return this._mixins
    }

    static new(className, ...mixins) {
    let renderable = new Renderable(className)
    renderable.mixins = mixins
    return renderable
}

render(elem) {
    for(let cls of this.mixins){
        elem.classList.add(cls)
    }
    return elem
}
}

function renderNav(elem){
    this.render(elem)

    console.log('nav mixins:', this.mixins)
    console.dir(elem)
    let $elem = $(elem)
    $elem.empty()
    $elem.append($(`<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <a class="navbar-brand" href="#">Navbar</a>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="text" placeholder="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>`))
    return elem
}

function renderContainer(elem){
    this.render(elem)

    let $elem = $(elem)
    $elem.empty()
    $elem.append($(`<div class="jumbotron">
  <h1 class="display-3">Hello, world!</h1>
  <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
  <hr class="my-4">
  <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
  <p class="lead">
    <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
  </p>
</div>`))
    return elem
}


class Application extends EventEmitter {



    constructor(location) {
        super()
        this.location = location || Location.default
        this.defferreds = {}
        this.ID_MASTER = 1
        this.meta = {}
    }


    generateDeffered() {
        let newId = ++this.ID_MASTER
        let deffered = {uuid: newId}

        let promise = new Promise((resolve, reject) => {
            deffered.resolve = resolve
        deffered.reject = reject
    })

        deffered.promise = promise
        return deffered
    }

    get serialized() {
        return {}
    }

    baseElemNames() {
        return ['top-nav', 'main', 'footer']
    }

    baseElemTypeNames() {
        return ['app.navigation', 'app.container', 'app.container']
    }

    static get renderers() {
        return this.RENDERERS
    }

    get servers() {
        if (this._servers) return this._servers
        this._servers = [Application.root]
        return this._servers
    }

    get first() {
        return Application.root
    }

    get last() {
        return _.nth(this.servers, -1)
    }

    listen(server, topic, callback) {

    }

    renderToDocument(doc) {
        let body = $(document.body.getElementsByTagName('main')[0])
        body.empty()

        for (let [elemName, elemTypeName] of _.zip(this.baseElemNames(), this.baseElemTypeNames())) {
            let renderer = this.constructor.renderers[elemTypeName]
            let elem = $(`<${renderer.superName} id="${elemName}" class=""></${renderer.superName}>`)

            renderer.render.call(renderer.type, elem.get(0))
            body.append(elem)
        }

    }

}

Application.RENDERERS = {
    'app.navigation': {
        type: Renderable.new('Navigation', 'navbar', 'navbar-toggleable-md', 'navbar-light', 'bg-faded'),
        superName: 'nav',
        render: renderNav
    },
    'app.container': {
        type: Renderable.new('Main', 'container'),
        superName: 'main',
        render: renderContainer
    }
}

class Server extends EventEmitter {
    constructor(location) {
        super()
        this.location = location
        this._socket = null
    }

    get connected() {
        return this._socket === null
    }

    connect() {
        return new Promise((resolve, reject) => {
                resolve(this)
    })
    }

}

Application.root = new Server(Location.default)
app = new Application()
app.renderToDocument(document)