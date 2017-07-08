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
        this._label = name
        this.superClassName = superClassName || null
    }
    
    get label(){
        return this._label
    }
    
    get model() {
        return {}
    }
    
    set mixins(newMixings) {
        this._mixins = newMixings
    }
    
    get mixins() {
        return this._mixins
    }
    
    static new(className, ...mixins) {
        let renderable = new Renderable(className)
        renderable.mixins = mixins
        return renderable
    }
    
    render(elem) {
        for (let cls of this.mixins) {
            elem.classList.add(cls)
        }
        return elem
    }
}

function renderNav(elem) {
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

function renderContainer(elem) {
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
    
    when(...args) {
        return super.on(...args)
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
    
    baseElemTypeNames() {
        return []
    }
    
    static get controllers() {
        return this.CONTROLLERS
    }
    
    get controllers(){
        return this.constructor.CONTROLLERS
    }
    
    static get modelTypes() {
        return this.MODELS
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
    
    addController(controller) {
        this.controllers[controller.label] = controller
    }
    
    renderToDocument(doc) {
        let body = $(document.body.getElementsByTagName('main')[0])
        body.empty()
        
        for (let elemTypeName of this.baseElemTypeNames()) {
            let controller = this.constructor.controllers[elemTypeName]
            let elem = $(`<${controller.tagName} id="${elemTypeName}" class=""></${controller.tagName}>`)
            body.append(elem)
    
            controller.render(elem.get(0))
        }
        
    }
    
}

class Controller extends Renderable {
    
    constructor(name, opts){
        super(name, opts.mixins)
        this._name = name
        this.tagName = (opts || {}).tagName || 'div'
        this.mixins = opts.mixins || []
    }
    
    get elem(){
        return document.getElementById(this._name)
    }
  
    
}

class Model {
    
    constructor(serialized) {
        this.serialized = serialized || {}
    }
    
    static get attributeNames() {
        return []
    }
    
    get elem() {
        return this.serialized['_elem']
    }
    
    static fromElem(elem, attributeNames) {
        let serialized = {_elem: elem}
        attributeNames = attributeNames || []
        for (let attr of attributeNames) {
            let dataKey = `data-${attr}`
            let dataValue = elem.attributes[dataKey] || null
            if (dataValue !== null) {
                serialized[attr] = dataValue.nodeValue
            }
        }
        return new this(serialized)
    }
}

Application.MODELS = {}

Application.CONTROLLERS = {}

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